import React from "react";
import "./Instruction.css";
import { useSelector } from "react-redux";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import BASE_URL from '../../Api';

import Face from "../../components/face/Face";
import Angle from "../../components/angle/Angle";
import Device from "../../components/device/Device";
import Audio from "../../components/audio/Audio";
import Warning from "../../components/warning/Warning";
import Angle2 from "../../components/angle2/Angle2";
import Cam2UserVerify from "../../components/cam2Auth/Cam2UserVerify";
import Cam2Instruction from "../../components/cam2-instruction/Cam2Instruction";
import PermissionsCheck from "../../components/permissions-check/PermissionsCheck";
import UserFeedbackInstruction from "../../components/user-feedback-instruction/UserFeedbackInstruction";

const Instruction = () => {
  const currentpage = useSelector(
    (state) => state.instructionState.currentpage,
  );
  return (
    <>
      <div className="instruction-fullscreen">
        <div className="navbar">
          <div className=" logo">AiPlanet</div>
        </div>
        <div className="instruction-body">
          {currentpage === 1 ? (
            <Warning />
          ) : currentpage === 2 ? (
            <Angle2 />
          ) : currentpage === 3 ? (
            <Cam2UserVerify />
          ) : currentpage === 4 ? (
            <Cam2Instruction />
          ) : currentpage === 5 ? (
            <Angle />
          ) : currentpage === 6 ? (
            <Face />
          ) : currentpage === 7 ? (
            <Device />
          ) : currentpage === 8 ? (
            <Audio />
          ) : currentpage === 9 ? (
            <UserFeedbackInstruction />
          ) : (
            <PermissionsCheck />
          )}

          {/* {currentpage === 1 ? <Warning /> : currentpage === 2 ? <Angle2 />
           : currentpage === 3 ? <Angle /> 
           : currentpage === 4 ? <Face /> : currentpage === 5 
           ? <Device /> : <Audio />} */}
        </div>
      </div>
    </>
  );
};

export default Instruction;
