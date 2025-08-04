const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 