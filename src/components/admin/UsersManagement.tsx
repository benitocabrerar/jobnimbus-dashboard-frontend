import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Alert,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import {
  Check as CheckIcon,
  Block as BlockIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { adminApiService } from '../../services/adminApiService';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  status: 'pending' | 'active' | 'suspended';
  createdAt: string;
  lastLoginAt: string | null;
}

export const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Dialog states
  const [approveDialog, setApproveDialog] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });
  const [suspendDialog, setSuspendDialog] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    user: User | null;
    editedRole: string;
  }>({
    open: false,
    user: null,
    editedRole: 'viewer',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (roleFilter !== 'all') params.role = roleFilter;

      const data = await adminApiService.getUsers(params);
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!approveDialog.user) return;

    try {
      await adminApiService.approveUser(approveDialog.user.id);
      setApproveDialog({ open: false, user: null });
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to approve user');
    }
  };

  const handleSuspend = async () => {
    if (!suspendDialog.user) return;

    try {
      await adminApiService.suspendUser(suspendDialog.user.id);
      setSuspendDialog({ open: false, user: null });
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to suspend user');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.user) return;

    try {
      await adminApiService.deleteUser(deleteDialog.user.id);
      setDeleteDialog({ open: false, user: null });
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const handleEdit = async () => {
    if (!editDialog.user) return;

    try {
      await adminApiService.updateUser(editDialog.user.id, {
        role: editDialog.editedRole as 'admin' | 'manager' | 'viewer',
      });
      setEditDialog({ open: false, user: null, editedRole: 'viewer' });
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box>
      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={roleFilter}
            label="Role"
            onChange={(e: SelectChangeEvent) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="viewer">Viewer</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchUsers}
        >
          Refresh
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Users Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary" sx={{ py: 2 }}>
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        color={getRoleColor(user.role) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        size="small"
                        color={getStatusColor(user.status) as any}
                      />
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>{formatDate(user.lastLoginAt)}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        {user.status === 'pending' && (
                          <Tooltip title="Approve">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => setApproveDialog({ open: true, user })}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {user.status === 'active' && (
                          <Tooltip title="Suspend">
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => setSuspendDialog({ open: true, user })}
                            >
                              <BlockIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Edit Role">
                          <IconButton
                            size="small"
                            onClick={() =>
                              setEditDialog({
                                open: true,
                                user,
                                editedRole: user.role,
                              })
                            }
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, user })}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Approve Dialog */}
      <Dialog open={approveDialog.open} onClose={() => setApproveDialog({ open: false, user: null })}>
        <DialogTitle>Approve User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve <strong>{approveDialog.user?.name}</strong>? This will
            grant them access to the dashboard.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialog({ open: false, user: null })}>Cancel</Button>
          <Button onClick={handleApprove} variant="contained" color="success">
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Suspend Dialog */}
      <Dialog open={suspendDialog.open} onClose={() => setSuspendDialog({ open: false, user: null })}>
        <DialogTitle>Suspend User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to suspend <strong>{suspendDialog.user?.name}</strong>? They will
            lose access to the dashboard.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuspendDialog({ open: false, user: null })}>Cancel</Button>
          <Button onClick={handleSuspend} variant="contained" color="warning">
            Suspend
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete <strong>{deleteDialog.user?.name}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, user: null })}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, user: null, editedRole: 'viewer' })}>
        <DialogTitle>Edit User Role</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update role for <strong>{editDialog.user?.name}</strong>
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={editDialog.editedRole}
              label="Role"
              onChange={(e) =>
                setEditDialog({
                  ...editDialog,
                  editedRole: e.target.value,
                })
              }
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="viewer">Viewer</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, user: null, editedRole: 'viewer' })}>
            Cancel
          </Button>
          <Button onClick={handleEdit} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersManagement;
