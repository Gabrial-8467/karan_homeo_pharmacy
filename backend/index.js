const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const http = require('http');
// const { Server } = require('socket.io');

dotenv.config();

// Import database connection
const connectDB = require('./config/db');

// Import routes - temporarily comment out to isolate the issue
// const authRoutes = require('./routes/authRoutes');
// const productRoutes = require('./routes/productRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const uploadRoutes = require('./routes/uploadRoutes');

// Import error handler
const { errorHandler } = require('./middlewares/error');

const app = express();
const server = http.createServer(app);
// Temporarily disable Socket.io to isolate the issue
// const io = new Server(server, {
//     cors: {
//         origin: [
//             'https://karan-homeo-pharmacy.vercel.app',
//             'https://karan-homeo-pharmacy-18po.vercel.app',
//             'https://khpadmin.vercel.app',
//             'https://karan-homeo-pharmacy-admin.vercel.app',
//             'http://localhost:3000',
//             'http://localhost:5173'
//         ],
//         credentials: true
//     }
// });

// Connect to MongoDB
connectDB();

// Middleware
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

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// Temporarily disable Socket.io middleware and handlers
// app.use((req, res, next) => {
//     req.io = io;
//     next();
// });

// io.on('connection', (socket) => {
//     console.log('Client connected:', socket.id);
//     
//     socket.on('join-admin', () => {
//         socket.join('admin');
//         console.log('Admin joined room');
//     });
//     
//     socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//     });
// });

// Serve uploaded files
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes - temporarily comment out all routes to isolate the issue
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/upload', uploadRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('<h1>Karan Homeo Pharmacy API</h1><p>Server is up and running!</p>');
});

// Test route to verify server works
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// Error handling middleware
app.use(errorHandler);

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 