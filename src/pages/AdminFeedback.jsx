import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [courses, setCourses] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/all/feedbacks');
                setFeedbacks(response.data);
            } catch (err) {
                setError('Failed to fetch feedback');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/courses');
                setCourses(response.data);
            } catch (err) {
                setError('Failed to fetch courses');
                console.error(err);
            }
        };

        fetchFeedbacks();
        fetchCourses();
    }, []);

    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    const filteredFeedbacks = selectedCourse
        ? feedbacks.filter(feedback => feedback.courseId?._id === selectedCourse)
        : feedbacks;

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography variant="h6" color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container style={{ padding: '20px', backgroundColor: '#f4f7fc', borderRadius: '8px' }}>
            <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/admin')}
                style={{ marginBottom: '20px', marginTop: '20px' }}
            >
                Back to Admin Dashboard
            </Button>

            <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: 'bold', color: '#34495e' }}>
                Course Feedback
            </Typography>

            <FormControl fullWidth style={{ marginBottom: '20px' }}>
                <InputLabel>Select Course</InputLabel>
                <Select
                    value={selectedCourse}
                    onChange={handleCourseChange}
                    style={{ borderRadius: '5px' }} // Added border radius for the select
                >
                    <MenuItem value="">
                        <em>All Courses</em>
                    </MenuItem>
                    {courses.map((course) => (
                        <MenuItem key={course._id} value={course._id}>
                            {course.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Grid container spacing={3}>
                {filteredFeedbacks.map((feedback) => (
                    <Grid item xs={12} sm={6} md={4} key={feedback._id}>
                        <Card 
                            style={{ 
                                borderRadius: '10px', 
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
                                marginBottom: '20px', 
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.05)', // Scale effect on hover
                                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                                }
                            }} 
                        >
                            <CardContent>
                                <Typography variant="h5" style={{ color: '#2980b9' }}>
                                    {feedback.courseId?.title || 'Unknown Course'}
                                </Typography>
                                <Typography variant="body2" style={{ color: '#7f8c8d' }}>
                                    User: {feedback.userId?.username || 'Unknown User'}
                                </Typography>
                                <Typography variant="body2">
                                    Overall Satisfaction: <strong>{feedback.overallSatisfaction}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Content Quality: <strong>{feedback.contentQuality}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Instructor Effectiveness: <strong>{feedback.instructorEffectiveness}</strong>
                                </Typography>
                                <Typography variant="body2" style={{ color: '#95a5a6' }}>
                                    Comments: {feedback.comments || 'No comments provided'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Feedback;
