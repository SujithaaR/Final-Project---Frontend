import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
    IconButton, // Import IconButton for the back arrow
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import back arrow icon

const Discussion = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId, courseId, enrollmentId } = location.state || {};
    
    const [content, setContent] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSubmit = async () => {
        if (!content) {
            setSnackbarMessage('Content is required.');
            setSnackbarOpen(true);
            return;
        }
       
        try {
            const response = await axios.post('http://localhost:3000/api/addcomments', {
                userId,
                enrollmentId,
                courseId,
                content,
            });

            setSnackbarMessage('Comment posted successfully.');
            setContent(''); // Clear content after submission
        } catch (error) {
            console.error('Error posting comment:', error);
            setSnackbarMessage('Error posting comment.');
        } finally {
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

            <Typography variant="h4" gutterBottom>Discussion</Typography>

            <TextField
                label="Your Comment"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ marginBottom: '20px' }}
            />

            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Post Comment
            </Button>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarMessage.includes('Error') ? 'error' : 'success'}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Discussion;
