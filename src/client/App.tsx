import { ThemeProvider, CssBaseline, Snackbar, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { tempoTheme } from './theme';
import { useSocket } from './hooks/useSocket';
import { useOrderStore } from './store/orderStore';
import { TableJoin, LiveLedger, PaymentSelection } from './components';
import { ErrorBoundary } from './components/ErrorBoundary';
import WaiterDashboard from './components/WaiterDashboard';
import AdminDashboard from './components/AdminDashboard';
import PresentationSlides from './components/PresentationSlides';

type AppView = 'join' | 'ledger' | 'payment' | 'waiter' | 'admin' | 'presentation';

function App() {
  const [view, setView] = useState<AppView>('join');
  const [tableId, setTableId] = useState<string>('');
  const [userId] = useState(() => `user-${Math.random().toString(36).substr(2, 9)}`);
  const { socket, isConnected } = useSocket();
  const { setOrder, updateOrder } = useOrderStore();

  // Check URL for role-based views and table parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    if (params.get('waiter') === 'true') {
      setView('waiter');
    } else if (params.get('admin') === 'true') {
      setView('admin');
    } else if (params.get('presentation') === 'true' || params.get('slides') === 'true') {
      setView('presentation');
    } else if (params.get('table')) {
      // Auto-join table from QR code scan
      const table = params.get('table');
      if (table) {
        setTableId(table);
        // Wait for socket to connect before joining
        setTimeout(() => {
          socket?.emit('join-table', table);
        }, 1000);
      }
    }
  }, [socket]);

  useEffect(() => {
    if (!socket || view === 'waiter' || view === 'admin' || view === 'presentation') return;

    socket.on('order-state', (order) => {
      // Clear the timeout if it exists
      if ((window as any).__tableJoinTimeout) {
        clearTimeout((window as any).__tableJoinTimeout);
        delete (window as any).__tableJoinTimeout;
      }

      if (order) {
        setOrder(order);
        setView('ledger');
      } else {
        console.log('No order found for table:', tableId);
      }
    });

    socket.on('order-updated', (order) => {
      updateOrder(order);
    });

    return () => {
      socket.off('order-state');
      socket.off('order-updated');
    };
  }, [socket, setOrder, updateOrder, tableId, view]);

  const handleJoinTable = (id: string) => {
    setTableId(id);
    socket?.emit('join-table', id);
  };

  const handleProceedToPayment = () => {
    setView('payment');
  };

  // Presentation mode - full screen, no other UI
  if (view === 'presentation') {
    return (
      <ErrorBoundary>
        <ThemeProvider theme={tempoTheme}>
          <CssBaseline />
          <PresentationSlides />
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider theme={tempoTheme}>
        <CssBaseline />
        
        {view === 'admin' && <AdminDashboard />}
        {view === 'waiter' && <WaiterDashboard />}
        {view === 'join' && <TableJoin onJoin={handleJoinTable} />}
        {view === 'ledger' && (
          <LiveLedger 
            userId={userId} 
            socket={socket} 
            onProceedToPayment={handleProceedToPayment}
          />
        )}
        {view === 'payment' && <PaymentSelection userId={userId} />}

        {view !== 'waiter' && view !== 'admin' && (
          <Snackbar open={!isConnected} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert severity="warning" sx={{ width: '100%' }}>
              Connection Lost - Reconnecting...
            </Alert>
          </Snackbar>
        )}
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
