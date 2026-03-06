import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { TrendingUp, Users, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface Analytics {
  activeTables: number;
  completedToday: number;
  totalRevenueToday: number;
  averageSessionTimeMinutes: number;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics', {
        headers: {
          'x-user-role': 'ADMIN',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography>Loading analytics...</Typography>
        </Box>
      </Container>
    );
  }

  const stats = [
    {
      title: 'Active Tables',
      value: analytics?.activeTables || 0,
      icon: Users,
      color: 'primary.main',
    },
    {
      title: 'Completed Today',
      value: analytics?.completedToday || 0,
      icon: TrendingUp,
      color: 'success.main',
    },
    {
      title: 'Revenue Today',
      value: `£${((analytics?.totalRevenueToday || 0) / 100).toFixed(2)}`,
      icon: DollarSign,
      color: 'secondary.main',
    },
    {
      title: 'Avg Session Time',
      value: `${analytics?.averageSessionTimeMinutes || 0}min`,
      icon: Clock,
      color: 'warning.main',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: 'secondary.main' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Real-time restaurant analytics
        </Typography>

        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: `${stat.color}15`,
                          display: 'flex',
                        }}
                      >
                        <stat.icon size={24} color={stat.color} />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Paper elevation={0} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Live Net Margin
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Sales: £{((analytics?.totalRevenueToday || 0) / 100).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Payment Fees: ~£{(((analytics?.totalRevenueToday || 0) * 0.02) / 100).toFixed(2)} (2%)
          </Typography>
          <Typography variant="h5" sx={{ mt: 2, fontWeight: 700, color: 'success.main' }}>
            Net: £{(((analytics?.totalRevenueToday || 0) * 0.98) / 100).toFixed(2)}
          </Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Table Turnover Velocity
          </Typography>
          <Typography variant="body1">
            Average time per table: {analytics?.averageSessionTimeMinutes || 0} minutes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {analytics?.averageSessionTimeMinutes && analytics.averageSessionTimeMinutes < 45
              ? '✓ Excellent turnover rate'
              : analytics?.averageSessionTimeMinutes && analytics.averageSessionTimeMinutes < 60
              ? '⚠ Moderate turnover rate'
              : '✗ Slow turnover - consider optimizing service'}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
