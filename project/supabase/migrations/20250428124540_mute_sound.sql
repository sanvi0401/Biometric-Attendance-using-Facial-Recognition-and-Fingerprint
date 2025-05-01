-- MySQL database schema for biometric attendance system

-- Create database
CREATE DATABASE IF NOT EXISTS biometric_attendance;
USE biometric_attendance;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, -- In production, store hashed passwords
  role ENUM('admin', 'manager', 'employee') NOT NULL DEFAULT 'employee',
  department VARCHAR(100),
  position VARCHAR(100),
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  biometric_data TEXT, -- Store hashed/encrypted biometric data in production
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  check_in DATETIME NOT NULL,
  check_out DATETIME,
  method ENUM('fingerprint', 'face', 'manual') NOT NULL,
  status ENUM('on-time', 'late', 'absent') NOT NULL DEFAULT 'on-time',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Shifts table
CREATE TABLE IF NOT EXISTS shifts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  grace_period_minutes INT DEFAULT 15,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User shift assignments
CREATE TABLE IF NOT EXISTS user_shifts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  shift_id INT NOT NULL,
  day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE
);

-- Holidays table
CREATE TABLE IF NOT EXISTS holidays (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Leave requests table
CREATE TABLE IF NOT EXISTS leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  type ENUM('sick', 'vacation', 'personal', 'other') NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  reason TEXT,
  approved_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@example.com', 'admin123', 'admin')
ON DUPLICATE KEY UPDATE email = email;

-- Insert default employee
INSERT INTO users (name, email, password, role, department, position) 
VALUES ('John Doe', 'john@example.com', 'password123', 'employee', 'Engineering', 'Software Developer')
ON DUPLICATE KEY UPDATE email = email;

-- Insert default shift
INSERT INTO shifts (name, start_time, end_time, grace_period_minutes)
VALUES ('Default Shift', '09:00:00', '17:00:00', 15)
ON DUPLICATE KEY UPDATE name = name;

-- Default settings
INSERT INTO settings (setting_key, setting_value)
VALUES 
  ('company_name', 'Acme Corporation'),
  ('time_zone', 'UTC+0'),
  ('late_threshold_minutes', '15'),
  ('biometric_confidence_threshold', '85'),
  ('enable_fingerprint', 'true'),
  ('enable_facial_recognition', 'true')
ON DUPLICATE KEY UPDATE setting_key = setting_key;