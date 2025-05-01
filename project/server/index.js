import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const createConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'biometric_attendance',
    });
    
    console.log('Connected to MySQL database');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    
    req.user = user;
    next();
  });
};

// API Routes
// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    const connection = await createConnection();
    
    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    
    // Insert new user
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, 'employee'] // In production, password should be hashed
    );
    
    await connection.end();
    
    return res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertId,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    const connection = await createConnection();
    
    // Find user by email
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    await connection.end();
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // In production, we'd compare hashed passwords
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );
    
    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const connection = await createConnection();
    
    const [users] = await connection.execute(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [req.user.id]
    );
    
    await connection.end();
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.json({
      user: users[0],
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Attendance Routes
app.post('/api/attendance/checkin', authenticateToken, async (req, res) => {
  try {
    const { biometricData, method } = req.body;
    const userId = req.user.id;
    
    const connection = await createConnection();
    
    // Check if already checked in today
    const today = new Date().toISOString().split('T')[0];
    const [existingAttendance] = await connection.execute(
      'SELECT * FROM attendance WHERE user_id = ? AND DATE(check_in) = ?',
      [userId, today]
    );
    
    if (existingAttendance.length > 0) {
      await connection.end();
      return res.status(400).json({ message: 'Already checked in today' });
    }
    
    // Record check-in
    const [result] = await connection.execute(
      'INSERT INTO attendance (user_id, check_in, method) VALUES (?, NOW(), ?)',
      [userId, method]
    );
    
    await connection.end();
    
    return res.status(201).json({
      message: 'Check-in recorded successfully',
      attendanceId: result.insertId,
      checkInTime: new Date(),
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/attendance/checkout', authenticateToken, async (req, res) => {
  try {
    const { biometricData, method } = req.body;
    const userId = req.user.id;
    
    const connection = await createConnection();
    
    // Find today's attendance record
    const today = new Date().toISOString().split('T')[0];
    const [attendanceRecords] = await connection.execute(
      'SELECT * FROM attendance WHERE user_id = ? AND DATE(check_in) = ? AND check_out IS NULL',
      [userId, today]
    );
    
    if (attendanceRecords.length === 0) {
      await connection.end();
      return res.status(400).json({ message: 'No check-in record found for today' });
    }
    
    // Update with check-out time
    await connection.execute(
      'UPDATE attendance SET check_out = NOW() WHERE id = ?',
      [attendanceRecords[0].id]
    );
    
    await connection.end();
    
    return res.json({
      message: 'Check-out recorded successfully',
      checkOutTime: new Date(),
    });
  } catch (error) {
    console.error('Check-out error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/attendance/today', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const connection = await createConnection();
    
    // Get today's attendance
    const today = new Date().toISOString().split('T')[0];
    const [attendanceRecords] = await connection.execute(
      'SELECT * FROM attendance WHERE user_id = ? AND DATE(check_in) = ?',
      [userId, today]
    );
    
    await connection.end();
    
    if (attendanceRecords.length === 0) {
      return res.json(null);
    }
    
    const attendance = attendanceRecords[0];
    
    return res.json({
      id: attendance.id,
      date: today,
      checkIn: attendance.check_in ? new Date(attendance.check_in).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
      checkOut: attendance.check_out ? new Date(attendance.check_out).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
      status: attendance.status,
    });
  } catch (error) {
    console.error('Get today attendance error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/attendance/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }
    
    const connection = await createConnection();
    
    const [attendanceRecords] = await connection.execute(
      `SELECT * FROM attendance 
       WHERE user_id = ? 
       AND MONTH(check_in) = ? 
       AND YEAR(check_in) = ?
       ORDER BY check_in DESC`,
      [userId, month, year]
    );
    
    await connection.end();
    
    const formattedRecords = attendanceRecords.map(record => {
      const checkIn = new Date(record.check_in);
      const checkOut = record.check_out ? new Date(record.check_out) : null;
      
      // Calculate work hours if both check-in and check-out exist
      let workHours = null;
      if (checkOut) {
        workHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
        workHours = Math.round(workHours * 10) / 10; // Round to 1 decimal place
      }
      
      return {
        id: record.id,
        date: checkIn.toLocaleDateString(),
        checkIn: checkIn.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        checkOut: checkOut ? checkOut.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
        workHours,
        status: record.status,
      };
    });
    
    return res.json(formattedRecords);
  } catch (error) {
    console.error('Get attendance history error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Employee Routes (Admin Only)
app.get('/api/employees', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
    
    const connection = await createConnection();
    
    const [employees] = await connection.execute(
      'SELECT id, name, email, department, position, status, created_at as joiningDate FROM users WHERE role = "employee"'
    );
    
    await connection.end();
    
    return res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Reports Routes (Admin Only)
app.get('/api/reports/monthly', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
    
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }
    
    const connection = await createConnection();
    
    // Get monthly attendance summary for all employees
    const [results] = await connection.execute(
      `SELECT 
        u.id as employeeId,
        u.name as employeeName,
        u.department,
        COUNT(CASE WHEN a.status = 'on-time' THEN 1 END) as present,
        COUNT(CASE WHEN a.status = 'late' THEN 1 END) as late,
        COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent,
        SUM(TIMESTAMPDIFF(HOUR, a.check_in, IFNULL(a.check_out, a.check_in))) as totalWorkHours
      FROM 
        users u
      LEFT JOIN 
        attendance a ON u.id = a.user_id AND MONTH(a.check_in) = ? AND YEAR(a.check_in) = ?
      WHERE 
        u.role = 'employee'
      GROUP BY 
        u.id, u.name, u.department`,
      [month, year]
    );
    
    await connection.end();
    
    // Calculate average work hours
    const reports = results.map(report => ({
      ...report,
      averageWorkHours: report.totalWorkHours ? (report.totalWorkHours / (report.present + report.late)) : 0,
    }));
    
    return res.json(reports);
  } catch (error) {
    console.error('Get monthly reports error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Dashboard stats
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const connection = await createConnection();
    
    if (req.user.role === 'admin') {
      // Admin dashboard stats
      const today = new Date().toISOString().split('T')[0];
      
      // Get employee count
      const [employeeCountResult] = await connection.execute(
        'SELECT COUNT(*) as count FROM users WHERE role = "employee"'
      );
      
      // Get today's attendance stats
      const [attendanceStatsResult] = await connection.execute(
        `SELECT 
          COUNT(CASE WHEN status = 'on-time' THEN 1 END) as presentCount,
          COUNT(CASE WHEN status = 'late' THEN 1 END) as lateCount,
          COUNT(CASE WHEN status = 'absent' THEN 1 END) as absentCount
        FROM 
          attendance
        WHERE 
          DATE(check_in) = ?`,
        [today]
      );
      
      await connection.end();
      
      const stats = {
        totalEmployees: employeeCountResult[0].count,
        presentToday: attendanceStatsResult[0].presentCount || 0,
        lateToday: attendanceStatsResult[0].lateCount || 0,
        absentToday: attendanceStatsResult[0].absentCount || 0,
        onTimePercentage: Math.round((attendanceStatsResult[0].presentCount / employeeCountResult[0].count) * 100) || 0,
      };
      
      return res.json(stats);
    } else {
      // Employee dashboard stats
      const userId = req.user.id;
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      // Get employee's monthly attendance stats
      const [attendanceStatsResult] = await connection.execute(
        `SELECT 
          COUNT(CASE WHEN status = 'on-time' THEN 1 END) as presentCount,
          COUNT(CASE WHEN status = 'late' THEN 1 END) as lateCount,
          COUNT(CASE WHEN status = 'absent' THEN 1 END) as absentCount,
          SUM(TIMESTAMPDIFF(HOUR, check_in, IFNULL(check_out, check_in))) as totalWorkHours
        FROM 
          attendance
        WHERE 
          user_id = ? AND MONTH(check_in) = ? AND YEAR(check_in) = ?`,
        [userId, currentMonth, currentYear]
      );
      
      await connection.end();
      
      const stats = {
        presentDays: attendanceStatsResult[0].presentCount || 0,
        lateDays: attendanceStatsResult[0].lateCount || 0,
        absentDays: attendanceStatsResult[0].absentCount || 0,
        totalWorkHours: attendanceStatsResult[0].totalWorkHours || 0,
      };
      
      return res.json(stats);
    }
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});