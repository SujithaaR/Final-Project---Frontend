import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Comments = () => {
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filteredComments, setFilteredComments] = useState([]);
    const [selectedUsername, setSelectedUsername] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/admin/all/comments');
                setComments(response.data);
                setFilteredComments(response.data);
            } catch (err) {
                setError('Failed to fetch comments');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchUsersAndCourses = async () => {
            try {
                const usersResponse = await axios.get('http://localhost:3000/api/users/all');
                const coursesResponse = await axios.get('http://localhost:3000/api/courses');
                setUsers(usersResponse.data);
                setCourses(coursesResponse.data);
            } catch (err) {
                console.error('Failed to fetch users or courses:', err);
            }
        };

        fetchComments();
        fetchUsersAndCourses();
    }, []);

    useEffect(() => {
        let filtered = comments;

        if (selectedUsername) {
            filtered = filtered.filter(comment => comment.userId.username === selectedUsername);
        }

        if (selectedCourse) {
            filtered = filtered.filter(comment => comment.courseId.title === selectedCourse);
        }

        setFilteredComments(filtered);
    }, [selectedUsername, selectedCourse, comments]);

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography variant="h6" color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container style={{ padding: '20px', backgroundColor: '#f4f7fc', borderRadius: '8px' }}>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/admin')} 
                style={{ marginBottom: '20px', marginTop: '20px' }}
            >
                Back to Admin Dashboard
            </Button>

            <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: 'bold', color: '#34495e' }}>
                Comments
            </Typography>
            
            <FormControl fullWidth style={{ marginBottom: '20px' }}>
                <InputLabel>Select User</InputLabel>
                <Select
                    value={selectedUsername}
                    onChange={(e) => setSelectedUsername(e.target.value)}
                    style={{ borderRadius: '5px' }} // Add border radius
                >
                    <MenuItem value="">
                        <em>All Users</em>
                    </MenuItem>
                    {users.map(user => (
                        <MenuItem key={user._id} value={user.username}>
                            {user.username}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth style={{ marginBottom: '20px' }}>
                <InputLabel>Select Course</InputLabel>
                <Select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    style={{ borderRadius: '5px' }} // Add border radius
                >
                    <MenuItem value="">
                        <em>All Courses</em>
                    </MenuItem>
                    {courses.map(course => (
                        <MenuItem key={course._id} value={course.title}>
                            {course.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Grid container spacing={3}>
                {filteredComments.map((comment) => (
                    <Grid item xs={12} sm={6} md={4} key={comment._id}>
                        <Card 
                            style={{ 
                                marginBottom: '20px', 
                                borderRadius: '10px', 
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
                                transition: 'transform 0.2s', 
                                '&:hover': {
                                    transform: 'scale(1.02)', // Scale effect on hover
                                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                                }
                            }} 
                        >
                            <CardContent>
                                <Typography variant="h6" style={{ color: '#2980b9' }}>
                                    Course: {comment.courseId?.title || 'Unknown Course'}
                                </Typography>
                                <Typography variant="body2" style={{ color: '#7f8c8d' }}>
                                    User: {comment.userId?.username || 'Unknown User'}
                                </Typography>
                                <Typography variant="body2" style={{ marginTop: '10px' }}>
                                    Comment: {comment.content}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Comments;
