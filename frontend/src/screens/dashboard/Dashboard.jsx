import React from "react";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import BASE_URL from "../../Api";
import axios from "axios";
import { useState } from "react";

const Dashboard = () => {
  // const param = useParams();
  // const hrid = param.hrId;
  // const hrname = useSelector((state) => state.dashBoardInfo.hrName);
  // const totaltests = useSelector((state) => state.dashBoardInfo.totalTests);
  // let hrid, hrname, totaltests;
  const [hrname, sethrname] = useState("");
  const [totaltests, settotaltests] = useState([]);
  const [hrid, sethrid] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log("pn dashboard mount");
    // Add event listener for popstate which is triggered on back button
    const handlePopState = () => {
      // Redirect to /home when back button is pressed
      console.log("Back button pressed!");
      navigate("/", { replace: true });
      console.log("after Back button pressed!");
    };

    window.addEventListener("popstate", handlePopState);

    // Cleanup the event listener when the component is unmounted
    return () => {
      console.log("on dashboard UNmount");
      setTimeout(() => {
        window.removeEventListener("popstate", handlePopState);
      }, 500);
    };
  }, [navigate]);

  useEffect(() => {
    const getDashboardInfo = async () => {
      const email = localStorage.getItem("dashboardEmail");

      if (!email) {
        navigate("/login-dashboard", { replace: true });
        return;
      }

      try {
        const res = await axios.post(`${BASE_URL}/api/get-dashboard-data`, {
          email,
        });

        if (!res.data.success) {
          sethrname("");
          settotaltests([]);
          sethrid("");
          return;
        }

        sethrname(res.data.hrname || "");
        settotaltests(Array.isArray(res.data.tests) ? res.data.tests : []);
        sethrid(res.data.hrid || "");
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        sethrname("");
        settotaltests([]);
        sethrid("");
      }
    };

    getDashboardInfo();
  }, [navigate]);
  return (
    <>
      <div className="admin-dashboard">
        <div className="logo">AiPlanet</div>

        <h1 className="title-heading">Dashbaord</h1>

        <div className="test-dashboard">
          <h2 className="title-heading">Welcome, {hrname}</h2>

          <div className="test-items">
            <table className="my-table border-secondary table-hover table table-borderless">
              <thead className="border-secondary">
                <tr className="table-head">
                  <th scope="col">S.No.</th>
                  <th scope="col">Date</th>
                  <th scope="col">Test Code</th>
                  <th scope="col">Type</th>
                  <th scope="col">Duration (min)</th>
                  <th scope="col">Questions</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody className="my-table">
                {totaltests.length > 0
                  ? totaltests.map((test, i) => {
                      return (
                        <tr key={i}>
                          <th scope="row">{i + 1}</th>
                          <td>{test.date ? test.date.substring(0, 10) : "-"}</td>
                          <td>{test.testcode}</td>
                          <td style={{ textTransform: "capitalize" }}>
                            {test.type}
                          </td>
                          <td>{test.duration}</td>
                          <td>{test.questions}</td>
                          <td>
                            <Link
                              state={{ ...test, key: i + 1 }}
                              to={`/${hrid}/test${i + 1}`}
                            >
                              check results
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
