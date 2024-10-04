import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Snackbar,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert,
    LinearProgress,
    IconButton
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CourseDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { enrollmentId, courseId } = location.state || {};
    const [course, setCourse] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [completedCount, setCompletedCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [completedSubtopics, setCompletedSubtopics] = useState({});
    const [progress, setProgress] = useState(0);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (courseId) {
            fetchCourseDetails();
            fetchEnrollmentDetails();
        } else {
            setSnackbarMessage('Course ID is not available.');
            setSnackbarOpen(true);
        }
    }, [courseId, enrollmentId]);

    const fetchCourseDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/courses/${courseId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setCourse(response.data);
            const total = response.data.topics.reduce((acc, topic) => acc + topic.subtopics.length, 0);
            setTotalCount(total);
        } catch (error) {
            console.error('Error fetching course details:', error);
            setSnackbarMessage('Error fetching course details.');
            setSnackbarOpen(true);
        }
    };

    const fetchEnrollmentDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/enrollments/${enrollmentId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const enrollment = response.data;
            setCompletedCount(enrollment.completedCount);
            setProgress(enrollment.progress);
        } catch (error) {
            console.error('Error fetching enrollment details:', error);
            setSnackbarMessage('Not Started the course');
            setSnackbarOpen(true);
        }
    };

    const handleComplete = async (subtopicId, title) => {
        if (completedSubtopics[subtopicId]) {
            setSnackbarMessage(`Already completed: ${title}`);
            setSnackbarOpen(true);
            return;
        }

        if (completedCount >= totalCount) {
            setSnackbarMessage('All content is already completed!');
            setSnackbarOpen(true);
            return;
        }

        const newCompletedSubtopics = { ...completedSubtopics, [subtopicId]: true };
        setCompletedSubtopics(newCompletedSubtopics);

        try {
            const newCompletedCount = completedCount + 1;
            const newProgress = Math.round((newCompletedCount / totalCount) * 100);

            await axios.put(`http://localhost:3000/api/progress/update`, {
                enrollmentId,
                completedContentCount: newCompletedCount,
                totalContentCount: totalCount,
                timeSpent: 0,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setCompletedCount(newCompletedCount);
            setProgress(newProgress);

            if (newCompletedCount === totalCount) {
                setSnackbarMessage('Congratulations! You have completed the entire course.');
            } else {
                setSnackbarMessage(`Completed: ${title}`);
            }
        } catch (error) {
            console.error('Error updating progress:', error.response || error.message);
            setSnackbarMessage('Error updating progress: ' + (error.response?.data?.message || 'Unknown error.'));
            setCompletedSubtopics(completedSubtopics);
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleTakeQuiz = () => {
        navigate(`/quiz/${courseId}`, { state: { userId, enrollmentId, courseId } });
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <Container style={{ marginTop:'80px'}}>
            <IconButton onClick={handleBackClick} style={{ marginBottom: '20px', color: '#1976d2' }}>
                <ArrowBackIcon />
            </IconButton>

            {course && (
                <>
                    <Typography variant="h4" gutterBottom style={{ color: '#2c3e50', fontWeight: '600' }}>
                        {course.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom style={{ marginBottom: '20px', fontSize: '1.1rem' }}>
                        {course.description}
                    </Typography>

                    {/* Progress Bar */}
                    <Typography variant="h6" gutterBottom>
                        Progress: {progress}% ({completedCount} of {totalCount} completed)
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} style={{ marginBottom: '20px', borderRadius: '5px', height: '10px' }} />

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <List>
                                {course.topics.map((topic, index) => (
                                    <div key={index}>
                                        <ListItem>
                                            <ListItemText primary={topic.title} />
                                        </ListItem>
                                        <Divider />
                                        {topic.subtopics.map((subtopic) => (
                                            <ListItem
                                                button
                                                key={subtopic._id}
                                                onClick={() => handleComplete(subtopic._id, subtopic.title)}
                                                style={{
                                                    backgroundColor: completedSubtopics[subtopic._id] ? '#e8f5e9' : 'transparent',
                                                    transition: 'background-color 0.3s',
                                                    '&:hover': {
                                                        backgroundColor: completedSubtopics[subtopic._id] ? '#e8f5e9' : '#f1f1f1'
                                                    }
                                                }}
                                            >
                                                <ListItemText
                                                    primary={subtopic.title}
                                                    style={{
                                                        color: completedSubtopics[subtopic._id] ? 'green' : 'black',
                                                        textDecoration: completedSubtopics[subtopic._id] ? 'line-through' : 'none',
                                                    }}
                                                />
                                                {completedSubtopics[subtopic._id] && <span>✔️</span>}
                                            </ListItem>
                                        ))}                                   
                                    </div>
                                ))}                               
                            </List>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Typography variant="h5" style={{ marginBottom: '20px', fontWeight: '600' }}>Course Content</Typography>
                            {course.topics.map((topic) => (
                                <Card variant="outlined" key={topic._id} sx={{ mb: 2, boxShadow: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" style={{ color: '#1976d2', fontWeight: '500' }}>{topic.title}</Typography>
                                        {topic.subtopics.map((subtopic) => (
                                            <div key={subtopic._id} style={{ marginBottom: '10px' }}>
                                                <Typography variant="body2">{subtopic.title}</Typography>
                                                <CardActions>
                                                    <Button
                                                        variant="contained"
                                                        color={completedSubtopics[subtopic._id] ? 'success' : 'primary'}
                                                        onClick={() => handleComplete(subtopic._id, subtopic.title)}
                                                        disabled={completedSubtopics[subtopic._id]}
                                                        style={{
                                                            borderRadius: '20px',
                                                            transition: 'background-color 0.3s',
                                                            '&:hover': {
                                                                backgroundColor: completedSubtopics[subtopic._id] ? '#388e3c' : '#1976d2'
                                                            }
                                                        }}
                                                    >
                                                        {completedSubtopics[subtopic._id] ? 'Completed' : 'Complete'}
                                                    </Button>
                                                </CardActions>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}
                        </Grid>
                    </Grid>

                    {/* Take Quiz Button */}
                    {completedCount === totalCount && (
                        <Button variant="contained" color="primary" onClick={handleTakeQuiz} style={{ marginTop: '20px', borderRadius: '20px' }}>
                            Take Quiz
                        </Button>
                    )}
                </>
            )}

            {/* Snackbar for notifications */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CourseDetails;
