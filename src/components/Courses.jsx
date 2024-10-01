import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Snackbar, Card, CardContent, CardActions, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [enrollmentIds, setEnrollmentIds] = useState({}); // Track enrollment IDs for each course
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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
            // Store enrollment IDs in the state
            const enrollmentMap = {};
            enrollments.forEach(enrollment => {
                enrollmentMap[enrollment.courseId._id] = enrollment._id; // Save mapping of courseId to enrollmentId
            });
            setEnrollmentIds(enrollmentMap);
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
            setSnackbarMessage('Error fetching enrolled courses.');
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

            // Update local state to reflect enrollment
            setEnrolledCourses((prev) => [...prev, courseId]);
            setEnrollmentIds((prev) => ({ ...prev, [courseId]: enrollmentId })); // Store the new enrollment ID
            setSnackbarMessage('Enrollment successful!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            // Navigate to the CourseDetails page
            handleGetStarted(courseId, enrollmentId);
        } catch (error) {
            console.error('Error enrolling in course:', error);
            setSnackbarMessage('Error enrolling in course.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleGetStarted = (courseId, enrollmentId) => {

        navigate(`/courses/${courseId}`, { state: { enrollmentId,courseId } }); // Pass enrollmentId in state
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Available Courses
            </Typography>
            <Grid container spacing={3}>
                {courses.map((course) => (
                    <Grid item xs={12} sm={6} md={4} key={course._id}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {course.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {course.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                {enrolledCourses.includes(course._id) ? (
                                    <>
                                        <Button variant="contained" color="success" disabled>
                                            Enrolled
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleGetStarted(course._id, enrollmentIds[course._id])} // Use enrollmentId from the state
                                        >
                                            Get Started
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
