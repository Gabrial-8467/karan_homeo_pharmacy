const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Import database connection
const connectDB = require('./config/db');

// Import error handler
const { errorHandler } = require('./middlewares/error');

// Import routes - adding back one by one
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Basic middleware
app.use(cors());
app.use(express.json());

// Test routes
app.get('/', (req, res) => {
    res.send('<h1>Karan Homeo Pharmacy API</h1><p>Server is up and running!</p>');
});

app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// Mount routes - adding back one by one
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 