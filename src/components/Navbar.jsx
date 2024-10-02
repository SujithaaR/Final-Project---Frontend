// Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = async () => {
        const sessionStartTime = localStorage.getItem('sessionStartTime');
        const token = localStorage.getItem('token');
      
        if (sessionStartTime && token) {
            const sessionEndTime = Date.now();
            const sessionDuration = (sessionEndTime - sessionStartTime) / 1000; // Time in seconds
            
            
            try {
                // Optionally send the time spent to the backend
                await axios.put('http://localhost:3000/api/users/update-time', {
                    sessionDuration, // Send the session duration to the backend
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass token for authentication
                    },
                });
    
                console.log(`Session time sent: ${sessionDuration} seconds`);
            } catch (error) {
             
                console.error('Error updating time spent:', error);
                alert('Error updating your session time. Please try again later.');
            }
        }
    
        // Clear localStorage or session data
        localStorage.removeItem('token');
        localStorage.removeItem('userId'); // If you stored userId
        localStorage.removeItem('sessionStartTime'); // If tracking start time
    
        // Navigate to login page after successful logout
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Course Management System
                </Typography>
                {token ? (
                    <>
                        <Button color="inherit" component={Link} to="/courses">
                            Courses
                        </Button>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                        <Button color="inherit" component={Link} to="/register">
                            Register
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;

