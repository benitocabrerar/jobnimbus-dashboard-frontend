// DataTable genérico actualizado para mostrar datos en tabla con Material-UI
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Chip
} from '@mui/material';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  loading?: boolean;
  error?: string | null;
  title?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  total?: number;
  loadingMore?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ data, columns, loading, error, title, hasMore, onLoadMore, total, loadingMore }) => {
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (columnKey: string) => {
    const isAsc = orderBy === columnKey && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnKey);
  };

  const sortedData = React.useMemo(() => {
    if (!orderBy) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      
      if (aVal < bVal) {
        return order === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, orderBy, order]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error: {error}
      </Alert>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Alert severity="info">
        No hay datos disponibles
      </Alert>
    );
  }

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      {title && (
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {title}
          </Typography>
          <Box display="flex" gap={1} alignItems="center">
            <Chip 
              label={`${data.length} mostrados`} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
            {total !== undefined && (
              <Chip 
                label={`${total} total`} 
                size="small" 
                color="secondary" 
                variant="outlined" 
              />
            )}
          </Box>
        </Box>
      )}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.key}
                      direction={orderBy === column.key ? order : 'asc'}
                      onClick={() => handleSort(column.key)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row, index) => (
              <TableRow key={index} hover>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {hasMore && onLoadMore && (
        <Box p={2} display="flex" justifyContent="center">
          <Button 
            variant="outlined" 
            onClick={onLoadMore}
            disabled={loadingMore}
            startIcon={loadingMore ? <CircularProgress size={20} /> : undefined}
            sx={{
              minWidth: 200,
              height: 40
            }}
          >
            {loadingMore ? 'Cargando más...' : 'Cargar más registros'}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default DataTable;
export { DataTable };