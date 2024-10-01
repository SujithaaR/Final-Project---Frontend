// Home.jsx
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
    const token = localStorage.getItem('token'); // Check for a JWT token

    return (
        <Container>
            <Typography variant="h2" gutterBottom>
                Welcome to the Course Management System
            </Typography>
            <Typography variant="h5" paragraph>
                Here you can enroll in courses, take quizzes, and track your progress.
            </Typography>
            {token ? ( // Conditional rendering based on token presence
                <>
                    <Button variant="contained" component={Link} to="/courses" sx={{ mr: 2 }}>
                        View Courses
                    </Button>
                </>
            ) : (
                <>
                    <Button variant="contained" component={Link} to="/register" sx={{ mr: 2 }}>
                        Register Now
                    </Button>
                    <Button variant="outlined" component={Link} to="/login">
                        Login
                    </Button>
                </>
            )}
        </Container>
    );
};

export default Home;

