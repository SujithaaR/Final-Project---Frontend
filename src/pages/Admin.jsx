import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import { Link } from 'react-router-dom';
import './AdminDashboard.css';
import EnrollmentStats from "./EnrollmentStats";

const AdminDashboard = () => {
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [chartData, setChartData] = useState({
    courseChart: { series: [], options: {} },
    quizChart: { series: [], options: {} },
    discussionChart: { series: [], options: {} },
    feedbackChart: { series: [], options: {} },
  });
  const [totalTimeSpent, setTotalTimeSpent] = useState(0); // State for total time spent

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enrollmentsResponse = await axios.get("http://localhost:3000/api/enrollments/all/data");
        const enrollmentList = enrollmentsResponse.data;
        setEnrollmentData(enrollmentList);
        setFilteredData(enrollmentList);

        const usersResponse = await axios.get("http://localhost:3000/api/users/all");
        const usersList = usersResponse.data;

        // Filter users to include only non-admins
        const userOptions = usersList
          .filter(user => !user.isAdmin) // Exclude admin users
          .map(user => ({
            id: user._id,
            name: user.username,
            timeSpent: user.timeSpent || 0, // Ensure to get time spent
          }));

        setUserOptions(userOptions);

        const processedCharts = processChartData(enrollmentList);
        setChartData(processedCharts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = enrollmentData;
    if (selectedUser) {
      filtered = filtered.filter((enroll) => enroll.userId === selectedUser);
    }

    const selectedUserData = userOptions.find(user => user.id === selectedUser);
    setTotalTimeSpent(selectedUserData ? selectedUserData.timeSpent : 0); // Update total time spent

    setFilteredData(filtered);
    const processedCharts = processChartData(filtered);
    setChartData(processedCharts);
  }, [selectedUser, enrollmentData, userOptions]);

  const processChartData = (enrollments) => {
    const coursesCompleted = enrollments.filter((enroll) => enroll.completed).length;
    const quizTaken = enrollments.filter((enroll) => enroll.isQuizTaken).length;
    const discussionsParticipated = enrollments.filter((enroll) => enroll.isParticipated).length;
    const feedbackGiven = enrollments.filter((enroll) => enroll.isFeedback).length;

    return {
      courseChart: {
        series: [coursesCompleted, enrollments.length - coursesCompleted],
        options: {
          chart: { type: "donut" },
          labels: ["Completed", "Incomplete"],
        },
      },
      quizChart: {
        series: [quizTaken, enrollments.length - quizTaken],
        options: {
          chart: { type: "donut" },
          labels: ["Quiz Taken", "Quiz Not Taken"],
        },
      },
      discussionChart: {
        series: [discussionsParticipated, enrollments.length - discussionsParticipated],
        options: {
          chart: { type: "donut" },
          labels: ["Participated", "Not Participated"],
        },
      },
      feedbackChart: {
        series: [feedbackGiven, enrollments.length - feedbackGiven],
        options: {
          chart: { type: "donut" },
          labels: ["Feedback Given", "Feedback Not Given"],
        },
      },
    };
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  return (
    <div className="admin-dashboard">
      <h2 className="admin-header" style={{ marginTop: '50px', justifyContent: "center", marginBottom: '50px' }}>Admin Dashboard</h2>
      <div className="nav-links">
        <Link to="/admin/feedback">Employee Feedback</Link>
        <Link to="/admin/comments">Employee Comments</Link>
        <Link to="/admin/scores">Employee Scores</Link>
      </div>

      <div className="filters">
        <label>Select User:</label>
        <select value={selectedUser} onChange={handleUserChange}>
          <option value="">All Users</option>
          {userOptions.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="cards">
        {/* New Card for Total Employees */}

        {!selectedUser && 
             <div className="card">
             <h4>Total Employees</h4>
             <p>{userOptions.length}</p> {/* Display total number of employees */}
           </div>
        }
       
        <div className="card">
          <h4>Total Courses Enrolled</h4>
          <p>{filteredData.length}</p>
        </div>
        <div className="card">
          <h4>Courses Completed</h4>
          <p>{filteredData.filter((enroll) => enroll.completed).length}</p>
        </div>
        <div className="card">
          <h4>Quizzes Taken</h4>
          <p>{filteredData.filter((enroll) => enroll.isQuizTaken).length}</p>
        </div>
        

        {/* Only render the Total Time Spent card when a specific user is selected */}
        {selectedUser && (
          <div className="card">
            <h4>Total Time Spent</h4>
            <p>{totalTimeSpent} seconds</p> {/* Display total time spent in seconds */}
          </div>
        )}
      </div>

      {/* Pie charts */}
      <div className="charts">
        <div>
          <h3>Courses Progress</h3>
          <Chart options={chartData.courseChart.options} series={chartData.courseChart.series} type="donut" width="380" />
        </div>

        <div>
          <h3>Quiz Participation</h3>
          <Chart options={chartData.quizChart.options} series={chartData.quizChart.series} type="donut" width="380" />
        </div>

        <div>
          <h3>Discussion Participation</h3>
          <Chart options={chartData.discussionChart.options} series={chartData.discussionChart.series} type="donut" width="380" />
        </div>

        <div>
          <h3>Feedback Given</h3>
          <Chart options={chartData.feedbackChart.options} series={chartData.feedbackChart.series} type="donut" width="380" />
        </div>
      </div>
      <EnrollmentStats />
    </div>
  );
};

export default AdminDashboard;
