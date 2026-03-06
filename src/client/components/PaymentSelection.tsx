import { useState } from 'react';
import { Box, Container, Typography, Paper, Button, Chip, CircularProgress, Alert } from '@mui/material';
import { useOrderStore } from '../store/orderStore';
import { Landmark, CreditCard, CheckCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

interface PaymentSelectionProps {
  userId: string;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export default function PaymentSelection({ userId }: PaymentSelectionProps) {
  const { order } = useOrderStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!order) return null;

  const myItems = order.items.filter((item) => item.claimedBy === userId);
  const myTotal = myItems.reduce((sum, item) => sum + item.priceInPence * item.quantity, 0);
  const recommendBankTransfer = myTotal > 2000; // £20

  const handleBankTransfer = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/truelayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.tableId,
          userId,
          itemIds: myItems.map(item => item.id),
        }),
      });

      if (!response.ok) throw new Error('Payment creation failed');

      const data = await response.json();
      
      // Redirect to TrueLayer authorization
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      }
    } catch (err) {
      setError('Failed to initiate bank transfer. Please try again.');
      console.error('TrueLayer payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.tableId,
          userId,
          itemIds: myItems.map(item => item.id),
        }),
      });

      if (!response.ok) throw new Error('Payment creation failed');

      const { clientSecret } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) throw new Error('Stripe not loaded');

      // Redirect to Stripe Checkout or use Elements
      const { error: stripeError } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Failed to process card payment. Please try again.');
      console.error('Stripe payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <CheckCircle size={64} color="hsl(156, 45%, 40%)" style={{ margin: '0 auto' }} />
            <Typography variant="h5" sx={{ mt: 2, fontWeight: 700, color: 'success.main' }}>
              Payment Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Thank you for your payment of £{(myTotal / 100).toFixed(2)}
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', py: 3 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 700, color: 'secondary.main' }}>
          Choose Payment Method
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Total: £{(myTotal / 100).toFixed(2)}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 2,
            borderRadius: 2,
            border: recommendBankTransfer ? '2px solid' : '1px solid',
            borderColor: recommendBankTransfer ? 'success.main' : 'divider',
            position: 'relative',
          }}
        >
          {recommendBankTransfer && (
            <Chip
              label="Recommended"
              color="success"
              size="small"
              sx={{ position: 'absolute', top: 12, right: 12 }}
            />
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Landmark size={32} color="hsl(156, 45%, 40%)" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Instant Bank Transfer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Powered by TrueLayer • Lower fees
              </Typography>
            </Box>
          </Box>
          <Button
            fullWidth
            variant="contained"
            color="success"
            size="large"
            onClick={handleBankTransfer}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Processing...' : 'Pay with Bank Account'}
          </Button>
        </Paper>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CreditCard size={32} color="hsl(14, 85%, 55%)" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Card Payment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Apple Pay, Google Pay, or Card
              </Typography>
            </Box>
          </Box>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleCardPayment}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Processing...' : 'Pay with Card'}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
