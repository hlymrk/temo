import { useState } from 'react';
import { Box, Container, Typography, Button, IconButton, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Users,
  TrendingUp,
  Clock,
  CreditCard,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Rocket,
} from 'lucide-react';

interface Slide {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  background: string;
}

export default function PresentationSlides() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    // Slide 1: Title
    {
      title: 'tempo',
      subtitle: 'The Future of Restaurant Payments',
      background: 'linear-gradient(135deg, #E65100 0%, #1A237E 100%)',
      content: (
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Zap size={80} style={{ margin: '0 auto 24px' }} />
          </motion.div>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
            Real-time bill splitting for UK restaurants
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Built with React, TypeScript, Socket.io & MongoDB
          </Typography>
        </Box>
      ),
    },

    // Slide 2: The Problem
    {
      title: 'The Problem',
      subtitle: 'Current restaurant payment experience is broken',
      background: 'linear-gradient(135deg, #1A237E 0%, #000 100%)',
      content: (
        <Box sx={{ color: 'white' }}>
          {[
            { icon: Clock, text: 'Customers wait 15+ minutes for the bill', color: '#ff6b6b' },
            { icon: AlertCircle, text: 'Awkward "who pays what" conversations', color: '#ffa726' },
            { icon: Users, text: 'Manual bill splitting causes errors', color: '#ffca28' },
            { icon: TrendingUp, text: 'Slow table turnover hurts revenue', color: '#ef5350' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3,
                  p: 2,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: `${item.color}20`,
                    mr: 2,
                  }}
                >
                  <item.icon size={32} color={item.color} />
                </Box>
                <Typography variant="h6">{item.text}</Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      ),
    },

    // Slide 3: The Solution
    {
      title: 'The Solution',
      subtitle: 'Tempo: Real-time payment splitting',
      background: 'linear-gradient(135deg, #E65100 0%, #ff8a50 100%)',
      content: (
        <Box sx={{ color: 'white' }}>
          {[
            { icon: Smartphone, text: 'Scan QR code → Instant access', desc: 'No app download required' },
            { icon: Zap, text: 'Real-time synchronization', desc: 'See updates across all devices instantly' },
            { icon: CreditCard, text: 'Smart payment routing', desc: 'Bank transfer for £20+, card for smaller amounts' },
            { icon: CheckCircle, text: 'Zero conflicts', desc: 'Claim items, no double-payments' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.15 }}
            >
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <item.icon size={24} style={{ marginRight: 12 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {item.text}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9, ml: 4.5 }}>
                  {item.desc}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      ),
    },

    // Slide 4: Key Features
    {
      title: 'Key Features',
      subtitle: 'Built for speed and simplicity',
      background: 'linear-gradient(135deg, #1A237E 0%, #3949ab 100%)',
      content: (
        <Box sx={{ color: 'white' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            {[
              { title: 'Customer Flow', items: ['QR code access', 'Live bill view', 'Item claiming', 'Instant payment'] },
              { title: 'Staff Dashboard', items: ['Order creation', 'Status tracking', 'Table monitoring', 'QR generation'] },
              { title: 'Admin Analytics', items: ['Revenue tracking', 'Table velocity', 'Net margins', 'Live metrics'] },
              { title: 'Technical', items: ['Socket.io sync', 'MongoDB Atlas', 'Stripe + TrueLayer', 'TypeScript'] },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    p: 2.5,
                    bgcolor: 'rgba(255,255,255,0.08)',
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.15)',
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                  {feature.items.map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircle size={16} style={{ marginRight: 8, opacity: 0.7 }} />
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>
      ),
    },

    // Slide 5: How It Works
    {
      title: 'How It Works',
      subtitle: '3 simple steps',
      background: 'linear-gradient(135deg, #00897b 0%, #26a69a 100%)',
      content: (
        <Box sx={{ color: 'white' }}>
          {[
            {
              step: '1',
              title: 'Scan & Join',
              desc: 'Customer scans QR code at table, instantly sees live bill',
              icon: Smartphone,
            },
            {
              step: '2',
              title: 'Claim Items',
              desc: 'Each person claims their items, everyone sees updates in real-time',
              icon: Users,
            },
            {
              step: '3',
              title: 'Pay & Go',
              desc: 'Choose payment method, complete payment, leave immediately',
              icon: Zap,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.2, type: 'spring' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 4,
                  p: 3,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  border: '2px solid rgba(255,255,255,0.2)',
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'white',
                    color: '#00897b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    fontWeight: 700,
                    mr: 3,
                    flexShrink: 0,
                  }}
                >
                  {item.step}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <item.icon size={24} style={{ marginRight: 12 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>
      ),
    },

    // Slide 6: Business Impact
    {
      title: 'Business Impact',
      subtitle: 'Real results for restaurants',
      background: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%)',
      content: (
        <Box sx={{ color: 'white' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {[
              { value: '40%', label: 'Faster table turnover', icon: Clock },
              { value: '£2.50', label: 'Lower fees per transaction', icon: TrendingUp },
              { value: '100%', label: 'Payment accuracy', icon: CheckCircle },
              { value: '5min', label: 'Average payment time', icon: Zap },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.15, type: 'spring' }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    border: '2px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <stat.icon size={48} style={{ margin: '0 auto 16px', opacity: 0.9 }} />
                  <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>
      ),
    },

    // Slide 7: Technology Stack
    {
      title: 'Technology Stack',
      subtitle: 'Built with modern, scalable technologies',
      background: 'linear-gradient(135deg, #263238 0%, #37474f 100%)',
      content: (
        <Box sx={{ color: 'white' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 3 }}>
            {[
              { category: 'Frontend', tech: ['React 19', 'TypeScript', 'Material-UI', 'Framer Motion', 'Zustand'] },
              { category: 'Backend', tech: ['Node.js', 'Express 5', 'Socket.io', 'MongoDB', 'Mongoose'] },
              { category: 'Payments', tech: ['Stripe', 'TrueLayer', 'dinero.js', 'Webhooks', 'RBAC'] },
            ].map((stack, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <Box
                  sx={{
                    p: 2.5,
                    bgcolor: 'rgba(255,255,255,0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.1)',
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#E65100' }}>
                    {stack.category}
                  </Typography>
                  {stack.tech.map((item, i) => (
                    <Chip
                      key={i}
                      label={item}
                      size="small"
                      sx={{
                        m: 0.5,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    />
                  ))}
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>
      ),
    },

    // Slide 8: Future Roadmap
    {
      title: 'Future Roadmap',
      subtitle: 'What\'s next for Tempo',
      background: 'linear-gradient(135deg, #E65100 0%, #ff6f00 100%)',
      content: (
        <Box sx={{ color: 'white' }}>
          {[
            { phase: 'Q2 2026', items: ['Multi-restaurant support', 'Advanced analytics', 'POS integration'] },
            { phase: 'Q3 2026', items: ['Mobile apps (iOS/Android)', 'Loyalty program', 'Table reservations'] },
            { phase: 'Q4 2026', items: ['AI-powered recommendations', 'Multi-currency support', 'Kitchen integration'] },
          ].map((roadmap, index) => (
            <motion.div
              key={index}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                  {roadmap.phase}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {roadmap.items.map((item, i) => (
                    <Box
                      key={i}
                      sx={{
                        px: 2,
                        py: 1,
                        bgcolor: 'rgba(255,255,255,0.15)',
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.3)',
                      }}
                    >
                      <Typography variant="body1">{item}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>
      ),
    },

    // Slide 9: Call to Action
    {
      title: 'Ready to Transform',
      subtitle: 'Your Restaurant Experience?',
      background: 'linear-gradient(135deg, #1A237E 0%, #E65100 100%)',
      content: (
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <Rocket size={80} style={{ margin: '0 auto 32px' }} />
          </motion.div>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
            Join the Payment Revolution
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Faster payments • Happier customers • Higher revenue
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: '#E65100',
                px: 4,
                py: 1.5,
                fontSize: 18,
                fontWeight: 700,
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
              href="/"
            >
              Try Demo
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: 18,
                fontWeight: 700,
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
              href="https://github.com"
              target="_blank"
            >
              View on GitHub
            </Button>
          </Box>
        </Box>
      ),
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: currentSlideData.background,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            py: 8,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 2,
                  textAlign: currentSlide === 0 ? 'center' : 'left',
                }}
              >
                {currentSlideData.title}
              </Typography>
              {currentSlideData.subtitle && (
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    opacity: 0.9,
                    mb: 6,
                    textAlign: currentSlide === 0 ? 'center' : 'left',
                  }}
                >
                  {currentSlideData.subtitle}
                </Typography>
              )}
              <Box sx={{ mt: 4 }}>{currentSlideData.content}</Box>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Container>

      {/* Navigation */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          bgcolor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          p: 1,
        }}
      >
        <IconButton onClick={prevSlide} sx={{ color: 'white' }}>
          <ChevronLeft />
        </IconButton>
        <Typography sx={{ color: 'white', minWidth: 60, textAlign: 'center' }}>
          {currentSlide + 1} / {slides.length}
        </Typography>
        <IconButton onClick={nextSlide} sx={{ color: 'white' }}>
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Slide indicators */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          display: 'flex',
          gap: 1,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentSlide(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.6)' },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
