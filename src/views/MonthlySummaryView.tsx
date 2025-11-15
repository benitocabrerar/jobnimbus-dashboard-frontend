import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Refresh,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Receipt,
  AccountBalance,
  BusinessCenter,
  Download
} from '@mui/icons-material';
import axios from 'axios';

interface TabPanelProps {
  children?: React.Node;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`instance-tabpanel-${index}`}
      aria-labelledby={`instance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface MonthlySummaryData {
  total_invoiced: number;
  total_payments: number;
  net_invoiced: number;
  accounts_receivable: number;
  invoice_count: number;
  payment_count: number;
  credit_memos: number;
  status_breakdown?: any;
}

const MonthlySummaryView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [guilfordData, setGuilfordData] = useState<MonthlySummaryData | null>(null);
  const [stamfordData, setStamfordData] = useState<MonthlySummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('2025-10');

  const fetchMonthlySummary = async (instance: 'guilford' | 'stamford') => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'https://jobnimbus-dashboard-api.onrender.com'}/api/mcp/monthly-summary`,
        {
          instance,
          month: selectedMonth
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (instance === 'guilford') {
        setGuilfordData(response.data);
      } else {
        setStamfordData(response.data);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch monthly summary';
      setError(errorMessage);
      console.error(`Error fetching ${instance} data:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch both instances on mount
    Promise.all([
      fetchMonthlySummary('guilford'),
      fetchMonthlySummary('stamford')
    ]);
  }, [selectedMonth]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleRefresh = () => {
    const instance = selectedTab === 0 ? 'guilford' : 'stamford';
    fetchMonthlySummary(instance);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const renderFinancialCard = (title: string, value: number, icon: React.ReactElement, color: string, change?: number) => (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`, border: `1px solid ${color}30` }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box sx={{ bgcolor: color, color: 'white', p: 1.5, borderRadius: 1 }}>
            {icon}
          </Box>
          {change !== undefined && (
            <Box display="flex" alignItems="center">
              {change > 0 ? (
                <TrendingUp sx={{ color: '#2e7d32', fontSize: 20, mr: 0.5 }} />
              ) : change < 0 ? (
                <TrendingDown sx={{ color: '#d32f2f', fontSize: 20, mr: 0.5 }} />
              ) : null}
              <Typography
                variant="caption"
                sx={{
                  color: change > 0 ? '#2e7d32' : change < 0 ? '#d32f2f' : 'text.secondary',
                  fontWeight: 'bold'
                }}
              >
                {change > 0 ? '+' : ''}{change}%
              </Typography>
            </Box>
          )}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {formatCurrency(value)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  const renderSummaryTable = (data: MonthlySummaryData | null) => {
    if (!data) return null;

    const rows = [
      { label: 'Total Invoiced', value: data.total_invoiced, icon: <Receipt /> },
      { label: 'Total Payments', value: data.total_payments, icon: <AttachMoney /> },
      { label: 'NET Invoiced', value: data.net_invoiced, icon: <BusinessCenter />, highlighted: true },
      { label: 'Accounts Receivable', value: data.accounts_receivable, icon: <AccountBalance /> },
    ];

    return (
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Metric</strong></TableCell>
              <TableCell align="right"><strong>Value</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.label}
                sx={{
                  backgroundColor: row.highlighted ? 'action.selected' : 'inherit',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {row.icon}
                    <Typography variant="body1">{row.label}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1" fontWeight={row.highlighted ? 'bold' : 'normal'}>
                    {formatCurrency(row.value)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <Typography variant="body1">Invoice Count</Typography>
              </TableCell>
              <TableCell align="right">
                <Chip label={data.invoice_count} color="primary" size="small" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Payment Count</Typography>
              </TableCell>
              <TableCell align="right">
                <Chip label={data.payment_count} color="success" size="small" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Credit Memos</Typography>
              </TableCell>
              <TableCell align="right">
                <Chip label={data.credit_memos} color="warning" size="small" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderInstanceData = (data: MonthlySummaryData | null) => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      );
    }

    if (!data) {
      return (
        <Alert severity="info">
          No data available for this instance
        </Alert>
      );
    }

    return (
      <Box>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            {renderFinancialCard('Total Invoiced', data.total_invoiced, <Receipt />, '#1976d2')}
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            {renderFinancialCard('Total Payments', data.total_payments, <AttachMoney />, '#2e7d32')}
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            {renderFinancialCard('NET Invoiced', data.net_invoiced, <BusinessCenter />, '#9c27b0')}
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            {renderFinancialCard('Accounts Receivable', data.accounts_receivable, <AccountBalance />, '#ed6c02')}
          </Grid>
        </Grid>

        {renderSummaryTable(data)}

        {data.status_breakdown && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status Breakdown
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {JSON.stringify(data.status_breakdown, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Monthly Financial Summary
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Month: {selectedMonth}
          </Typography>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none'
            }
          }}
        >
          <Tab label="Guilford Instance" />
          <Tab label="Stamford Instance" />
        </Tabs>

        <TabPanel value={selectedTab} index={0}>
          {renderInstanceData(guilfordData)}
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          {renderInstanceData(stamfordData)}
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default MonthlySummaryView;
