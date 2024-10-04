import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Snackbar, Card, CardContent, CardActions, Grid, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [enrollmentIds, setEnrollmentIds] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
        fetchEnrolledCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/courses', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setSnackbarMessage('Error fetching courses.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const fetchEnrolledCourses = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/enrolled-courses', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const enrollments = response.data;
            setEnrolledCourses(enrollments.map(enrollment => enrollment.courseId._id));
            const enrollmentMap = {};
            enrollments.forEach(enrollment => {
                enrollmentMap[enrollment.courseId._id] = enrollment._id;
            });
            setEnrollmentIds(enrollmentMap);
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
            setSnackbarMessage('Not Enrolled in any of the Courses');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleEnroll = async (courseId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setSnackbarMessage('User ID not found. Please log in.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/api/enroll',
                { userId, courseId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            const enrollmentId = response.data.enrollment._id;

            setEnrolledCourses((prev) => [...prev, courseId]);
            setEnrollmentIds((prev) => ({ ...prev, [courseId]: enrollmentId }));
            setSnackbarMessage('Enrollment successful!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            handleGetStarted(courseId, enrollmentId);
        } catch (error) {
            console.error('Error enrolling in course:', error);
            setSnackbarMessage('Not enrolled in any COURSES');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleGetStarted = (courseId, enrollmentId) => {
        navigate(`/courses/${courseId}`, { state: { enrollmentId, courseId } });
    };

    // Filtered courses based on search term
    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container style={{ padding: '20px', backgroundColor: '#f4f7fc', borderRadius: '8px' }}>
            <Typography 
                variant="h4" 
                gutterBottom 
                style={{ 
                    marginTop: '70px', 
                    color: '#1976d2', 
                    fontWeight: 'bold', 
                    textAlign: 'center',
                    marginBottom: '30px' 
                }}
            >
                Available Courses
            </Typography>
            
            {/* Search Input */}
            <TextField
                label="Search Courses"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Grid container spacing={3} style={{ padding: '5px' ,marginTop:'20px'}}>
                {filteredCourses.map((course) => (
                    <Grid item xs={12} sm={6} md={4} key={course._id}>
                        <Card 
                            variant="outlined" 
                            style={{ 
                                transition: '0.3s', 
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
                                borderRadius: '10px', 
                            }}
                        >
                            <CardContent>
                                <Typography variant="h5" component="div" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                                    {course.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }}>
                                    {course.description}
                                </Typography>
                            </CardContent>
                            <CardActions style={{ justifyContent: 'space-between', marginBottom: '20px' }}>
                                {enrolledCourses.includes(course._id) ? (
                                    <>
                                        <Button variant="contained" color="success" disabled>
                                            Enrolled
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleGetStarted(course._id, enrollmentIds[course._id])}
                                        >
                                            Go to Course
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleEnroll(course._id)}
                                    >
                                        Enroll
                                    </Button>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                severity={snackbarSeverity}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Container>
    );
};

export default Courses;
