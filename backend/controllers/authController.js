const bcrypt = require("bcrypt");
const User = require("../models/User");
const Otp = require("../models/Otp");
const { generateOtp, getExpiry } = require("../utils/otp");
const { sendOtpEmail } = require("../utils/email");
const { generateToken } = require("../utils/jwt");

exports.signup = async (req, res) => {
  try {
    console.log("Signup attempt:", req.body);
    const { fullName, email, username, password } = req.body;
    if (!fullName || !email || !username || !password) {
      console.log("Signup error: missing fields");
      return res.status(400).json({ error: "All fields are required" });
    }
    // Check for existing user by email
    let emailExists = await User.findOne({ email });
    let usernameExists = await User.findOne({ username });
    // If both email and username match and are verified, block
    if (
      emailExists &&
      usernameExists &&
      emailExists._id.equals(usernameExists._id) &&
      emailExists.isVerified
    ) {
      console.log("Signup error: email already registered");
      return res.status(409).json({ error: "Email already registered" });
    }
    // If email exists and not verified, update info and resend OTP
    if (emailExists && !emailExists.isVerified) {
      let updateFields = {};
      if (emailExists.fullName !== fullName) updateFields.fullName = fullName;
      if (emailExists.username !== username) updateFields.username = username;
      if (password) {
        updateFields.password = await bcrypt.hash(password, 10);
      }
      if (Object.keys(updateFields).length > 0) {
        await User.updateOne({ email }, { $set: updateFields });
      }
      const otp = generateOtp();

      await Otp.deleteMany({ email });
      await Otp.create({ email, otp, expiresAt: getExpiry() });
      console.log("Resending OTP email to:", email, "OTP:", otp);
      await sendOtpEmail(email, otp);
      return res
        .status(200)
        .json({ message: "OTP resent, please verify your email" });
    }
    // If username exists and not verified, update info and resend OTP
    if (usernameExists && !usernameExists.isVerified) {
      let updateFields = {};
      if (usernameExists.fullName !== fullName)
        updateFields.fullName = fullName;
      if (usernameExists.email !== email) updateFields.email = email;
      if (password) {
        updateFields.password = await bcrypt.hash(password, 10);
      }
      if (Object.keys(updateFields).length > 0) {
        await User.updateOne({ username }, { $set: updateFields });
      }
      const otp = generateOtp();
      await Otp.deleteMany({ email: usernameExists.email });
      await Otp.create({
        email: usernameExists.email,
        otp,
        expiresAt: getExpiry(),
      });
      console.log("Resending OTP email to:", usernameExists.email, "OTP:", otp);
      await sendOtpEmail(usernameExists.email, otp);
      return res
        .status(200)
        .json({ message: "OTP resent, please verify your email" });
    }
    // If only email exists and is verified, block
    if (emailExists && emailExists.isVerified) {
      console.log("Signup error: email already registered");
      return res.status(409).json({ error: "Email already registered" });
    }
    // If only username exists and is verified, block
    if (usernameExists && usernameExists.isVerified) {
      console.log("Signup error: username already taken");
      return res.status(409).json({ error: "Username already taken" });
    }
    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      username,
      password: hashedPassword,
    });
    const otp = generateOtp();
    await Otp.create({ email, otp, expiresAt: getExpiry() });
    console.log("Sending OTP email to:", email, "OTP:", otp);
    await sendOtpEmail(email, otp);
    console.log("OTP email sent successfully");
    res
      .status(201)
      .json({ message: "Signup successful, please verify your email" });
  } catch (err) {
    console.error("Signup error:", err);
    if (err && err.message) {
      res.status(500).json({ error: "Server error: " + err.message });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ error: "Email and OTP required" });
    const otpDoc = await Otp.findOne({ email, otp });
    if (!otpDoc) return res.status(400).json({ error: "Invalid OTP" });
    if (otpDoc.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ error: "OTP expired" });
    }
    await User.updateOne({ email }, { isVerified: true });
    await Otp.deleteOne({ _id: otpDoc._id });
    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("OTP verification error:", err);
    if (err && err.message) {
      res.status(500).json({ error: "Server error: " + err.message });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
};

exports.login = async (req, res) => {
  try {
    console.log("Login attempt:", req.body);
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      console.log("Login error: missing fields");
      return res.status(400).json({ error: "All fields are required" });
    }
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (!user) {
      console.log("Login error: user not found");
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.isVerified) {
      console.log("Login error: email not verified");
      return res.status(403).json({ error: "Email not verified" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("Login error: incorrect password");
      return res.status(401).json({ error: "Incorrect password" });
    }
    const token = generateToken(user);
    // Subscription expiry logging
    let subMsg = "";
    if (
      user.isSubscribed &&
      user.subscriptionEnd &&
      new Date(user.subscriptionEnd) > new Date()
    ) {
      const daysLeft = Math.ceil(
        (new Date(user.subscriptionEnd) - new Date()) / (1000 * 60 * 60 * 24),
      );
      subMsg = `Subscription expires in ${daysLeft} day(s) (on ${user.subscriptionEnd.toISOString()})`;
    } else if (user.subscriptionEnd) {
      subMsg = `Subscription expired on ${user.subscriptionEnd.toISOString()}`;
    } else {
      subMsg = "No subscription.";
    }
    console.log(
      "Login success for user:",
      user.email || user.username,
      "|",
      subMsg,
    );
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        subscriptionEnd: user.subscriptionEnd,
        isSubscribed: user.isSubscribed,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    if (err && err.message) {
      res.status(500).json({ error: "Server error: " + err.message });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
};
