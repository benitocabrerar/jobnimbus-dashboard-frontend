// src/ProductivityChart.tsx
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Paper, Typography } from '@mui/material';

const data = [
  { name: 'Ene', productividad: 80 },
  { name: 'Feb', productividad: 82 },
  { name: 'Mar', productividad: 88 },
  { name: 'Abr', productividad: 90 },
  { name: 'May', productividad: 92 },
  { name: 'Jun', productividad: 91 },
];

const ProductivityChart: React.FC = () => (
  <Paper sx={{ p: 2, height: 340 }}>
    <Typography variant="h6" gutterBottom>
      Gráfica de Productividad
    </Typography>
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[70, 100]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="productividad" stroke="#1976d2" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  </Paper>
);

export default ProductivityChart;