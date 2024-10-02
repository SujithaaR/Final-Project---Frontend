import React from 'react';
import { Container, Typography, Button, Box,Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import homeImage from '../assets/home.jpeg'; 

const Home = () => {
    return (
        <Container sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
                {/* Left Column for Content */}
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            borderRadius: '10px',
                            padding: '2rem',
                            textAlign: 'center',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Typography variant="h2" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
                            Unlock Your Learning Potential!
                        </Typography>
                        <Typography variant="h5" paragraph sx={{ color: '#34495e' }}>
                            Join thousands of learners. Start courses, take quizzes, and track your achievements with ease. Your path to success starts here!
                        </Typography>
                        <Box>
                            <Button
                                variant="contained"
                                color="primary"
                                component={Link}
                                to="/register"
                                sx={{ mr: 2, padding: '10px 20px', fontSize: '1rem', borderRadius: '5px' }}
                            >
                                Register Now
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                component={Link}
                                to="/login"
                                sx={{ padding: '10px 20px', fontSize: '1rem', borderRadius: '5px' }}
                            >
                                Login
                            </Button>
                        </Box>
                    </Box>
                </Grid>
                {/* Right Column for Image */}
                
                    <Box
                        sx={{
                            backgroundImage: `url(${homeImage})`,
                            backgroundSize: 'contain', // Adjust to 'contain'
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            height: '100%', // Ensure the image takes full height
                            borderRadius: '10px',
                        }}
                    />
            
        </Container>
    );
};

export default Home;
