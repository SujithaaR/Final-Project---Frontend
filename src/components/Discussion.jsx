import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
    IconButton,
    Box,
    Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Discussion = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId, courseId, enrollmentId } = location.state || {};
    
    const [content, setContent] = useState('');
    const [discussions, setDiscussions] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');



     // Fetch discussions for the course when the component mounts
     const fetchDiscussions = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/comment/course/${courseId}`);
            setDiscussions(response.data);
        } catch (error) {
            console.error('Error fetching discussions:', error);
        }
    };


    useEffect(() => {
       
        fetchDiscussions();
    }, [courseId]);


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

            setDiscussions(prev => [...prev, response.data]); // Add the new comment to the discussions
            setSnackbarMessage('Comment posted successfully.');
            setContent(''); // Clear content after submission
            fetchDiscussions();
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
        <Container 
            maxWidth="md" 
            style={{ 
                padding: '40px 20px',
                marginTop: '40px',
            }}
        >
            <IconButton onClick={handleBackClick} style={{ marginBottom: '16px' }}>
                <ArrowBackIcon />
            </IconButton>

            <Typography variant="h4" gutterBottom style={{ textAlign: 'center', color: '#1976d2' }}>
                Join the Discussion
            </Typography>

            <Typography variant="h6" align="center" style={{ marginBottom: '20px', fontWeight: '300' }}>
                Share your thoughts and insights!
            </Typography>

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

            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmit} 
                style={{ 
                    padding: '10px 20px', 
                    fontSize: '16px', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                }}
            >
                Post Comment
            </Button>

            <Box mt={4}>
       {discussions.map((discussion) => (
        <Grid container key={discussion._id} spacing={2} style={{ marginBottom: '10px' }}>
            <Grid item xs={12} md={discussion.userId?._id === userId ? 12 : 12}>
                <Box 
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        backgroundColor: discussion.userId?._id === userId ? '#e3f2fd' : '#f1f1f1',
                        textAlign: discussion.userId?._id === userId ? 'right' : 'left',
                    }}
                >
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        {discussion.userId?.username || 'Unknown User'}
                    </Typography>
                    <Typography variant="body2">{discussion.content}</Typography>
                </Box>
            </Grid>
        </Grid>
    ))}
</Box>


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
