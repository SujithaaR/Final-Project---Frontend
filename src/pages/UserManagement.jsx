import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  Modal, 
  TextField, 
  Box, 
  Typography, 
  Paper, 
  Snackbar, 
  Alert 
} from '@mui/material';
import axios from 'axios';


const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [updatedData, setUpdatedData] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const response = await axios.get('http://localhost:3000/api/users/all');
            setUsers(response.data);
          } catch (error) {
            console.error("Error fetching users:", error);
          }
        };
        fetchUsers();
    }, []);

    const handleEditOpen = (user) => {
        setSelectedUser(user);
        setUpdatedData(user);
        setOpen(true);
    };

    const handleEditClose = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    const handleDelete = async (userId) => {
        try {
          await axios.delete('http://localhost:3000/api/users/admin/delete', { data: { userId } });
          setUsers(users.filter(user => user._id !== userId));
          setSnackbar({ open: true, message: 'User deleted successfully!', severity: 'success' });
        } catch (error) {
          console.error("Error deleting user:", error);
          setSnackbar({ open: true, message: 'Error deleting user.', severity: 'error' });
        }
    };

    const handleUpdate = async () => {
        try {
          await axios.put('http://localhost:3000/api/edit/users', { userId: selectedUser._id, updatedData });
          setUsers(users.map(user => (user._id === selectedUser._id ? { ...user, ...updatedData } : user)));
          handleEditClose();
          setSnackbar({ open: true, message: 'User updated successfully!', severity: 'success' });
        } catch (error) {
          console.error("Error updating user:", error);
          setSnackbar({ open: true, message: 'Error updating user.', severity: 'error' });
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
  };

  return (
      <Box sx={{ padding: 2 ,marginTop:'70px'}} >
        <Typography variant="h4" gutterBottom>User Management</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.team}</TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      onClick={() => handleEditOpen(user)} 
                      sx={{ marginRight: 1 }}
                    >
                      Edit
                    </Button>
                    <Button 
                      onClick={() => handleDelete(user._id)} 
                      color="error"
                      variant="outlined"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
            <Modal open={open} onClose={handleEditClose}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            width: 400, 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            boxShadow: 24, 
            padding: 4, 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
            <Typography variant="h6">Edit User</Typography>
            <Button 
              onClick={handleEditClose} 
              color="inherit" 
              sx={{ 
                borderRadius: '50%', 
                minWidth: 0, 
                width: '30px', 
                height: '30px', 
                lineHeight: '1', 
                '&:hover': { backgroundColor: 'lightgray' }
              }}
            >
              ×
            </Button>
          </Box>
          <TextField
            label="Username"
            value={updatedData.username || ''}
            onChange={(e) => setUpdatedData({ ...updatedData, username: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={updatedData.email || ''}
            onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Department"
            value={updatedData.department || ''}
            onChange={(e) => setUpdatedData({ ...updatedData, department: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Team"
            value={updatedData.team || ''}
            onChange={(e) => setUpdatedData({ ...updatedData, team: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Button 
            onClick={handleUpdate} 
            variant="contained" 
            color="primary" 
            sx={{ marginTop: 2 }}
          >
            Update
          </Button>
        </Box>
      </Modal>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
  );
};

export default UserManagement;
