const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

// Import database connection
const connectDB = require('./config/db');

// Import error handler
const { errorHandler } = require('./middlewares/error');

// Import routes (make sure each of these files exports a router)
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            'https://karan-homeo-pharmacy.vercel.app',
            'https://khpadmin.vercel.app',
            'https://karan-homeo-pharmacy-admin.vercel.app',
            'http://localhost:3000',
            'http://localhost:5173'
        ],
        credentials: true
    }
});

// Connect to MongoDB
connectDB();

// Basic middleware
app.use(cors({
  origin: [
    'https://karan-homeo-pharmacy.vercel.app',
    'https://karan-homeo-pharmacy-18po.vercel.app',
    'https://khpadmin.vercel.app',
    'https://karan-homeo-pharmacy-admin.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Make io available to routes (must come BEFORE routes)
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Test routes
app.get('/', (req, res) => {
    res.send('<h1>Karan Homeo Pharmacy API</h1><p>Server is up and running!</p>');
});

app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// Mount routes (make sure each route file does: `module.exports = router;`)
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('join-admin', () => {
        socket.join('admin');
        console.log('Admin joined room');
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Error handling middleware (always last)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
