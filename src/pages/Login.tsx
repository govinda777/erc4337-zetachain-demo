import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Paper, Container } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import GoogleIcon from '@mui/icons-material/Google';
import { useAccount } from '../contexts/AccountContext';

const Login: React.FC = () => {
  const { login, isLoading, error } = useAccount();
  const navigate = useNavigate();

  const handleLogin = async (provider: string) => {
    try {
      await login(provider);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography component="h1" variant="h5">
            ERC-4337 Smart Account Demo
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            Login with your preferred provider
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<GoogleIcon />}
              onClick={() => handleLogin('google')}
              disabled={isLoading}
            >
              Login with Google
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<TwitterIcon />}
              onClick={() => handleLogin('twitter')}
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              Login with Twitter
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<GitHubIcon />}
              onClick={() => handleLogin('github')}
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              Login with GitHub
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<EmailIcon />}
              onClick={() => handleLogin('email')}
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              Login with Email
            </Button>
          </Box>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
