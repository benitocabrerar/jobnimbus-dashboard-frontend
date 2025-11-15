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
} from '@mui/material';
import {
  People as PeopleIcon,
  VpnKey as VpnKeyIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { UsersManagement } from './UsersManagement';
import { CredentialsManagement } from './CredentialsManagement';
import { AuditLogs } from './AuditLogs';

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

  // Determine active tab from URL
  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('credentials')) return 1;
    if (path.includes('audit-logs')) return 2;
    return 0; // Default to users
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());

  // Update active tab when URL changes
  React.useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);

    // Update URL based on tab
    const paths = ['/admin/users', '/admin/credentials', '/admin/audit-logs'];
    navigate(paths[newValue]);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          color="inherit"
        >
          Dashboard
        </Link>
        <Typography color="text.primary">Admin Panel</Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Admin Panel
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage users, API credentials, and view audit logs
        </Typography>
      </Box>

      {/* Main Content */}
      <Paper sx={{ width: '100%' }}>
        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="admin panel tabs"
            sx={{ px: 2 }}
          >
            <Tab
              icon={<PeopleIcon />}
              iconPosition="start"
              label="Users"
              id="admin-tab-0"
              aria-controls="admin-tabpanel-0"
            />
            <Tab
              icon={<VpnKeyIcon />}
              iconPosition="start"
              label="API Credentials"
              id="admin-tab-1"
              aria-controls="admin-tabpanel-1"
            />
            <Tab
              icon={<HistoryIcon />}
              iconPosition="start"
              label="Audit Logs"
              id="admin-tab-2"
              aria-controls="admin-tabpanel-2"
            />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <Box sx={{ px: 2 }}>
          <TabPanel value={activeTab} index={0}>
            <UsersManagement />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <CredentialsManagement />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <AuditLogs />
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminPanel;
