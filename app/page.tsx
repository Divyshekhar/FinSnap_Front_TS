"use client"
import React, { useEffect, useState } from 'react';
import { ArrowRight, PiggyBank, TrendingUp, Shield } from 'lucide-react';
import {
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  useTheme
} from '@mui/material';
import { useRouter } from 'next/navigation';


function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  useEffect(() => {
    const getToken = async () => {
      const token = localStorage.getItem("authToken");
      if (token) setIsAuthenticated(true);
    }
    getToken();

  }, [])
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
      py: 8
    }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 12 }}>
          <Typography variant="h1" sx={{
            fontSize: { xs: '3rem', sm: '4rem' },
            fontWeight: 800,
            mb: 2,
            color: 'white'
          }}>
            <Box component="span" sx={{ color: theme.palette.primary.main }}>Fin</Box>
            Snap
          </Typography>
          <Typography variant="h5" sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '800px',
            mx: 'auto',
            mb: 4
          }}>
            Track your expenses, achieve your financial goals, and take control of your money with our intuitive expense tracking solution.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            {!isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    background: theme.palette.primary.main,
                    '&:hover': {
                      background: theme.palette.primary.dark
                    }
                  }}
                  onClick={() => {router.push('/signin')}}
                >
                  Sign In
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white'
                    }
                  }}
                  onClick={() => {router.push('/signup')}}
                  
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowRight />}
                sx={{
                  px: 4,
                  background: theme.palette.primary.main,
                  '&:hover': {
                    background: theme.palette.primary.dark
                  }
                }}
                onClick={() => {router.push('/dashboard')}}
              >
                Go to Dashboard
              </Button>
            )}
          </Box>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 12 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{
              p: 4,
              height: '100%',
              transition: 'all 0.3s',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                transform: 'translateY(-4px)',
                background: 'rgba(255, 255, 255, 0.08)'
              }
            }}>
              <Box sx={{
                width: 48,
                height: 48,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}>
                <PiggyBank size={24} color={theme.palette.primary.main} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>
                Smart Budgeting
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Set and track budgets with intelligent categorization and real-time updates.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{
              p: 4,
              height: '100%',
              transition: 'all 0.3s',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                transform: 'translateY(-4px)',
                background: 'rgba(255, 255, 255, 0.08)'
              }
            }}>
              <Box sx={{
                width: 48,
                height: 48,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}>
                <TrendingUp size={24} color={theme.palette.primary.main} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>
                Expense Analytics
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Visualize your spending patterns with detailed charts and insights.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{
              p: 4,
              height: '100%',
              transition: 'all 0.3s',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                transform: 'translateY(-4px)',
                background: 'rgba(255, 255, 255, 0.08)'
              }
            }}>
              <Box sx={{
                width: 48,
                height: 48,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}>
                <Shield size={24} color={theme.palette.primary.main} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>
                Secure & Private
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Your financial data is encrypted and protected with bank-level security.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Stats Section */}
        <Paper elevation={1} sx={{
          p: 6,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)'
        }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                1K+
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Active Users
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                10K+
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Expenses Tracked
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                98%
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                User Satisfaction
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default LandingPage;