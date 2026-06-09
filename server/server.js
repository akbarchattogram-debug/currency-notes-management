// ============================================
// SERVER.JS - WITH DATABASE CONNECTION
// ============================================

// Import required packages
const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

// ============================================
// DATABASE CONNECTION
// ============================================

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'currency_notes_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
async function testDatabaseConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully!');
        
        // Test: Count branches
        const [rows] = await connection.query('SELECT COUNT(*) as total FROM branches');
        console.log(`📊 Total branches in database: ${rows[0].total}`);
        
        // Test: Count users
        const [users] = await connection.query('SELECT COUNT(*) as total FROM users');
        console.log(`👥 Total users in database: ${users[0].total}`);
        
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('💡 Make sure XAMPP MySQL is running!');
        return false;
    }
}

// ============================================
// API ROUTES
// ============================================

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Test API
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: '🎉 Server is running!',
        time: new Date().toLocaleString()
    });
});

// Database status API
app.get('/api/db-status', async (req, res) => {
    try {
        // Test connection
        const [branchCount] = await pool.query('SELECT COUNT(*) as total FROM branches');
        const [userCount] = await pool.query('SELECT COUNT(*) as total FROM users');
        
        res.json({
            success: true,
            database: 'Connected',
            branches: branchCount[0].total,
            users: userCount[0].total,
            tables: ['branches', 'users', 'note_entries']
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            database: 'Disconnected',
            error: error.message
        });
    }
});

// Get all branches
app.get('/api/branches', async (req, res) => {
    try {
        const [branches] = await pool.query(
            'SELECT id, branch_code, branch_name, type FROM branches WHERE is_active = TRUE ORDER BY branch_name'
        );
        res.json(branches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get users by branch
app.get('/api/users/:branchId', async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, username, full_name, role FROM users WHERE branch_id = ?',
            [req.params.branchId]
        );
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, async () => {
    console.log('\n========================================');
    console.log('🏦 Bangladesh Bank - Note Management');
    console.log('========================================');
    console.log(`✅ Server running at: http://localhost:${PORT}`);
    console.log(`📝 Test API at: http://localhost:${PORT}/api/test`);
    console.log(`🗄️  DB Status at: http://localhost:${PORT}/api/db-status`);
    console.log('========================================');
    
    // Test database connection
    const dbConnected = await testDatabaseConnection();
    
    if (!dbConnected) {
        console.log('\n⚠️  WARNING: Database not connected!');
        console.log('👉 Make sure XAMPP MySQL is running');
        console.log('👉 Check your .env file settings\n');
    }
    
    console.log('========================================\n');
});