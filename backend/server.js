const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models/index'); // Import from models index

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth',require('./auth'))
app.use('/api/employees',require('./employees'))
app.use('/api/teams', require('./teams'));
app.use('/api/assign', require('./assignments'));
app.use('/api/audit-logs', require('./audit'));


// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'HRMS Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Database sync and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ SQLite database connection established successfully.');

    // Sync database (creates tables automatically)
    await sequelize.sync({ force: false }); // Set force: true to drop and recreate tables
    console.log('✅ All tables synchronized successfully.');
    console.log('📊 Created tables: organizations, users, employees, teams, employee_teams, audit_logs');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();