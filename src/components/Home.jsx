import React from 'react';
import { Container, Typography, Button, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import homeImage from '../assets/home.jpeg';

const Home = () => {
    return (
        <Container sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Grid container spacing={5} alignItems="center">
                
                {/* Left Column for Content */}
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '10px',
                            padding: '4rem', // Increased padding
                            textAlign: 'center',
                            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <Typography variant="h1" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold', fontSize: '3rem' }}>
                            Unlock Your Learning Potential!
                        </Typography>
                        <Typography variant="h5" paragraph sx={{ color: '#34495e', mb: 4, fontSize: '1.25rem' }}>
                            Join thousands of learners. Start courses, take quizzes, and track your achievements with ease. Your path to success starts here!
                        </Typography>
                        <Box>
                            <Button
                                variant="outlined"
                                color="primary"
                                component={Link}
                                to="/login"
                                sx={{ padding: '15px 30px', fontSize: '1.25rem', borderRadius: '5px', transition: '0.3s', '&:hover': { backgroundColor: '#1976d2', color: '#fff' }}}
                            >
                                Login
                            </Button>
                        </Box>
                    </Box>
                </Grid>

                {/* Right Column for Image */}
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            backgroundImage: `url(${homeImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '500px', // Increased height for the image box
                            borderRadius: '10px',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                        }}
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Home;
