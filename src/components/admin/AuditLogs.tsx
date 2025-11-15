import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  FormControl,
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
  Typography,
  Alert,
  CircularProgress,
  TablePagination,
  SelectChangeEvent,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { adminApiService } from '../../services/adminApiService';

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string | null;
  details: any;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [userIdFilter, setUserIdFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    fetchLogs();
  }, [page, rowsPerPage]);

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = {
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      };

      if (actionFilter !== 'all') params.action = actionFilter;
      if (entityTypeFilter !== 'all') params.entityType = entityTypeFilter;
      if (userIdFilter) params.userId = userIdFilter;
      if (startDate) params.startDate = new Date(startDate).toISOString();
      if (endDate) params.endDate = new Date(endDate).toISOString();

      const data = await adminApiService.getAuditLogs(params);
      setLogs(data.logs || []);
      setTotalCount(data.total || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchLogs();
  };

  const handleClearFilters = () => {
    setActionFilter('all');
    setEntityTypeFilter('all');
    setUserIdFilter('');
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getActionColor = (action: string) => {
    if (action.includes('delete')) return 'error';
    if (action.includes('create') || action.includes('approve')) return 'success';
    if (action.includes('update') || action.includes('edit')) return 'primary';
    if (action.includes('suspend') || action.includes('revoke')) return 'warning';
    return 'default';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDetails = (details: any) => {
    if (!details) return '-';
    if (typeof details === 'string') return details;
    return JSON.stringify(details, null, 2);
  };

  return (
    <Box>
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Action</InputLabel>
            <Select
              value={actionFilter}
              label="Action"
              onChange={(e: SelectChangeEvent) => setActionFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="login">Login</MenuItem>
              <MenuItem value="logout">Logout</MenuItem>
              <MenuItem value="create">Create</MenuItem>
              <MenuItem value="update">Update</MenuItem>
              <MenuItem value="delete">Delete</MenuItem>
              <MenuItem value="approve">Approve</MenuItem>
              <MenuItem value="suspend">Suspend</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Entity Type</InputLabel>
            <Select
              value={entityTypeFilter}
              label="Entity Type"
              onChange={(e: SelectChangeEvent) => setEntityTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="credential">Credential</MenuItem>
              <MenuItem value="job">Job</MenuItem>
              <MenuItem value="contact">Contact</MenuItem>
              <MenuItem value="task">Task</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="User ID"
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
            sx={{ minWidth: 200 }}
          />

          <TextField
            size="small"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />

          <TextField
            size="small"
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          >
            Search
          </Button>

          <Button variant="outlined" onClick={handleClearFilters}>
            Clear Filters
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchLogs}
          >
            Refresh
          </Button>
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Audit Logs Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Entity Type</TableCell>
                  <TableCell>Entity ID</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary" sx={{ py: 2 }}>
                        No audit logs found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>{formatDate(log.createdAt)}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{log.userName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {log.userId}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.action}
                          size="small"
                          color={getActionColor(log.action) as any}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label={log.entityType} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {log.entityId || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {log.ipAddress}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                          }}
                        >
                          {formatDetails(log.details)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
};

export default AuditLogs;
