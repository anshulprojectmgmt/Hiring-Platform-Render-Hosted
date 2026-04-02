import React, { useState } from "react";
import { checkSubscription } from "../../utility/subscription";
import "./Landing.css";
import { Link, useNavigate } from "react-router-dom";
import image from "../../assests/landingpage.svg";
import clientsLogo from "../../assests/clientslogo";
import aiImage from "../../assests/ai.svg";
// Removed duplicate import
import ProfilePopup from "../../components/ProfilePopup";
import Face from "../../components/videos/Face";
import Device from "../../components/videos/Device";
import Audio from "../../components/videos/Audio";

const Landing = () => {
  const navigate = useNavigate();
  const [procFeature, setFeature] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  // console.log(procFeature);
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {}
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCreateTestClick = async (e) => {
    e.preventDefault();
    // Check subscription status before showing modal
    const sub = await checkSubscription();
    if (sub.status === "active") {
      navigate("/create");
    } else {
      setShowPaymentModal(true);
    }
  };

  const handleProceedPayment = () => {
    setShowPaymentModal(false);
    navigate("/payment");
  };

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar landing-page-navbar">
        <div className="navbar-content">
          <div className="navbar-logo">
            <img className="logos" src="./Aiplanet_logo.jpeg" alt="logo" style={{height:"32px"}} />
            AiPlanet
          </div>
          <div className="navbar-links navbar-links-right">
            <div className="navbar-divider" />
            {user ? (
              <ProfilePopup user={user} onLogout={handleLogout} />
            ) : (
              <>
                <Link
                  className="navbar-btn login"
                  to={user ? "#" : "/login"}
                  onClick={e => { if (user) e.preventDefault(); }}
                >
                  <span role="img" aria-label="login" style={{marginRight:5}}>🔑</span>Login
                </Link>
                <Link
                  className="navbar-btn signup"
                  to={user ? "#" : "/signup"}
                  onClick={e => { if (user) e.preventDefault(); }}
                >
                  <span role="img" aria-label="signup" style={{marginRight:5}}>📝</span>Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SECTION-1 */}
      <div className="section-type landing-page" id="home-page">
        <div className="landing-page-left">
          <div className="landing-content">
            <div className="headings">
              <span className="sub-text">AI-Driven Online</span>
              <span className="main-heading gradient-text">
               Assessment Tool
              </span>
            </div>

            <p className="desc">
              Elevate your hiring game with our advanced online assessment
              tool-Harnessing AI for coding and MCQ assessments, fortified with
              top-notch anti-cheating measures. Uncover top talent seamlessly!
            </p>
          </div>
          <div className="landing-cta">
            {user ? (
              <>
                <button className="ctabutton" onClick={handleCreateTestClick}>Create test</button>
                {showPaymentModal && (
                  <div className="modal-overlay">
                    <div className="modal-box">
                      <h3>Subscribe to Access</h3>
                      <p>To access this feature, you need to subscribe for ₹1 per month.</p>
                      <div className="modal-actions">
                        <button className="ctabutton proceed" onClick={handleProceedPayment}>Proceed</button>
                        <button className="ctabutton cancel" onClick={handleCancelPayment}>Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">
                <button className="ctabutton">Create test</button>
              </Link>
            )}
            <div className="desc">OR</div>
            <Link to="/home">
              <button className="ctabutton">Join test</button>
            </Link>
          </div>
        </div>
        <div className="landing-page-right">
          <img src={image} alt="logo" />
        </div>
      </div>

      {/* TEST SECTION 2 */}

      <div className="section-two" id="features">
        <div className="section-two-heading">
          <h2>A New-age Assessment Platform to Create Dynamic Assessments</h2>
        </div>
        <div className="section-two-content">
          <div className="test-card">
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 21V21.75C22.4142 21.75 22.75 21.4142 22.75 21H22ZM2 21H1.25C1.25 21.4142 1.58579 21.75 2 21.75V21ZM22 7H22.75C22.75 6.58579 22.4142 6.25 22 6.25V7ZM9 3.00001L9.6 2.55001L9.375 2.25001L9 2.25001L9 3.00001ZM2 3L2 2.25C1.80109 2.25 1.61032 2.32902 1.46967 2.46967C1.32902 2.61032 1.25 2.80109 1.25 3H2ZM22 20.25H2V21.75H22V20.25ZM7 7.75H22V6.25H7V7.75ZM8.4 3.45001L11.4 7.45L12.6 6.55L9.6 2.55001L8.4 3.45001ZM2.75 21V3H1.25V21H2.75ZM9 2.25001L2 2.25L2 3.75L9 3.75001L9 2.25001ZM21.25 7V21H22.75V7H21.25Z"
                fill="#5880F0"
              />
              <path
                d="M15 12L17 14L15 16"
                stroke="#5880F0"
                stroke-width="1.5"
              />
              <path d="M9 12L7 14L9 16" stroke="#5880F0" stroke-width="1.5" />
              <path
                d="M13 11L11 17"
                stroke="#5880F0"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
            </svg>
            <h4>Coding Tests</h4>
            <p>
              Advanced coding simulators to hire and develop the best coders
            </p>
          </div>
          <div className="test-card">
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 6L21 6"
                stroke="#5880F0"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M11 12L21 12"
                stroke="#5880F0"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M11 18L21 18"
                stroke="#5880F0"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M3 7.39286C3 7.39286 4 8.04466 4.5 9C4.5 9 6 5.25 8 4"
                stroke="#5880F0"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3 18.3929C3 18.3929 4 19.0447 4.5 20C4.5 20 6 16.25 8 15"
                stroke="#5880F0"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <h4>MCQ Based Tests</h4>
            <p>We also support multiple choice questions format</p>
          </div>
        </div>
      </div>

      {/* GENERATIVE SECTION */}

      <div className="ai-section">
        <div className="ai-heading">
          <h2>
            Revolutionizing Assessment: Generative AI Powered Test Evaluation
          </h2>
        </div>
        <div className="ai-body">
          <div className="ai-left">
            <img src={aiImage} alt="ai" />
          </div>
          <div className="ai-right">
            <p>
              Experience unparalleled precision as our cutting-edge Generative
              AI algorithm meticulously analyzes and scores each submitted
              answer, setting a new standard in test assessment.
            </p>
          </div>
        </div>
      </div>

      {/* PROCTORING SECTION */}

      <div className="proctoring-features" id="feature-page">
        <div className="proctoring-heading">
          <p>AI Proctoring</p>
          <h2>
            Conduct Secure Assessments Using AI-Powered Proctoring Technology
          </h2>
        </div>
        <div className="proctoring-types">
          <div
            onClick={() => setFeature(1)}
            className={procFeature === 1 ? "active" : null}
          >
            Multiple People Detection
          </div>
          <div
            onClick={() => setFeature(2)}
            className={procFeature === 2 ? "active" : null}
          >
            Multiple Voice Detection
          </div>
          <div
            onClick={() => setFeature(3)}
            className={procFeature === 3 ? "active" : null}
          >
            Electronic Device Detection
          </div>
        </div>
        {procFeature === 1 ? (
          <div className="proctoring-content">
            <div className="proctoring-content-left">
              <Face />
            </div>
            <div className="proctoring-content-right">
              <p>
                Our advanced proctoring technology can detect when multiple
                individuals are present during an online exam. This ensures the
                integrity of the test-taking environment, preventing any
                unauthorized collaboration.
              </p>
            </div>
          </div>
        ) : procFeature === 2 ? (
          <div className="proctoring-content">
            <div className="proctoring-content-left">
              <Audio />
            </div>
            <div className="proctoring-content-right">
              <p>
                With cutting-edge audio analysis, we can identify multiple
                voices during an exam. This feature helps in maintaining test
                security by alerting you to any suspicious activities, such as
                unauthorized communication.
              </p>
            </div>
          </div>
        ) : (
          <div className="proctoring-content">
            <div className="proctoring-content-left">
              <Device />
            </div>
            <div className="proctoring-content-right">
              <p>
                Our advanced proctoring system detect and deter the use of
                mobile phones and other unauthorized devices. We ensure the
                integrity of the exam by actively identifying and preventing any
                cheating practices.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="proctoring-mobile" id="mobile-proctoring-features">
        <div className="proctoring-heading-mobile">
          <p>AI Proctoring</p>
          <h2>
            Conduct Secure Assessments Using AI-Powered Proctoring Technology
          </h2>
        </div>
        <div className="proctoring-content-mobile">
          <div className="proctoring-card">
            <div className="feature-name">Multiple People Detection</div>
            <div className="feature-content">
              <div className="left">
                <Face />
              </div>
              <div className="right">
                <p>
                  Our advanced proctoring technology can detect when multiple
                  individuals are present during an online exam. This ensures
                  the integrity of the test-taking environment, preventing any
                  unauthorized collaboration.
                </p>
              </div>
            </div>
          </div>
          <div className="proctoring-card">
            <div className="feature-name">Multiple Voice Detection</div>
            <div className="feature-content">
              <div className="left">
                <Audio />
              </div>
              <div className="right">
                <p>
                  With cutting-edge audio analysis, we can identify multiple
                  voices during an exam. This feature helps in maintaining test
                  security by alerting you to any suspicious activities, such as
                  unauthorized communication.
                </p>
              </div>
            </div>
          </div>
          <div className="proctoring-card">
            <div className="feature-name">Electronic Device Detection</div>
            <div className="feature-content">
              <div className="left">
                <Device />
              </div>
              <div className="right">
                <p>
                  Our advanced proctoring system detect and deter the use of
                  mobile phones and other unauthorized devices. We ensure the
                  integrity of the exam by actively identifying and preventing
                  any cheating practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRCING-SECTION */}
      <div className="pricing-section" id="pricing-page">
        <div className="pricing-heading">
          <p>Pricing</p>
          <h2>Unlock More with Premium Subscriptions</h2>
        </div>
        <div className="all-subscription">
          <div className="subscription-card">
            <h4>
              Free <span>Try out skills-based hiring</span>
            </h4>
            <div className="price">
              <h2>₹0</h2>
              <p>one test only</p>
            </div>
            <a href="#home-page">
              <button className="free-btn ctabutton">Get Started</button>
            </a>
          </div>
          <div className="subscription-card">
            <h4>
              Paid <span>Maximize your hiring with extra features</span>
            </h4>
            <div className="price">
              {" "}
              <h2>₹50</h2>
              <p>per test</p>
            </div>
            <div className="paid-btn"><button className="ctabutton">Subscribe</button></div>
          </div>
        </div>
      </div>

      {/* CLIENTS-SECTION */}
      <div className="clients-section" id="clients-page">
        <div className="clients-heading">
          Join 500+ Modern Recruiting Teams Using Aiplanet
        </div>
        <div className="clients-body">
          {clientsLogo.map((e, i) => {
            return (
              <div key={i} className="client-logo">
                <img src={e} alt="company logo" />
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div className="footer-left">
          <h2>AiPlanet</h2>
          <p>Copyright © 2023 Aiplanet</p>
        </div>
        <div className="footer-mid">
          <p>
            <a href="#home-page">Home</a>
          </p>
          <p>
            <a href="#features">Features</a>
          </p>
          <p>
            <a href="#pricing-page">Pricing</a>
          </p>
          <p>
            <a href="#clients-page">Clients</a>
          </p>
        </div>
        <div className="footer-right">
          <h2>EmailUs</h2>
          <p>
            <a href="mailto:research@realtyai.net">research@realtyai.net</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Landing;
