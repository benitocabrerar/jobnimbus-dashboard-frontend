// src/ChatUI.tsx
import React, { useState, useRef } from 'react';
import { Box, Paper, Typography, TextField, IconButton, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { sender: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      let botText = '';
      if (typeof data.response === 'string') {
        botText = data.response;
      } else if (typeof data.response === 'object' && data.response !== null) {
        botText = JSON.stringify(data.response, null, 2);
      } else {
        botText = 'Sin respuesta';
      }
      setMessages(msgs => [...msgs, { sender: 'bot', text: botText }]);
    } catch {
      setMessages(msgs => [...msgs, { sender: 'bot', text: 'Error de conexión con el backend MCP.' }]);
    }
    setLoading(false);
    setTimeout(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>Chat Asistente (MCP)</Typography>
      <List ref={listRef} sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
        {messages.map((msg, i) => (
          <ListItem key={i} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <ListItemText
              primary={msg.text}
              sx={{
                bgcolor: msg.sender === 'user' ? 'primary.light' : 'grey.200',
                color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                borderRadius: 2,
                px: 2,
                py: 1,
                maxWidth: '70%',
                textAlign: msg.sender === 'user' ? 'right' : 'left',
              }}
            />
          </ListItem>
        ))}
        {loading && (
          <ListItem sx={{ justifyContent: 'flex-start' }}>
            <CircularProgress size={24} />
          </ListItem>
        )}
      </List>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje..."
          fullWidth
          multiline
          maxRows={3}
          size="small"
        />
        <IconButton color="primary" onClick={sendMessage} disabled={loading || !input.trim()}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatUI;