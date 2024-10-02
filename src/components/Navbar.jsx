import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Check if the user is an admin

    const handleLogout = async () => {
        const sessionStartTime = localStorage.getItem('sessionStartTime');
      
        if (sessionStartTime && token) {
            const sessionEndTime = Date.now();
            const sessionDuration = (sessionEndTime - sessionStartTime) / 1000; // Time in seconds
          
            try {
                
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
        localStorage.removeItem('userId'); 
        localStorage.removeItem('isAdmin'); 
        localStorage.removeItem('sessionStartTime'); 
    
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
                        {isAdmin ? (
                            <>
                                <Button color="inherit" component={Link} to="/admin-dashboard">
                                    Admin Dashboard
                                </Button>
                                <Typography color="inherit" >
                                     ADMIN
                                </Typography>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/courses">
                                    Courses
                                </Button>
                                <Typography color="inherit" >
                                    EMPLOYEE
                                </Typography>
                            </>
                        )}
                        <Button color="inherit" onClick={handleLogout}>
                            LOGOUT
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
