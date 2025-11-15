import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  VpnKey as ApiKeyIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
  Palette as ThemeIcon,
  ContentCopy as CopyIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface SystemConfigProps {
  onNotify: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed?: string;
}

export const SystemConfig: React.FC<SystemConfigProps> = ({ onNotify }) => {
  const [config, setConfig] = useState({
    siteName: 'JobNimbus Dashboard',
    siteUrl: 'https://dashboard.poweria.com',
    supportEmail: 'support@poweria.com',
    enableRegistration: false,
    requireEmailVerification: true,
    sessionTimeout: 60,
    enableTwoFactor: false,
    enableNotifications: true,
    notificationEmail: 'admin@poweria.com',
  });

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'jn_prod_xxx...xxx',
      created: '2024-01-15',
      lastUsed: '2024-11-15 10:30',
    },
    {
      id: '2',
      name: 'Development API',
      key: 'jn_dev_xxx...xxx',
      created: '2024-02-20',
    },
  ]);

  const handleSaveConfig = () => {
    onNotify('Configuration saved successfully', 'success');
  };

  const handleGenerateApiKey = () => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: 'New API Key',
      key: `jn_${Date.now()}_xxx...xxx`,
      created: new Date().toISOString().split('T')[0],
    };
    setApiKeys([...apiKeys, newKey]);
    onNotify('API key generated successfully', 'success');
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    onNotify('API key copied to clipboard', 'success');
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
    onNotify('API key deleted', 'success');
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="600">
          System Configuration
        </Typography>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveConfig}>
          Save Changes
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LanguageIcon color="primary" />
                <Typography variant="h6" fontWeight="600">
                  General Settings
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Site Name"
                  fullWidth
                  value={config.siteName}
                  onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                />
                <TextField
                  label="Site URL"
                  fullWidth
                  value={config.siteUrl}
                  onChange={(e) => setConfig({ ...config, siteUrl: e.target.value })}
                />
                <TextField
                  label="Support Email"
                  fullWidth
                  value={config.supportEmail}
                  onChange={(e) => setConfig({ ...config, supportEmail: e.target.value })}
                />
                <TextField
                  label="Session Timeout (minutes)"
                  type="number"
                  fullWidth
                  value={config.sessionTimeout}
                  onChange={(e) => setConfig({ ...config, sessionTimeout: Number(e.target.value) })}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <SecurityIcon color="error" />
                <Typography variant="h6" fontWeight="600">
                  Security Settings
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.enableRegistration}
                      onChange={(e) => setConfig({ ...config, enableRegistration: e.target.checked })}
                    />
                  }
                  label="Enable User Registration"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.requireEmailVerification}
                      onChange={(e) => setConfig({ ...config, requireEmailVerification: e.target.checked })}
                    />
                  }
                  label="Require Email Verification"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.enableTwoFactor}
                      onChange={(e) => setConfig({ ...config, enableTwoFactor: e.target.checked })}
                    />
                  }
                  label="Enable Two-Factor Authentication"
                />
                <Alert severity="info" sx={{ mt: 1 }}>
                  Two-factor authentication adds an extra layer of security to user accounts.
                </Alert>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <NotificationsIcon color="warning" />
                <Typography variant="h6" fontWeight="600">
                  Notifications
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.enableNotifications}
                      onChange={(e) => setConfig({ ...config, enableNotifications: e.target.checked })}
                    />
                  }
                  label="Enable System Notifications"
                />
                <TextField
                  label="Notification Email"
                  fullWidth
                  disabled={!config.enableNotifications}
                  value={config.notificationEmail}
                  onChange={(e) => setConfig({ ...config, notificationEmail: e.target.value })}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* API Keys */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ApiKeyIcon color="success" />
                  <Typography variant="h6" fontWeight="600">
                    API Keys
                  </Typography>
                </Box>
                <IconButton size="small" color="primary" onClick={handleGenerateApiKey}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <List dense>
                {apiKeys.map((apiKey) => (
                  <ListItem
                    key={apiKey.id}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                    secondaryAction={
                      <Box>
                        <IconButton size="small" onClick={() => handleCopyKey(apiKey.key)}>
                          <CopyIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteKey(apiKey.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={apiKey.name}
                      secondary={
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {apiKey.key}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip label={`Created: ${apiKey.created}`} size="small" variant="outlined" />
                            {apiKey.lastUsed && (
                              <Chip label={`Last used: ${apiKey.lastUsed}`} size="small" color="success" />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemConfig;
