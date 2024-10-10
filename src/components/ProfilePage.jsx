import homeImage from '../assets/home.jpeg';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Snackbar, CircularProgress } from '@mui/material';
import axios from 'axios';

const ProfilePage = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
          try {
            const response = await axios.get('http://localhost:3000/api/user', { //fetching the user details
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            setUserDetails(response.data);
          } catch (err) {
            console.error('Error fetching user details:', err);
            setError('Failed to fetch user details. Please try again later.');
            setOpenSnackbar(true);
          } finally {
            setLoading(false);
          }
        };

        fetchUserDetails();
    }, []);

    const handleCloseSnackbar = () => {
      setOpenSnackbar(false);
    };

    if (loading) {
      return <CircularProgress style={{ marginTop: '90px' }} />;
    }

  return (
      <Container 
          maxWidth="sm" 
          style={{ 
            marginTop: '190px', 
            padding: '20px', 
            backgroundColor: 'rgba(245, 245, 245, 0.8)', 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            position: 'relative', 
            zIndex: 1,
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              backgroundImage: `url(${homeImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '200px',
              borderRadius: '12px 12px 0 0',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 0,
              filter: 'brightness(0.5)'
            }}
          />
          <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '20px', color: '#fff', position: 'relative', zIndex: 1 }}>
            User Profile
          </Typography>
          {userDetails ? (
            <Card 
              variant="outlined" 
              style={{ 
                marginTop: '20px', 
                borderRadius: '12px', 
                transition: 'transform 0.2s',
                position: 'relative',
                zIndex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.9)' // Slightly transparent card
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom style={{ textAlign: 'center', color: '#1976d2' }}>
                  {userDetails.username}
                </Typography>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}><span style={{ color: '#1976d2' }}>Email:</span> {userDetails.email}</Typography>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}><span style={{ color: '#1976d2' }}>Department:</span> {userDetails.department}</Typography>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}><span style={{ color: '#1976d2' }}>Team:</span> {userDetails.team}</Typography>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}><span style={{ color: '#1976d2' }}>Admin:</span> {userDetails.isAdmin ? 'Yes' : 'No'}</Typography>
              </CardContent>
            </Card>
          ) : (
            <Typography variant="body1" color="error" style={{ marginTop: '20px', textAlign: 'center' }}>
              User details not found.
            </Typography>
          )}

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={error}
          />
      </Container>
  );
};

export default ProfilePage;
