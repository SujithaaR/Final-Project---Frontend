import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import './AdminDashboard.css';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enrollmentsResponse = await axios.get(
          "http://localhost:3000/api/enrollments/all/data"
        );
        const enrollmentList = enrollmentsResponse.data;
        setEnrollmentData(enrollmentList);
        setFilteredData(enrollmentList);

        const usersResponse = await axios.get("http://localhost:3000/api/users/all");
        const usersList = usersResponse.data;
        const userOptions = usersList.map((user) => ({
          id: user._id,
          name: user.username,
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
    setFilteredData(filtered);
    const processedCharts = processChartData(filtered);
    setChartData(processedCharts);
  }, [selectedUser, enrollmentData]);

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
          labels: ["Feedback Given", "No Feedback"],
        },
      },
    };
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

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
      </div>

      {/* Two pie charts in a row */}
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
    </div>
  );
};

export default AdminDashboard;
