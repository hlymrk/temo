import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { TrendingUp, Users, Clock, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Analytics {
  activeTables: number;
  completedToday: number;
  averageSessionTimeMinutes: number;
  totalRevenueToday: number;
  totalFailedAmount: number;
  totalPendingAmount: number;
  totalPayments: number;
  paymentsByStatus: {
    succeeded: number;
    failed: number;
    pending: number;
    expired: number;
  };
  paymentsByProvider: {
    stripe: number;
    truelayer: number;
  };
  successRate: number;
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
    {
      title: 'Payment Success Rate',
      value: `${analytics?.successRate || 0}%`,
      icon: CheckCircle,
      color: analytics?.successRate && analytics.successRate >= 95 ? 'success.main' : 'warning.main',
    },
    {
      title: 'Total Payments',
      value: analytics?.totalPayments || 0,
      icon: DollarSign,
      color: 'info.main',
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

        {/* Payment Status Breakdown */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Payment Status Breakdown
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Succeeded</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {analytics?.paymentsByStatus.succeeded || 0}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={analytics?.totalPayments ? (analytics.paymentsByStatus.succeeded / analytics.totalPayments) * 100 : 0}
                    sx={{ height: 8, borderRadius: 1, bgcolor: 'success.light' }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Pending</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main' }}>
                      {analytics?.paymentsByStatus.pending || 0}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={analytics?.totalPayments ? (analytics.paymentsByStatus.pending / analytics.totalPayments) * 100 : 0}
                    sx={{ height: 8, borderRadius: 1, bgcolor: 'warning.light' }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Failed</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                      {analytics?.paymentsByStatus.failed || 0}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={analytics?.totalPayments ? (analytics.paymentsByStatus.failed / analytics.totalPayments) * 100 : 0}
                    sx={{ height: 8, borderRadius: 1, bgcolor: 'error.light' }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Expired</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'info.main' }}>
                      {analytics?.paymentsByStatus.expired || 0}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={analytics?.totalPayments ? (analytics.paymentsByStatus.expired / analytics.totalPayments) * 100 : 0}
                    sx={{ height: 8, borderRadius: 1, bgcolor: 'info.light' }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Payment Provider Breakdown */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Payment Methods
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Stripe (Card)</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {analytics?.paymentsByProvider.stripe || 0}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={analytics?.totalPayments ? (analytics.paymentsByProvider.stripe / analytics.totalPayments) * 100 : 0}
                    sx={{ height: 8, borderRadius: 1, bgcolor: '#635BFF' }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">TrueLayer (Bank)</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {analytics?.paymentsByProvider.truelayer || 0}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={analytics?.totalPayments ? (analytics.paymentsByProvider.truelayer / analytics.totalPayments) * 100 : 0}
                    sx={{ height: 8, borderRadius: 1, bgcolor: '#00A3E0' }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Paper elevation={0} sx={{ p: 3, mt: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Financial Summary
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Gross Revenue
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                £{((analytics?.totalRevenueToday || 0) / 100).toFixed(2)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Payment Fees (2%)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                £{(((analytics?.totalRevenueToday || 0) * 0.02) / 100).toFixed(2)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Failed Payments
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
                £{((analytics?.totalFailedAmount || 0) / 100).toFixed(2)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Pending Payments
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
                £{((analytics?.totalPendingAmount || 0) / 100).toFixed(2)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Net Revenue (after 2% fees)
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
              £{(((analytics?.totalRevenueToday || 0) * 0.98) / 100).toFixed(2)}
            </Typography>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ p: 3, mt: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Operational Metrics
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Table Turnover Velocity
              </Typography>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
                {analytics?.averageSessionTimeMinutes || 0} min/table
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {analytics?.averageSessionTimeMinutes && analytics.averageSessionTimeMinutes < 45
                  ? '✓ Excellent turnover rate'
                  : analytics?.averageSessionTimeMinutes && analytics.averageSessionTimeMinutes < 60
                  ? '⚠ Moderate turnover rate'
                  : '✗ Slow turnover - optimize service'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Active Tables
              </Typography>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
                {analytics?.activeTables || 0} tables
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Currently occupied
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Alerts Section */}
        {(analytics?.paymentsByStatus.failed || 0 > 0 || analytics?.paymentsByStatus.pending || 0 > 0) && (
          <Paper elevation={0} sx={{ p: 3, mt: 3, borderRadius: 2, border: '1px solid', borderColor: 'warning.main', bgcolor: 'warning.light' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <AlertCircle size={24} color="warning.main" style={{ marginTop: '2px' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Payment Alerts
                </Typography>
                {(analytics?.paymentsByStatus.failed || 0) > 0 && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    ⚠ {analytics?.paymentsByStatus.failed} failed payments totaling £{((analytics?.totalFailedAmount || 0) / 100).toFixed(2)}
                  </Typography>
                )}
                {(analytics?.paymentsByStatus.pending || 0) > 0 && (
                  <Typography variant="body2">
                    ⏳ {analytics?.paymentsByStatus.pending} payments pending totaling £{((analytics?.totalPendingAmount || 0) / 100).toFixed(2)}
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
}
