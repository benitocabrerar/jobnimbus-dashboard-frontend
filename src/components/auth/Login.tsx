import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff, Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { authApiService } from '../../services/authApiService';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      // Redirect to dashboard on successful login
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth URL
    window.location.href = authApiService.getGoogleLoginUrl();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 3,
      }}
    >
      <Card sx={{ maxWidth: 450, width: '100%', boxShadow: 6 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Logo and Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              JobNimbus Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to access your executive dashboard
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mb: 2, py: 1.5 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Google OAuth Button */}
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            disabled={isLoading}
            sx={{ mb: 3, py: 1.5 }}
          >
            Continue with Google
          </Button>

          {/* Links */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                component={RouterLink}
                to="/register"
                underline="hover"
                fontWeight="bold"
              >
                Sign up
              </Link>
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                underline="hover"
              >
                Forgot password?
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
