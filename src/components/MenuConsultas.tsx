import React from "react";
import { Drawer, List, ListItemIcon, ListItemText, Toolbar, ListItemButton } from "@mui/material";
import ContactsIcon from "@mui/icons-material/Contacts";
import PaymentIcon from "@mui/icons-material/Payment";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CategoryIcon from "@mui/icons-material/Category";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

type MenuConsultasProps = {
  onSelect: (view: string) => void;
  selected: string;
};

const menuItems = [
  { text: "Contactos", icon: <ContactsIcon />, view: "contacts" },
  { text: "Pagos", icon: <PaymentIcon />, view: "payments" },
  { text: "Tareas", icon: <AssignmentIcon />, view: "tasks" },
  { text: "Tipos de Tarea", icon: <CategoryIcon />, view: "tasktypes" },
  { text: "Tipos de Actividad", icon: <CategoryIcon />, view: "activitytypes" },
  { text: "Ubicaciones", icon: <LocationOnIcon />, view: "locations" },
  { text: "Dashboards", icon: <DashboardIcon />, view: "dashboards" },
  { text: "Exportaciones", icon: <CloudDownloadIcon />, view: "exports" },
  { text: "Chat MCP", icon: <ChatIcon />, view: "chat" },
];

const MenuConsultas: React.FC<MenuConsultasProps> = ({ onSelect, selected }) => {
  return (
    <Drawer variant="permanent" anchor="left" sx={{ width: 240, flexShrink: 0,
      "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box", background: "linear-gradient(180deg,#1e293b,#64748b)" } }}>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            selected={selected === item.view}
            onClick={() => onSelect(item.view)}
            sx={{
              color: selected === item.view ? "#fff" : "#cbd5e1",
              background: selected === item.view ? "rgba(59,130,246,0.7)" : "none",
              borderRadius: 2,
              mb: 1,
              "&:hover": { background: "rgba(59,130,246,0.3)" },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default MenuConsultas;