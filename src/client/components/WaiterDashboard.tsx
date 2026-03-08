import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Collapse,
} from '@mui/material';
import { Plus, QrCode as QrCodeIcon, Eye, Download, LucideExpand, LucideShrink, PlusIcon } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';

interface Order {
  _id: string;
  tableId: string;
  items: Array<{
    id: string;
    name: string;
    priceInPence: number;
    quantity: number;
    claimedBy?: string;
    status: 'ordered' | 'preparing' | 'ready' | 'served';
  }>;
  totalInPence: number;
  status: string;
  createdAt: string;
}

export default function WaiterDashboard() {
  const [tableId, setTableId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [qrCodeData, setQrCodeData] = useState<{
    dataUrl: string;
    tableUrl: string;
    tableId: string;
  } | null>(null);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [addItemDialog, setAddItemDialog] = useState<{ open: boolean; orderId: string | null }>({ open: false, orderId: null });
  const [newItem, setNewItem] = useState({ name: '', priceInPence: 0, quantity: 1 });
  const { socket } = useSocket('STAFF');

  // Fetch active orders on component mount
  useEffect(() => {
    const fetchActiveOrders = async () => {
      try {
        const response = await fetch('/api/orders/active');
        if (response.ok) {
          const orders = await response.json();
          setActiveOrders(orders);
        }
      } catch (error) {
        console.error('Error fetching active orders:', error);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchActiveOrders();
  }, []);

  // Listen for real-time order updates
  useEffect(() => {
    if (!socket) return;

    const handleOrderUpdate = () => {
      // Refresh active orders when any order is updated
      fetch('/api/orders/active')
        .then(response => response.ok ? response.json() : [])
        .then(orders => setActiveOrders(orders))
        .catch(error => console.error('Error refreshing orders:', error));
    };

    const handleOrderCreated = () => {
      // Refresh active orders when a new order is created
      fetch('/api/orders/active')
        .then(response => response.ok ? response.json() : [])
        .then(orders => setActiveOrders(orders))
        .catch(error => console.error('Error refreshing orders:', error));
    };

    socket.on('order-updated', handleOrderUpdate);
    socket.on('order-created', handleOrderCreated);

    return () => {
      socket.off('order-updated', handleOrderUpdate);
      socket.off('order-created', handleOrderCreated);
    };
  }, [socket]);

  const handleCreateOrder = async () => {
    if (!tableId.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/orders/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId: tableId.trim() }),
      });

      if (response.ok) {
        setMessage(`✓ Order created for table ${tableId}`);
        setTableId('');
        
        // Refresh active orders
        const ordersResponse = await fetch('/api/orders/active');
        if (ordersResponse.ok) {
          const orders = await ordersResponse.json();
          setActiveOrders(orders);
        }
      } else {
        setMessage('✗ Failed to create order');
      }
    } catch (error) {
      setMessage('✗ Error creating order');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async () => {
    if (!tableId.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: tableId.trim(),
          restaurantId: 'restaurant-1',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQrCodeData({
          dataUrl: data.qrCodeDataUrl,
          tableUrl: data.tableUrl,
          tableId: data.tableId,
        });
        setMessage(`✓ QR code generated for table ${tableId}`);
      } else {
        setMessage('✗ Failed to generate QR code');
      }
    } catch (error) {
      setMessage('✗ Error generating QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeData) return;

    const link = document.createElement('a');
    link.href = qrCodeData.dataUrl;
    link.download = `table-${qrCodeData.tableId}-qr.png`;
    link.click();
  };

  const handleCloseQR = () => {
    setQrCodeData(null);
  };

  const handleUpdateItemStatus = (orderId: string, itemId: string, status: string) => {
    if (socket) {
      socket.emit('update-item-status', { orderId, itemId, status });
    }
  };

  const handleAddItem = () => {
    if (socket && addItemDialog.orderId && newItem.name && newItem.priceInPence > 0) {
      const item = {
        id: `item-${Date.now()}`,
        name: newItem.name,
        priceInPence: newItem.priceInPence,
        quantity: newItem.quantity,
        status: 'ordered' as const,
      };
      socket.emit('add-items', { orderId: addItemDialog.orderId, items: [item] });
      setAddItemDialog({ open: false, orderId: null });
      setNewItem({ name: '', priceInPence: 0, quantity: 1 });
    }
  };

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: 'secondary.main' }}>
          Waiter Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Manage tables and orders
        </Typography>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Quick Actions
              </Typography>

              <TextField
                fullWidth
                label="Table ID"
                placeholder="e.g., T1, T2, T42"
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Plus size={20} />}
                  onClick={handleCreateOrder}
                  disabled={loading || !tableId.trim()}
                >
                  Create Order
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<QrCodeIcon size={20} />}
                  onClick={handleGenerateQR}
                  disabled={loading || !tableId.trim()}
                >
                  Generate QR
                </Button>
              </Box>

              {message && (
                <Typography
                  variant="body2"
                  sx={{
                    p: 2,
                    bgcolor: message.startsWith('✓') ? 'success.light' : 'error.light',
                    color: message.startsWith('✓') ? 'success.dark' : 'error.dark',
                    borderRadius: 1,
                  }}
                >
                  {message}
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Instructions */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'primary.light' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.dark' }}>
                How to Use
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: 'primary.dark' }}>
                1. Enter a table ID (e.g., T1, T2, T42)
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: 'primary.dark' }}>
                2. Click "Create Order" to generate a test bill
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: 'primary.dark' }}>
                3. Click "Generate QR" to create a QR code
              </Typography>
              <Typography variant="body2" sx={{ color: 'primary.dark' }}>
                4. Customers scan QR or enter table ID to pay
              </Typography>
            </Paper>
          </Grid>

          {/* Active Tables */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Active Tables
            </Typography>
            {ordersLoading ? (
              <Typography variant="body2" color="text.secondary">
                Loading active orders...
              </Typography>
            ) : activeOrders.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No active orders. Create an order to get started.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {activeOrders.map((order) => {
                  const claimedItems = order.items.filter(item => item.claimedBy).length;
                  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  const totalPrice = (order.totalInPence / 100).toFixed(2);
                  const isExpanded = expandedOrder === order._id;

                  return (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={order._id}>
                      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                              {order.tableId}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton size="small" onClick={() => toggleExpandOrder(order._id)}>
                                {isExpanded ? <LucideShrink size={16} /> : <LucideExpand size={16} />}
                              </IconButton>
                              <Chip 
                                label={order.status} 
                                color={order.status === 'active' ? 'success' : 'warning'} 
                                size="small" 
                              />
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {totalItems} items • £{totalPrice}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {claimedItems}/{totalItems} claimed
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Eye size={16} />}
                              href={`/?table=${order.tableId}`}
                              target="_blank"
                            >
                              View
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<PlusIcon size={16} />}
                              onClick={() => setAddItemDialog({ open: true, orderId: order._id })}
                            >
                              Add Item
                            </Button>
                          </Box>
                          <Collapse in={isExpanded}>
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>Items:</Typography>
                              {order.items.map((item) => (
                                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      £{(item.priceInPence / 100).toFixed(2)} × {item.quantity} = £{((item.priceInPence * item.quantity) / 100).toFixed(2)}
                                    </Typography>
                                    {item.claimedBy && <Typography variant="caption" color="primary">Claimed</Typography>}
                                  </Box>
                                  <FormControl size="small" sx={{ minWidth: 100 }}>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                      value={item.status}
                                      label="Status"
                                      onChange={(e) => handleUpdateItemStatus(order._id, item.id, e.target.value)}
                                    >
                                      <MenuItem value="ordered">Ordered</MenuItem>
                                      <MenuItem value="preparing">Preparing</MenuItem>
                                      <MenuItem value="ready">Ready</MenuItem>
                                      <MenuItem value="served">Served</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Box>
                              ))}
                            </Box>
                          </Collapse>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Add Item Dialog */}
      <Dialog open={addItemDialog.open} onClose={() => setAddItemDialog({ open: false, orderId: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Item Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Price (in pence)"
            type="number"
            value={newItem.priceInPence}
            onChange={(e) => setNewItem({ ...newItem, priceInPence: parseInt(e.target.value) || 0 })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Quantity"
            type="number"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddItemDialog({ open: false, orderId: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleAddItem}>Add Item</Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={!!qrCodeData} onClose={handleCloseQR} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QrCodeIcon size={24} />
            <Typography variant="h6">QR Code for Table {qrCodeData?.tableId}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            {qrCodeData && (
              <>
                <img
                  src={qrCodeData.dataUrl}
                  alt={`QR Code for table ${qrCodeData.tableId}`}
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Scan to access: {qrCodeData.tableUrl}
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQR}>Close</Button>
          <Button
            variant="contained"
            startIcon={<Download size={20} />}
            onClick={handleDownloadQR}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
