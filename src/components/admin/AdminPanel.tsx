import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  Breadcrumbs,
  Link,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Shield as RolesIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Computer as SystemIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';
import { UserManagement } from './UserManagement';
import { RoleManagement } from './RoleManagement';
import { SystemConfig } from './SystemConfig';
import { AuditLogs } from './AuditLogs';
import { SystemStats } from './SystemStats';
import { useAuth } from '../../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const AdminPanel: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // Determine active tab from URL
  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/admin/users')) return 1;
    if (path.includes('/admin/roles')) return 2;
    if (path.includes('/admin/config')) return 3;
    if (path.includes('/admin/audit')) return 4;
    if (path.includes('/admin/system')) return 5;
    return 0; // Default to dashboard
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());

  // Update active tab when URL changes
  React.useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);

    // Update URL based on tab
    const paths = [
      '/admin',
      '/admin/users',
      '/admin/roles',
      '/admin/config',
      '/admin/audit',
      '/admin/system',
    ];
    navigate(paths[newValue]);
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">
          Access Denied. Only administrators can access this panel.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          Dashboard
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          Admin Panel
        </Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Admin Panel
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Complete control of your JobNimbus Dashboard
        </Typography>
      </Box>

      {/* Main Content */}
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="admin panel tabs"
            sx={{ px: 2 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              icon={<DashboardIcon />}
              iconPosition="start"
              label="Dashboard"
              id="admin-tab-0"
              aria-controls="admin-tabpanel-0"
            />
            <Tab
              icon={<PeopleIcon />}
              iconPosition="start"
              label="Users"
              id="admin-tab-1"
              aria-controls="admin-tabpanel-1"
            />
            <Tab
              icon={<RolesIcon />}
              iconPosition="start"
              label="Roles & Permissions"
              id="admin-tab-2"
              aria-controls="admin-tabpanel-2"
            />
            <Tab
              icon={<SettingsIcon />}
              iconPosition="start"
              label="Configuration"
              id="admin-tab-3"
              aria-controls="admin-tabpanel-3"
            />
            <Tab
              icon={<HistoryIcon />}
              iconPosition="start"
              label="Audit Logs"
              id="admin-tab-4"
              aria-controls="admin-tabpanel-4"
            />
            <Tab
              icon={<SystemIcon />}
              iconPosition="start"
              label="System Health"
              id="admin-tab-5"
              aria-controls="admin-tabpanel-5"
            />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <Box sx={{ px: { xs: 2, md: 3 } }}>
          <TabPanel value={activeTab} index={0}>
            <AdminDashboard onNotify={showNotification} />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <UserManagement onNotify={showNotification} />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <RoleManagement onNotify={showNotification} />
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <SystemConfig onNotify={showNotification} />
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <AuditLogs onNotify={showNotification} />
          </TabPanel>

          <TabPanel value={activeTab} index={5}>
            <SystemStats onNotify={showNotification} />
          </TabPanel>
        </Box>
      </Paper>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPanel;
