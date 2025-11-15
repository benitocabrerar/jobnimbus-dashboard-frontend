import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  color: string;
}

interface RoleManagementProps {
  onNotify: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
}

export const RoleManagement: React.FC<RoleManagementProps> = ({ onNotify }) => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Admin',
      description: 'Full system access and control',
      userCount: 3,
      permissions: ['all'],
      color: '#d32f2f',
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Manage users and view reports',
      userCount: 8,
      permissions: ['users.view', 'users.edit', 'reports.view'],
      color: '#ed6c02',
    },
    {
      id: '3',
      name: 'Viewer',
      description: 'Read-only access to dashboard',
      userCount: 13,
      permissions: ['dashboard.view', 'reports.view'],
      color: '#0288d1',
    },
  ]);

  const allPermissions: Permission[] = [
    { id: 'dashboard.view', name: 'View Dashboard', description: 'Access main dashboard', category: 'Dashboard' },
    { id: 'users.view', name: 'View Users', description: 'View user list', category: 'Users' },
    { id: 'users.edit', name: 'Edit Users', description: 'Create and modify users', category: 'Users' },
    { id: 'users.delete', name: 'Delete Users', description: 'Remove users from system', category: 'Users' },
    { id: 'reports.view', name: 'View Reports', description: 'Access reports', category: 'Reports' },
    { id: 'reports.export', name: 'Export Reports', description: 'Download report data', category: 'Reports' },
    { id: 'system.config', name: 'System Config', description: 'Modify system settings', category: 'System' },
  ];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  const handleOpenDialog = (role?: Role) => {
    if (role) {
      setSelectedRole(role);
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      });
    } else {
      setSelectedRole(null);
      setFormData({
        name: '',
        description: '',
        permissions: [],
      });
    }
    setDialogOpen(true);
  };

  const handleSaveRole = () => {
    if (selectedRole) {
      setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, ...formData } : r));
      onNotify('Role updated successfully', 'success');
    } else {
      const newRole: Role = {
        id: Date.now().toString(),
        ...formData,
        userCount: 0,
        color: '#9c27b0',
      };
      setRoles([...roles, newRole]);
      onNotify('Role created successfully', 'success');
    }
    setDialogOpen(false);
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="600">
          Roles & Permissions
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Role
        </Button>
      </Box>

      <Grid container spacing={3}>
        {roles.map((role) => (
          <Grid item xs={12} md={6} lg={4} key={role.id}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: role.color,
                  boxShadow: `0 4px 12px ${role.color}20`,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShieldIcon sx={{ color: role.color, fontSize: 32 }} />
                    <Box>
                      <Typography variant="h6" fontWeight="600">
                        {role.name}
                      </Typography>
                      <Chip
                        label={`${role.userCount} users`}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                  <IconButton size="small" onClick={() => handleOpenDialog(role)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {role.description}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary" fontWeight="600">
                  PERMISSIONS
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {role.permissions.includes('all') ? (
                    <Chip
                      label="All Permissions"
                      size="small"
                      color="success"
                      icon={<CheckIcon />}
                    />
                  ) : (
                    role.permissions.slice(0, 3).map((perm) => (
                      <Chip key={perm} label={perm.split('.')[1]} size="small" variant="outlined" />
                    ))
                  )}
                  {role.permissions.length > 3 && !role.permissions.includes('all') && (
                    <Chip label={`+${role.permissions.length - 3} more`} size="small" />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Role Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Role Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Divider />
            <Typography variant="subtitle2" fontWeight="600">
              Permissions
            </Typography>
            <List dense>
              {allPermissions.map((permission) => (
                <ListItem
                  key={permission.id}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.permissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          {permission.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {permission.description}
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
                  <Chip label={permission.category} size="small" variant="outlined" />
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveRole}
            disabled={!formData.name || !formData.description}
          >
            {selectedRole ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleManagement;
