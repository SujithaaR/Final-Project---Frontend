import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  CircularProgress,
  Snackbar,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Score as ScoreIcon } from '@mui/icons-material';
import { Chart, registerables } from 'chart.js';
import { useNavigate } from 'react-router-dom';

// Register all necessary components
Chart.register(...registerables);

const ScorePage = () => {
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userFilter, setUserFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/quizzes/all');
        if (Array.isArray(response.data)) {
          setQuizResults(response.data);
          const uniqueUsers = [...new Set(response.data.map(result => result.userId?.username).filter(Boolean))];
          const uniqueCourses = [...new Set(response.data.map(result => result.courseId?.title).filter(Boolean))];
          setUsers(uniqueUsers);
          setCourses(uniqueCourses);
        } else {
          throw new Error('Unexpected data format');
        }
      } catch (err) {
        console.error('Error fetching quiz results:', err);
        setError('Failed to fetch quiz results. Please try again later.');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleUserFilterChange = (event) => {
    setUserFilter(event.target.value);
  };

  const handleCourseFilterChange = (event) => {
    setCourseFilter(event.target.value);
  };

  // Filter results based on selected filters
  const filteredResults = quizResults.filter(result => {
    const userMatches = userFilter ? result.userId?.username === userFilter : true;
    const courseMatches = courseFilter ? result.courseId?.title === courseFilter : true;
    return userMatches && courseMatches;
  });

  // Prepare data for performance analysis
  const performanceData = {
    labels: filteredResults.map(result => `${result.userId?.username || 'Unknown'} (${result.courseId?.title || 'Unknown'})`),
    datasets: [
      {
        label: 'Obtained Score',
        data: filteredResults.map(result => result.obtainedScore),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Total Score',
        data: filteredResults.map(result => result.totalScore),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <Container style={{marginTop:'60px'}}>
      <Button
        variant="contained"
        onClick={() => navigate('/admin')}
        style={{ marginBottom: '20px', marginTop: '30px' }}
      >
        Back
      </Button>

      <Typography variant="h4" gutterBottom>
        Admin Dashboard - Employee Performance <ScoreIcon />
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Employee</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>User</InputLabel>
                  <Select value={userFilter} onChange={handleUserFilterChange}>
                    <MenuItem value=""><em>All Users</em></MenuItem>
                    {users.map(user => (
                      <MenuItem key={user} value={user}>{user}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Course</InputLabel>
                  <Select value={courseFilter} onChange={handleCourseFilterChange}>
                    <MenuItem value=""><em>All Courses</em></MenuItem>
                    {courses.map(course => (
                      <MenuItem key={course} value={course}>{course}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Quiz Results Overview</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Course Title</TableCell>
                    <TableCell>Total Score</TableCell>
                    <TableCell>Obtained Score</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredResults.length > 0 ? (
                    filteredResults.map((result) => (
                      <TableRow key={result._id}>
                        <TableCell>{result.userId?.username || 'Unknown'}</TableCell>
                        <TableCell>{result.courseId?.title || 'Unknown'}</TableCell>
                        <TableCell>{result.totalScore}</TableCell>
                        <TableCell>{result.obtainedScore}</TableCell>
                        <TableCell>
                          {result.obtainedScore >= result.totalScore * 0.6 ? 'Passed' : 'Failed'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No quiz results available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Performance Chart</Typography>
            {filteredResults.length > 0 ? (
              <Bar
                data={performanceData}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Scores',
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Users & Courses',
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Quiz Performance Overview',
                    },
                  },
                }}
              />
            ) : (
              <Typography>No data to display in chart.</Typography>
            )}
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
      />
    </Container>
  );
};

export default ScorePage;
