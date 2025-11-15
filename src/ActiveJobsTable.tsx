// src/ActiveJobsTable.tsx
import React, { useState } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Download as DownloadIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';

const mockJobs = [
  { id: 1, nombre: 'Trabajo 1', estado: 'Activo', responsable: 'Ana', fecha: '2025-08-01' },
  { id: 2, nombre: 'Trabajo 2', estado: 'En espera', responsable: 'Luis', fecha: '2025-08-05' },
  { id: 3, nombre: 'Trabajo 3', estado: 'Activo', responsable: 'Ana', fecha: '2025-08-10' },
  { id: 4, nombre: 'Trabajo 4', estado: 'Finalizado', responsable: 'Carlos', fecha: '2025-07-28' },
];

const estados = ['Todos', 'Activo', 'En espera', 'Finalizado'];
const responsables = ['Todos', 'Ana', 'Luis', 'Carlos'];

const ActiveJobsTable: React.FC = () => {
  const [estado, setEstado] = useState('Todos');
  const [responsable, setResponsable] = useState('Todos');
  const [fecha, setFecha] = useState('');

  const filtered = mockJobs.filter(job =>
    (estado === 'Todos' || job.estado === estado) &&
    (responsable === 'Todos' || job.responsable === responsable) &&
    (fecha === '' || job.fecha === fecha)
  );

  const handleExportCSV = () => {
    import('papaparse').then(Papa => {
      const csv = Papa.unparse(filtered);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'trabajos_activos.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleExportPDF = () => {
    import('jspdf').then(jsPDFModule => {
      const jsPDF = jsPDFModule.default;
      const doc = new jsPDF();
      doc.text('Trabajos Activos', 10, 10);
      let y = 20;
      doc.text('Nombre', 10, y);
      doc.text('Estado', 60, y);
      doc.text('Responsable', 110, y);
      doc.text('Fecha', 160, y);
      y += 10;
      filtered.forEach(job => {
        doc.text(job.nombre, 10, y);
        doc.text(job.estado, 60, y);
        doc.text(job.responsable, 110, y);
        doc.text(job.fecha, 160, y);
        y += 10;
      });
      doc.save('trabajos_activos.pdf');
    });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Trabajos Activos</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <TextField
            select
            label="Estado"
            value={estado}
            onChange={e => setEstado(e.target.value)}
            fullWidth
          >
            {estados.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            select
            label="Responsable"
            value={responsable}
            onChange={e => setResponsable(e.target.value)}
            fullWidth
          >
            {responsables.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Fecha"
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportCSV}>
            CSV
          </Button>
          <Button variant="outlined" startIcon={<PdfIcon />} onClick={handleExportPDF}>
            PDF
          </Button>
        </Grid>
      </Grid>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Responsable</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(job => (
              <TableRow key={job.id}>
                <TableCell>{job.nombre}</TableCell>
                <TableCell>{job.estado}</TableCell>
                <TableCell>{job.responsable}</TableCell>
                <TableCell>{job.fecha}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ActiveJobsTable;