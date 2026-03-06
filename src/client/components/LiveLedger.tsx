import { Box, Container, Typography, Paper, Button, Chip, Divider } from '@mui/material';
import { Socket } from 'socket.io-client';
import { useOrderStore } from '../store/orderStore';
import { Users, CheckCircle } from 'lucide-react';

interface LiveLedgerProps {
  userId: string;
  socket: Socket | null;
  onProceedToPayment: () => void;
}

export default function LiveLedger({ userId, socket, onProceedToPayment }: LiveLedgerProps) {
  const { order, claimItem, unclaimItem } = useOrderStore();

  if (!order) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography>Loading order...</Typography>
        </Box>
      </Container>
    );
  }

  const handleClaimItem = (itemId: string) => {
    // Optimistic update
    claimItem(itemId, userId);
    // Send to server
    socket?.emit('claim-item', { orderId: order._id, itemId, userId });
  };

  const handleUnclaimItem = (itemId: string) => {
    // Optimistic update
    unclaimItem(itemId);
    // Send to server
    socket?.emit('unclaim-item', { orderId: order._id, itemId });
  };

  const myItems = order.items.filter((item) => item.claimedBy === userId);
  const myTotal = myItems.reduce((sum, item) => sum + item.priceInPence * item.quantity, 0);

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', py: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main' }}>
            Table {order.tableId}
          </Typography>
          <Chip icon={<Users size={16} />} label="Live" color="primary" size="small" />
        </Box>

        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Bill Items
          </Typography>
          {order.items.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': { borderBottom: 'none' },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  £{(item.priceInPence / 100).toFixed(2)} × {item.quantity}
                </Typography>
              </Box>
              {item.claimedBy === userId ? (
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  startIcon={<CheckCircle size={16} />}
                  onClick={() => handleUnclaimItem(item.id)}
                >
                  Claimed
                </Button>
              ) : item.claimedBy ? (
                <Chip label="Taken" size="small" />
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleClaimItem(item.id)}
                >
                  Claim
                </Button>
              )}
            </Box>
          ))}
        </Paper>

        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
            Your Total
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            £{(myTotal / 100).toFixed(2)}
          </Typography>
        </Paper>

        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={myTotal === 0}
          onClick={onProceedToPayment}
          sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
        >
          Proceed to Payment
        </Button>
      </Box>
    </Container>
  );
}
