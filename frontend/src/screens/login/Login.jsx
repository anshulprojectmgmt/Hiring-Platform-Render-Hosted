import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// import { useDispatch } from "react-redux";
import BASE_URL from '../../Api';

const Login = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [hrData, setHrData] = useState({
    email:"",
    password:"",
  })
  const handleChange = (e) => {
    setHrData({...hrData, [e.target.name]: e.target.value})
  }

  const Notification = async (data) => {
    if(!data.success){
      toast.error(data.error);
    }else{
      toast.success("logged in to dashboard");
      localStorage.setItem('dashboardEmail', data.email);
      // await dispatch({type: "UPDATE_DASHBOARD_INFO", hrname:data.hrname, totaltests:data.tests});
      setHrData({
        email:"",
    password:"",
      })
      navigate("/dashboard")
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${BASE_URL}/api/login-dashboard`, {
      ...hrData,
    });
    // console.log(res.data);
    Notification(res.data);
  };

  return (
    <>
      <div className="user-register">
        <div className="logo">AiPlanet</div>
        <div className="register-form">
          <h1 className="title-heading">Dashboard Login</h1>
          <form onSubmit={handleSubmit} className="input-fields">
            <input
              type="email"
              placeholder="Email ID"
              name="email"
              required
                value={hrData.email}
                onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              required
                value={hrData.password}
                onChange={handleChange}
            />
            <button
            type="submit"
              className="ctabutton"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
