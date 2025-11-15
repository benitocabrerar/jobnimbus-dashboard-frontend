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
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  PlayArrow as TestIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { adminApiService } from '../../services/adminApiService';

interface Credential {
  id: string;
  name: string;
  type: 'jobnimbus' | 'openweather' | 'render' | 'github' | 'redis';
  status: 'active' | 'invalid' | 'expired';
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const CredentialsManagement: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Dialog states
  const [createDialog, setCreateDialog] = useState({
    open: false,
    name: '',
    type: 'jobnimbus' as 'jobnimbus' | 'openweather' | 'render' | 'github' | 'redis',
    apiKey: '',
    showApiKey: false,
  });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    credential: Credential | null;
    name: string;
    apiKey: string;
    showApiKey: boolean;
  }>({
    open: false,
    credential: null,
    name: '',
    apiKey: '',
    showApiKey: false,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    credential: Credential | null;
  }>({
    open: false,
    credential: null,
  });

  const [testDialog, setTestDialog] = useState<{
    open: boolean;
    credential: Credential | null;
    testing: boolean;
    result: { success: boolean; message: string } | null;
  }>({
    open: false,
    credential: null,
    testing: false,
    result: null,
  });

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (typeFilter !== 'all') params.type = typeFilter;

      const data = await adminApiService.getCredentials(params);
      setCredentials(data.credentials || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await adminApiService.createCredential({
        name: createDialog.name,
        type: createDialog.type,
        apiKey: createDialog.apiKey,
      });

      setSuccess('Credential created successfully');
      setCreateDialog({
        open: false,
        name: '',
        type: 'jobnimbus',
        apiKey: '',
        showApiKey: false,
      });
      fetchCredentials();
    } catch (err: any) {
      setError(err.message || 'Failed to create credential');
    }
  };

  const handleEdit = async () => {
    if (!editDialog.credential) return;

    try {
      await adminApiService.updateCredential(editDialog.credential.id, {
        name: editDialog.name,
        apiKey: editDialog.apiKey || undefined,
      });

      setSuccess('Credential updated successfully');
      setEditDialog({
        open: false,
        credential: null,
        name: '',
        apiKey: '',
        showApiKey: false,
      });
      fetchCredentials();
    } catch (err: any) {
      setError(err.message || 'Failed to update credential');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.credential) return;

    try {
      await adminApiService.deleteCredential(deleteDialog.credential.id);
      setSuccess('Credential deleted successfully');
      setDeleteDialog({ open: false, credential: null });
      fetchCredentials();
    } catch (err: any) {
      setError(err.message || 'Failed to delete credential');
    }
  };

  const handleTest = async () => {
    if (!testDialog.credential) return;

    setTestDialog({ ...testDialog, testing: true, result: null });

    try {
      const result = await adminApiService.testCredential(testDialog.credential.id);
      setTestDialog({
        ...testDialog,
        testing: false,
        result: {
          success: result.valid,
          message: result.message || (result.valid ? 'Credential is valid' : 'Credential is invalid'),
        },
      });
    } catch (err: any) {
      setTestDialog({
        ...testDialog,
        testing: false,
        result: {
          success: false,
          message: err.message || 'Test failed',
        },
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'invalid':
        return 'error';
      case 'expired':
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
      {/* Actions Bar */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialog({ ...createDialog, open: true })}
        >
          Add Credential
        </Button>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e: SelectChangeEvent) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="jobnimbus">JobNimbus</MenuItem>
            <MenuItem value="openweather">OpenWeather</MenuItem>
            <MenuItem value="render">Render</MenuItem>
            <MenuItem value="github">GitHub</MenuItem>
            <MenuItem value="redis">Redis</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchCredentials}>
          Refresh
        </Button>
      </Box>

      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Credentials Table */}
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
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Used</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {credentials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary" sx={{ py: 2 }}>
                      No credentials found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                credentials.map((credential) => (
                  <TableRow key={credential.id} hover>
                    <TableCell>{credential.name}</TableCell>
                    <TableCell>
                      <Chip label={credential.type} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={credential.status}
                        size="small"
                        color={getStatusColor(credential.status) as any}
                      />
                    </TableCell>
                    <TableCell>{formatDate(credential.lastUsedAt)}</TableCell>
                    <TableCell>{formatDate(credential.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Tooltip title="Test">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              setTestDialog({
                                open: true,
                                credential,
                                testing: false,
                                result: null,
                              })
                            }
                          >
                            <TestIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() =>
                              setEditDialog({
                                open: true,
                                credential,
                                name: credential.name,
                                apiKey: '',
                                showApiKey: false,
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
                            onClick={() => setDeleteDialog({ open: true, credential })}
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

      {/* Create Dialog */}
      <Dialog
        open={createDialog.open}
        onClose={() =>
          setCreateDialog({
            open: false,
            name: '',
            type: 'jobnimbus',
            apiKey: '',
            showApiKey: false,
          })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Credential</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={createDialog.name}
              onChange={(e) => setCreateDialog({ ...createDialog, name: e.target.value })}
              fullWidth
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Type</InputLabel>
              <Select
                value={createDialog.type}
                label="Type"
                onChange={(e) =>
                  setCreateDialog({
                    ...createDialog,
                    type: e.target.value as any,
                  })
                }
              >
                <MenuItem value="jobnimbus">JobNimbus</MenuItem>
                <MenuItem value="openweather">OpenWeather</MenuItem>
                <MenuItem value="render">Render</MenuItem>
                <MenuItem value="github">GitHub</MenuItem>
                <MenuItem value="redis">Redis</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="API Key"
              type={createDialog.showApiKey ? 'text' : 'password'}
              value={createDialog.apiKey}
              onChange={(e) => setCreateDialog({ ...createDialog, apiKey: e.target.value })}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setCreateDialog({
                          ...createDialog,
                          showApiKey: !createDialog.showApiKey,
                        })
                      }
                      edge="end"
                    >
                      {createDialog.showApiKey ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setCreateDialog({
                open: false,
                name: '',
                type: 'jobnimbus',
                apiKey: '',
                showApiKey: false,
              })
            }
          >
            Cancel
          </Button>
          <Button onClick={handleCreate} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() =>
          setEditDialog({
            open: false,
            credential: null,
            name: '',
            apiKey: '',
            showApiKey: false,
          })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Credential</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={editDialog.name}
              onChange={(e) => setEditDialog({ ...editDialog, name: e.target.value })}
              fullWidth
              required
            />

            <TextField
              label="New API Key (leave blank to keep current)"
              type={editDialog.showApiKey ? 'text' : 'password'}
              value={editDialog.apiKey}
              onChange={(e) => setEditDialog({ ...editDialog, apiKey: e.target.value })}
              fullWidth
              helperText="Only provide if you want to update the API key"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setEditDialog({
                          ...editDialog,
                          showApiKey: !editDialog.showApiKey,
                        })
                      }
                      edge="end"
                    >
                      {editDialog.showApiKey ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setEditDialog({
                open: false,
                credential: null,
                name: '',
                apiKey: '',
                showApiKey: false,
              })
            }
          >
            Cancel
          </Button>
          <Button onClick={handleEdit} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, credential: null })}
      >
        <DialogTitle>Delete Credential</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete <strong>{deleteDialog.credential?.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, credential: null })}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Test Dialog */}
      <Dialog
        open={testDialog.open}
        onClose={() =>
          setTestDialog({
            open: false,
            credential: null,
            testing: false,
            result: null,
          })
        }
      >
        <DialogTitle>Test Credential</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Testing credential: <strong>{testDialog.credential?.name}</strong>
          </DialogContentText>

          {testDialog.testing && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {testDialog.result && (
            <Alert
              severity={testDialog.result.success ? 'success' : 'error'}
              icon={testDialog.result.success ? <CheckCircleIcon /> : <ErrorIcon />}
            >
              {testDialog.result.message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setTestDialog({
                open: false,
                credential: null,
                testing: false,
                result: null,
              })
            }
          >
            Close
          </Button>
          {!testDialog.testing && !testDialog.result && (
            <Button onClick={handleTest} variant="contained">
              Test
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CredentialsManagement;
