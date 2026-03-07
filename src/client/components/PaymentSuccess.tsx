import { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Button, CircularProgress, Alert } from '@mui/material';
import { CheckCircle, XCircle } from 'lucide-react';

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');

      if (!sessionId) {
        setError('No session ID found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/payments/verify/${sessionId}`);
        if (!response.ok) throw new Error('Verification failed');
        
        const data = await response.json();
        if (data.status === 'succeeded') {
          setVerified(true);
        } else {
          setError('Payment not completed');
        }
      } catch (err) {
        setError('Failed to verify payment');
        console.error('Payment verification error:', err);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Verifying payment...
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <XCircle
              size={80}
              color="hsl(0, 75%, 50%)"
              style={{ margin: '0 auto', display: 'block' }}
            />
            <Typography variant="h4" sx={{ mt: 3, fontWeight: 700, color: 'error.main' }}>
              Payment Verification Failed
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
              {error}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleBackToHome}
              sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
            >
              Back to Home
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <CheckCircle
            size={80}
            color="hsl(156, 45%, 40%)"
            style={{ margin: '0 auto', display: 'block' }}
          />
          <Typography variant="h4" sx={{ mt: 3, fontWeight: 700, color: 'success.main' }}>
            Payment Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
            Your payment has been processed successfully. Thank you for using temo!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleBackToHome}
            sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
          >
            Back to Home
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
