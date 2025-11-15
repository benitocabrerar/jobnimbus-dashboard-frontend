// Vista profesional para consultar y mostrar contactos reales de JobNimbus
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Toolbar,
  Button,
} from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const API_URL = "/contacts"; // Usar backend local como proxy para evitar CORS
 
const HEADERS = {
  "Content-Type": "application/json",
};

interface Contact {
  recid: number;
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  home_phone?: string;
  mobile_phone?: string;
  work_phone?: string;
  city?: string;
  state_text?: string;
  date_created?: number;
}

export default function JobNimbusContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}?size=100`, {
      headers: HEADERS,
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Error al consultar JobNimbus");
        }
        return res.json();
      })
      .then((data) => {
        // Soporta respuesta directa (lista) o {results: [...]}
        if (Array.isArray(data)) {
          setContacts(data);
        } else if (data && Array.isArray(data.results)) {
          setContacts(data.results);
        } else {
          setContacts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        // Mensaje claro si es CORS o red
        if (err instanceof TypeError && err.message === "Failed to fetch") {
          setError("No se pudo conectar con la API externa. Es posible que el navegador esté bloqueando la petición por CORS. Intente desde el backend o revise la configuración CORS de JobNimbus.");
        } else {
          setError(err.message);
        }
        setLoading(false);
      });
  }, []);

  const handleExportCSV = () => {
    setExporting(true);
    const csvRows = [
      [
        "ID",
        "Nombre",
        "Apellido",
        "Empresa",
        "Email",
        "Teléfono",
        "Ciudad",
        "Estado",
        "Fecha Creación",
      ].join(","),
      ...contacts.map((c) =>
        [
          c.recid,
          c.first_name,
          c.last_name,
          c.company,
          c.email,
          c.home_phone || c.mobile_phone || c.work_phone,
          c.city,
          c.state_text,
          new Date((c.date_created || 0) * 1000).toLocaleDateString(),
        ].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jobnimbus_contacts.csv";
    a.click();
    setExporting(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, background: "linear-gradient(90deg,#f8fafc,#e0e7ef)" }}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Contactos Reales JobNimbus
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Consulta y exporta todos los contactos reales de tu cuenta JobNimbus. Diseño profesional y datos en tiempo real.
        </Typography>
        <Toolbar sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CloudDownloadIcon />}
            onClick={handleExportCSV}
            disabled={exporting || loading || contacts.length === 0}
          >
            Exportar CSV
          </Button>
        </Toolbar>
      </Paper>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress size={60} />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {!loading && !error && (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Ciudad</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha Creación</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((c: any) => (
                <TableRow key={c.recid}>
                  <TableCell>{c.recid}</TableCell>
                  <TableCell>{c.first_name}</TableCell>
                  <TableCell>{c.last_name}</TableCell>
                  <TableCell>{c.company}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>
                    {c.home_phone || c.mobile_phone || c.work_phone}
                  </TableCell>
                  <TableCell>{c.city}</TableCell>
                  <TableCell>{c.state_text}</TableCell>
                  <TableCell>
                    {new Date((c.date_created || 0) * 1000).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}