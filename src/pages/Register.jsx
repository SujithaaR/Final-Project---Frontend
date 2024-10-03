import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, FormControlLabel, Checkbox, IconButton, InputAdornment, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const departments = ['HR', 'Engineering', 'Marketing', 'Sales'];
const teams = ['Team A', 'Team B', 'Team C', 'Team D'];

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        isAdmin: false,
        department: '',
        team: '',
        adminCode: '' // New field for admin code
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        try {
            await axios.post('http://localhost:3000/api/register', formData);
            toast.success('Registration successful!');
            setFormData({
                username: '',
                password: '',
                email: '',
                isAdmin: false,
                department: '',
                team: '',
                adminCode: '' // Reset admin code field
            });
        } catch (error) {
            console.error('Registration error:', error.response.data);
            toast.error('Registration failed: ' + error.response.data.message);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Register New User
                </Typography>
                <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '1rem' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClickShowPassword} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    
                    {/* Dropdown for Department */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="department-label">Department</InputLabel>
                        <Select
                            labelId="department-label"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        >
                            {departments.map((dept) => (
                                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Dropdown for Team */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="team-label">Team</InputLabel>
                        <Select
                            labelId="team-label"
                            name="team"
                            value={formData.team}
                            onChange={handleChange}
                            required
                        >
                            {teams.map((team) => (
                                <MenuItem key={team} value={team}>{team}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Checkbox
                                name="isAdmin"
                                checked={formData.isAdmin}
                                onChange={handleChange}
                            />
                        }
                        label="Admin"
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Register
                    </Button>
                </form>
            </Box>
            <ToastContainer />
        </Container>
    );
};

export default Register;
