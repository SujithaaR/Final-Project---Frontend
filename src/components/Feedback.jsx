import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import {
    Container,
    Typography,
    Button,
    TextField,
    Snackbar,
    Alert,
    Rating,
    IconButton, // Import IconButton for the back arrow
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import back arrow icon
import axios from 'axios';

const FeedbackPage = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize useNavigate
    const { userId, courseId, enrollmentId } = location.state || {};

    const [overallSatisfaction, setOverallSatisfaction] = useState(0);
    const [contentQuality, setContentQuality] = useState(0);
    const [instructorEffectiveness, setInstructorEffectiveness] = useState(0);
    const [comments, setComments] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();

        const feedbackData = {
            userId,
            courseId,
            enrollmentId,
            overallSatisfaction,
            contentQuality,
            instructorEffectiveness,
            comments,
        };

        try {
            const response = await axios.post('http://localhost:3000/api/feedback/add', feedbackData);
            setSnackbarMessage(response.data.message);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            // Reset fields after successful submission
            setOverallSatisfaction(0);
            setContentQuality(0);
            setInstructorEffectiveness(0);
            setComments('');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setSnackbarMessage('Failed to submit feedback');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Function to handle back navigation
    const handleBackClick = () => {
        navigate(-1); // This will go back to the previous page
    };

    return (
        <Container>
            <IconButton onClick={handleBackClick} style={{ marginBottom: '16px' }}>
                <ArrowBackIcon />
            </IconButton>

            <Typography variant="h4" gutterBottom>
                Course Feedback
            </Typography>

            <form onSubmit={handleSubmitFeedback}>
                <Typography variant="h6">Overall Satisfaction</Typography>
                <Rating
                    value={overallSatisfaction}
                    onChange={(event, newValue) => setOverallSatisfaction(newValue)}
                    precision={0.5}
                />

                <Typography variant="h6">Content Quality</Typography>
                <Rating
                    value={contentQuality}
                    onChange={(event, newValue) => setContentQuality(newValue)}
                    precision={0.5}
                />

                <Typography variant="h6">Instructor Effectiveness</Typography>
                <Rating
                    value={instructorEffectiveness}
                    onChange={(event, newValue) => setInstructorEffectiveness(newValue)}
                    precision={0.5}
                />

                <TextField
                    label="Additional Comments"
                    multiline
                    rows={4}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    fullWidth
                    variant="outlined"
                    style={{ marginTop: '16px' }}
                />

                <Button variant="contained" color="primary" type="submit" style={{ marginTop: '16px' }}>
                    Submit Feedback
                </Button>
            </form>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default FeedbackPage;
