// Step 1: Import required packages
const express = require('express');
const cors = require('cors');
const path = require('path');

// Step 2: Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Step 3: Create express app
const app = express();
const PORT = process.env.PORT || 3000;

// Step 4: Setup middleware (helpers)
app.use(cors());                          // Allow cross-origin requests
app.use(express.json());                  // Parse JSON data
app.use(express.static(path.join(__dirname, '..'))); // Serve frontend files

// Step 5: Create test route
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: '🎉 Server is running successfully!',
        time: new Date().toLocaleString()
    });
});

// Step 6: Home page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Step 7: Start server
app.listen(PORT, () => {
    console.log('=====================================');
    console.log('🏦 Bangladesh Bank - Note Management');
    console.log('=====================================');
    console.log(`✅ Server running at: http://localhost:${PORT}`);
    console.log(`📝 Test API at: http://localhost:${PORT}/api/test`);
    console.log('=====================================');
});