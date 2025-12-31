// SFERA - AI Carousel Generator Backend
// Main Express Server with API Routes

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { Server } = require('socket.io');
const http = require('http');

// Import routes
// const templateRoutes = require('./routes/templates');
// const chatRoutes = require('./routes/chat');
// const pinterestRoutes = require('./routes/pinterest');
// const galleryRoutes = require('./routes/gallery');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: ['GET', 'POST']
  }
});

// ===========================================
// MIDDLEWARE
// ===========================================

// Security
app.use(helmet());
app.use(cors());

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100)
});
app.use('/api/', limiter);

// ===========================================
// ROUTES
// ===========================================

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/templates', require('./routes/templates.js') || []);
app.use('/api/chat', require('./routes/chat.js') || []);
app.use('/api/pinterest', require('./routes/pinterest.js') || []);
app.use('/api/gallery', require('./routes/gallery.js') || []);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ===========================================
// WEBSOCKET EVENTS
// ===========================================

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for chat messages
  socket.on('chat-message', async (data) => {
    console.log('Chat message:', data);
    // Process with AI and send response
    // io.emit('chat-response', response);
  });

  // Listen for template generation requests
  socket.on('generate-template', async (data) => {
    console.log('Generate request:', data);
    // Generate with AI and emit progress
    // socket.emit('generation-progress', progress);
    // socket.emit('generation-complete', template);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// ===========================================
// ERROR HANDLING
// ===========================================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ===========================================
// SERVER START
// ===========================================

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`
🚀 SFERA Backend Server is running!`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`💬 WebSocket: ws://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`\nEnvironment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n✨ Ready to generate amazing carousels with AI!\n`);
});

module.exports = { app, io };
