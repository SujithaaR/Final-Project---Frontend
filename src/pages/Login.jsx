import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, IconButton, InputAdornment, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Message for Snackbar
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Severity level

    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };
   
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/login', credentials);
           
            localStorage.setItem('token', response.data.token); // Store the token
            localStorage.setItem('userId', response.data.user.id); // Update this line to extract user ID correctly
             // Set the session start time
            localStorage.setItem('sessionStartTime', Date.now()); // Store the current timestamp as session start time
            localStorage.setItem('isAdmin', response.data.user.isAdmin);

            setSnackbarMessage('Login successful!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
              // Check if the user is an admin
              if (response.data.user.isAdmin) {
                navigate('/Admin'); // Navigate to admin dashboard
            } else {
                navigate('/courses'); // Navigate to the courses page
            }
        } catch (error) {
            setSnackbarMessage('Login failed: ' + error.response.data.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };
    

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword); // Toggle password visibility
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                padding: '2rem',
                borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            }}
        >
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', color: '#34495e', mb: 2 }}>
                Login
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '1rem' }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Username"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    sx={{
                        backgroundColor: '#fff',
                        borderRadius: '5px',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#ddd', 
                            },
                            '&:hover fieldset': {
                                borderColor: '#2980b9', 
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#2980b9', 
                            },
                        },
                    }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    type={showPassword ? 'text' : 'password'} // Toggle password visibility
                    label="Password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    sx={{
                        backgroundColor: '#fff',
                        borderRadius: '5px',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#ddd',
                            },
                            '&:hover fieldset': {
                                borderColor: '#2980b9',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#2980b9',
                            },
                        },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, backgroundColor: '#2980b9', '&:hover': { backgroundColor: '#1e6a94' } }}>
                    Login
                </Button>
            </form>
        </Box>
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000} // Duration before it automatically closes
            onClose={handleSnackbarClose}
            message={snackbarMessage}
            severity={snackbarSeverity}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Position of the Snackbar
        />
    </Container>
    );
};

export default Login;


