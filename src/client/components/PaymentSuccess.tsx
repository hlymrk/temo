import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccess() {
  const handleBackToHome = () => {
    window.location.href = '/';
  };

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
            Your payment has been processed successfully. Thank you for using Tempo!
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
