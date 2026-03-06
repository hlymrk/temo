import { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper, Alert } from '@mui/material';
import { QrCode } from 'lucide-react';

interface TableJoinProps {
  onJoin: (tableId: string) => void;
}

export default function TableJoin({ onJoin }: TableJoinProps) {
  const [tableId, setTableId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tableId.trim()) {
      setLoading(true);
      setError(null);
      
      // Give feedback after a short delay if no order found
      const timeoutId = setTimeout(() => {
        setError('No active order found for this table. Please check the table ID or ask your server.');
        setLoading(false);
      }, 3000);

      // Store timeout ID to clear it if order is found
      (window as any).__tableJoinTimeout = timeoutId;
      
      onJoin(tableId.trim());
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <QrCode size={64} color="hsl(14, 85%, 55%)" style={{ margin: '0 auto' }} />
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 700, color: 'secondary.main' }}>
              tempo
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Split your bill in real-time
            </Typography>
          </Box>

          {error && (
            <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Table ID"
              placeholder="Enter your table number"
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              sx={{ mb: 3 }}
              autoFocus
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!tableId.trim() || loading}
            >
              {loading ? 'Joining...' : 'Join Table'}
            </Button>
          </form>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
            For testing: Create an order first using the seed endpoint
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
