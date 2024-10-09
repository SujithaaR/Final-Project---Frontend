import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  TextField,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const EmployeeDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [userData, setUserData] = useState(null); // New state for user data
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEnrollmentsAndUser = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch user data
        const userResponse = await axios.get('http://localhost:3000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(userResponse.data);

        // Fetch enrollments
        const enrollmentResponse = await axios.get('http://localhost:3000/api/enrolled-courses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrollments(enrollmentResponse.data);
        setFilteredEnrollments(enrollmentResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("No Courses Enrolled");
      }
    };

    fetchEnrollmentsAndUser();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = enrollments.filter(enrollment =>
      enrollment.courseId.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEnrollments(filtered);
  };

  const totalCourses = filteredEnrollments.length;
  const completedCourses = filteredEnrollments.filter(enrollment => enrollment.completed).length;

  // Pie chart data for feedback, participation, and quiz results
  const feedbackCount = filteredEnrollments.reduce((acc, curr) => acc + (curr.isFeedback ? 1 : 0), 0);
  const noFeedbackCount = totalCourses - feedbackCount;

  const quizCount = filteredEnrollments.reduce((acc, curr) => acc + (curr.isQuizTaken ? 1 : 0), 0);
  const noQuizCount = totalCourses - quizCount;

  const participationCount = filteredEnrollments.reduce((acc, curr) => acc + (curr.isParticipated ? 1 : 0), 0);
  const noParticipationCount = totalCourses - participationCount;

  const feedbackData = [
    { name: 'Feedback Given', value: feedbackCount },
    { name: 'Feedback Not Given', value: noFeedbackCount },
  ];

  const quizData = [
    { name: 'Quiz Taken', value: quizCount },
    { name: 'Quiz Not Taken', value: noQuizCount },
  ];

  const participationData = [
    { name: 'Participated', value: participationCount },
    { name: 'Not Participated', value: noParticipationCount },
  ];

  const COLORS = ['#82ca9d', '#ff0000'];

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' ,marginTop:'50px'}}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' ,marginTop:'30px',marginBottom:'20px'}}>
        Enrolled Courses
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

 {/* User Info Section */}
{userData && (
  <Box sx={{ marginBottom: 3, padding: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: 3 }}>
    <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#1976d2' }}>
      User Information
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <Paper elevation={1} sx={{ padding: 2, borderRadius: 1, backgroundColor: '#f0f4ff' }}>
          <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: '500' }}>
            <strong>Username:</strong> {userData.username}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper elevation={1} sx={{ padding: 2, borderRadius: 1, backgroundColor: '#f0f4ff' }}>
          <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: '500' }}>
            <strong>Department:</strong> {userData.department}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper elevation={1} sx={{ padding: 2, borderRadius: 1, backgroundColor: '#f0f4ff' }}>
          <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: '500' }}>
            <strong>Team:</strong> {userData.team}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  </Box>
)}


    {/* Search Filter */}
<Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
  <TextField
    label="Search by Course Title"
    variant="outlined"
    value={searchTerm}
    onChange={handleSearch}
    sx={{ width: '50%' }} // Adjust the width as needed
  />
</Box>

      {/* Cards for Course Statistics */}
      <Grid container spacing={3} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Total Courses Enrolled</Typography>
              <Typography variant="h6">{totalCourses}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Completed Courses</Typography>
              <Typography variant="h6">{completedCourses}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pie Charts for Feedback, Quiz, and Participation */}
      <Grid container spacing={3}>
        {/* Pie Chart for Feedback */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, backgroundColor: '#fff' }}>
            <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#555' }}>
              Feedback Participation
            </Typography>
            <PieChart width={300} height={300}>
              <Pie data={feedbackData} cx="50%" cy="50%" outerRadius={80}>
                {feedbackData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Paper>
        </Grid>

        {/* Pie Chart for Quiz */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, backgroundColor: '#fff' }}>
            <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#555' }}>
              Quiz Participation
            </Typography>
            <PieChart width={300} height={300}>
              <Pie data={quizData} cx="50%" cy="50%" outerRadius={80}>
                {quizData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Paper>
        </Grid>

        {/* Pie Chart for Participation */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, backgroundColor: '#fff' }}>
            <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#555' }}>
              Discussion Participation
            </Typography>
            <PieChart width={300} height={300}>
              <Pie data={participationData} cx="50%" cy="50%" outerRadius={80}>
                {participationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Paper>
        </Grid>
      </Grid>

      {/* Table for Course Enrollments */}
      <TableContainer component={Paper}>
        <Table>
        <TableHead>
        <TableRow>
          <TableCell>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>Course Title</Typography>
          </TableCell>
          <TableCell align="right">
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>Progress (%)</Typography>
          </TableCell>
          <TableCell align="right">
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>Total Count</Typography>
          </TableCell>
          <TableCell align="right">
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>Completed Count</Typography>
          </TableCell>
          <TableCell align="right">
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>Quiz Scores</Typography>
          </TableCell>
          <TableCell align="right">
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>Completed</Typography>
          </TableCell>
        </TableRow>
      </TableHead>

          <TableBody>
            {filteredEnrollments.map(enrollment => (
              <TableRow key={enrollment._id}>
                <TableCell>{enrollment.courseId.title}</TableCell>
                <TableCell align="right">{enrollment.progress}</TableCell>
                <TableCell align="right">{enrollment.totalCount}</TableCell>
                <TableCell align="right">{enrollment.completedCount}</TableCell>
                <TableCell align="right">{enrollment.quizScores}</TableCell>
                <TableCell align="right">{enrollment.completed ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EmployeeDashboard;
