import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Cam2UserVerify.css";
import { useDispatch } from "react-redux";
import BASE_URL from "../../Api";
import axios from "axios";
import { toast } from "react-toastify";
import Webcam from "react-webcam";
import { Buffer } from "buffer";
import HashLoader from "react-spinners/HashLoader";
import BASE_URL from "../../Api";

const Cam2UserVerify = () => {
  const dispatch = useDispatch();
  const cid = localStorage.getItem("cid");

  const [candidateValidation, setCandidateValidation] = useState(null);
  const [candidateEmail, setCandidateEmail] = useState(null);
  const [testCode, setTestCode] = useState(null);
  const [face2, setFace2] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const webcamRef = useRef(null);
  let cam1FaceBlob;
  const [img, setImg] = useState(null);
  const [capturebtn, setCapturebtn] = useState(null);
  const [nextbtn, setNextbtn] = useState(null);

  const [noFaceVerification, setNoFaceVerification] = useState(false);

  const verifyFaces = async () => {
    try {
      setIsLoading(true);
      setCapturebtn(true);

      const imageSrc = webcamRef.current.getScreenshot();

      cam1FaceBlob = Buffer.from(
        imageSrc.replace("/^data:image\/\w+;base64,/", ""),
      );
      // console.
      setImg(imageSrc);

      const cam1FaceFileName = `${candidateEmail}-cam1face.jpeg`;
      const cam1FaceRes = await axios.post(`${BASE_URL}/api/s3upload`, {
        filename: cam1FaceFileName,
        contentType: "image/jpeg",
        testcode: testCode,
      });

      const cam1Faceurl = cam1FaceRes.data.url;

      await axios.put(cam1Faceurl, cam1FaceBlob);
      // console.
      // 3.111.137.31
      // https://ai.realtyai.in
      const inputString =
        imageSrc.replace("data:image/webp;base64,", "") +
        "," +
        face2.replace("data:image/webp;base64,", "");
      const matchRes = await axios.post(
        `${BASE_URL}/compare_faces`,
        inputString,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        },
      );

      if (matchRes.data.face_comparison_result) {
        setImg(null);
        toast.success(
          "The face image from both the cameras matched successfully",
        );

        const res = await axios.post(`${BASE_URL}/api/cam2-validation`, {
          cid: cid,
          param: "face",
        });
        if (!res.data.success) {
          toast.error(res.data.message);
        }

        setNextbtn(true);
      } else {
        setImg(null);
        setCapturebtn(null);
        setNoFaceVerification(true);
        toast.warning(
          "The face image from both the cameras did not matched, please Try Again!!",
        );
      }
      setIsLoading(false);
    } catch (error) {
      console.log("error==", error);
      setNoFaceVerification(true);
      setImg(null);
      setCapturebtn(null);
      setIsLoading(false);
      toast.warning("something went wrong please Try Again!!");
    }
  };

  const handleNoFaceAuth = () => {
    axios.post(`${BASE_URL}/api//update-candidate`, {
      email: candidateEmail,
      code: testCode,
      data: {
        faceAuthenticated: false,
      },
    });

    dispatch({ type: "NEXT" });
  };

  useEffect(() => {
    const getFace2Img = async () => {
      const face2 = await fetch(
        `https://hm-video-audio-bucket.s3.ap-south-1.amazonaws.com/${testCode}/images/${candidateEmail}-cam2face.jpeg`,
      ).then((res) => {
        return res.text();
      });

      setFace2(face2);
    };
    if (testCode && candidateEmail) {
      getFace2Img();
    }
  }, [testCode]);

  useEffect(() => {
    const getDashboardInfo = async () => {
      const res = await axios.post(`${BASE_URL}/api/validate-camera2-session`, {
        cid,
      });
      // console.log(res);
      setCandidateValidation(res.data.success);
      setCandidateEmail(res.data.candidateEmail);
      setTestCode(res.data.testCode);

      // console.log(face2);
    };

    getDashboardInfo();
  }, [cid]);

  const handleNext = () => {
    dispatch({ type: "NEXT" });
  };
  const handleBack = () => {
    dispatch({ type: "BACK" });
  };

  return (
    <div className="verifyface">
      <div className="verifyface-head">
        <h3>Face Authentication Between Smartphone & Laptop Camera</h3>
        <p>
          Steps: Align yourself in front of the laptop camera so that your face
          matches as close as possible to the image captured from smartphone .
          Once done, click on capture & verify button below
        </p>
      </div>
      <div className="verifyface-images">
        {isLoading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
              zIndex: 1000, // Ensure it appears above other content
            }}
          >
            <HashLoader
              color={"#1c4b74"}
              loading={isLoading}
              size={100}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
        {/* <div
          id="carouselExampleIndicators"
          className="carousel carousel-dark slide"
          data-bs-ride="carousel"
          data-bs-interval="4000"
        >
          <div className="carousel-inner mycarousel">
            <div className="carousel-item active ">
              <div className="img-container">
                <Webcam style={img ? { display: 'none' } : {}} className="video" audio={false} ref={webcamRef} /></div>
                <div className="img-container">
                <img style={!img ? { display: 'none' } : {}} src={img}  alt="..."></img>
                </div>
                <div className="img-container">
              <img src={face2}  alt="..."></img>
              </div>
            </div>
          </div>
        </div> */}
        {!img ? (
          <div style={img ? { display: "none" } : {}} className="img-container">
            <Webcam
              style={img ? { display: "none" } : {}}
              className="video"
              audio={false}
              ref={webcamRef}
            />
          </div>
        ) : (
          <div className="img-container">
            <img src={img} alt="..."></img>
          </div>
        )}

        <div className="img-container">
          <img src={face2} alt="..."></img>
        </div>
      </div>
      <div className="verifyface-foot">
        <button
          onClick={verifyFaces}
          className="ctabutton me-5"
          style={capturebtn ? { display: "none" } : {}}
        >
          Capture & verify faces
        </button>
        {noFaceVerification && (
          <button
            onClick={handleNoFaceAuth}
            className="ctabutton"
            style={capturebtn ? { display: "none" } : {}}
          >
            Proceed without authentication
          </button>
        )}

        {/* <h4>AI PROCTORING: Face, hands and keyboard detection</h4>
        <p>
          Our system will flag off any missing video frames which detect that your hands, face or the keyboard of the laptop you are attempting the test on, is not detected
        </p> */}
      </div>
      <div className="verifyface-navigation">
        <button onClick={handleBack} className="ctabutton">
          Back
        </button>
        <button
          onClick={handleNext}
          className="ctabutton nextbutton"
          style={nextbtn ? {} : { display: "none" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Cam2UserVerify;
