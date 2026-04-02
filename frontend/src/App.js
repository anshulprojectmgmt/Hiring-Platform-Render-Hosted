import "./App.css";
import CreateTest from "./screens/createtest/CreateTest";
import PaymentPage from "./screens/createtest/PaymentPage";
import Signup from "./screens/auth/Signup";
import LoginAuth from "./screens/auth/Login";
import OtpVerify from "./screens/auth/OtpVerify";
import { useState } from "react";
import { signup as signupApi, login as loginApi } from "./screens/auth/api";
import EndScreen from "./screens/end/EndScreen";
import Home from "./screens/registration/Registration";
import Landing from "./screens/landing/Landing";
import Test from "./screens/test/Test";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Instruction from "./screens/instructions/Instruction";
import Camera2 from "./screens/camera2/Camera2";
// import Camera3 from "./screens/camera3/Camera3";
import Login from "./screens/login/Login";
import Dashboard from "./screens/dashboard/Dashboard";
import TestResult from "./screens/testresults/TestResult";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import DetailedResult from "./screens/detailedResult/DetailedResult";
import ProfilePopup from "./components/ProfilePopup";
import CameraCapture from "../src/components/camera-capture/camera-capture";
import Recording from "./components/recordings/Recording";
import QuestionForm from "./screens/questionform/QuestionForm";
import Subjective from "./components/subjective/Subjective";
import SpeechAce from "./screens/speechAce/SpeechAce";
import ScreenRecorder from "./screens/super-speech/Screen-Recorder";
import PermissionsCheck from "./components/permissions-check/PermissionsCheck";
import UserFeedback from "./components/user-feedback-form/UserFeedback";
import UserFeedbackInstruction from "./components/user-feedback-instruction/UserFeedbackInstruction";

function App() {
  const navigate = useNavigate();
  const [pendingEmail, setPendingEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  // Signup handler
  const handleSignup = async (form) => {
    await signupApi({
      fullName: form.username, // assuming username is full name, adjust if needed
      email: form.email,
      username: form.username,
      password: form.password,
    });
    setPendingEmail(form.email);
    setShowOtp(true);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };
  // Login handler
  const handleLogin = async (credentials) => {
    const { data } = await loginApi({
      emailOrUsername: credentials.username,
      password: credentials.password,
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    navigate("/");
  };

  // ProtectedRoute component
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Wrapper to redirect logged-in users away from login/signup
  const PublicOnlyRoute = ({ children }) => {
    if (user) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <>
      <ProfilePopup user={user} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              {showOtp && pendingEmail ? (
                <OtpVerify
                  email={pendingEmail}
                  onVerified={() => {
                    setShowOtp(false);
                    setPendingEmail("");
                    navigate("/login");
                  }}
                />
              ) : (
                <Signup onSignup={handleSignup} />
              )}
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginAuth onLogin={handleLogin} />
            </PublicOnlyRoute>
          }
        />
        <Route path="/" element={<Landing />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/testend" element={<EndScreen />} />
        <Route path="/instruction" element={<Instruction />} />
        <Route path="/camera2/:cid" element={<Camera2 />} />
        {/* <Route path="/camera3/:cid" element={<Camera3 />} /> */}
        <Route path="/login-dashboard" element={<Login />} />
        {/* <Route path="/dashboard/:hrId" element={<Dashboard />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/:hrid/:test" element={<TestResult />} />
        <Route path="/:candidateNo" element={<DetailedResult />} />
        <Route path="/capture" element={<CameraCapture />} />
        <Route path="/recording" element={<Recording />} />
        <Route path="/add-question" element={<QuestionForm />} />
        <Route path="/subjective" element={<Subjective />} />
        <Route path="/speech-super" element={<ScreenRecorder />} />
        <Route path="/speech-ace" element={<SpeechAce />} />
        <Route path="/permissions" element={<PermissionsCheck />} />
        <Route path="/user-feedback" element={<UserFeedback />} />
        <Route path="/feedback-inst" element={<UserFeedbackInstruction />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
