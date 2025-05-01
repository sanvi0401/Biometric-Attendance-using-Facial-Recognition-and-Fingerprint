-- MySQL database schema for student attendance system

-- Create database
CREATE DATABASE IF NOT EXISTS student_attendance;
USE student_attendance;

-- Users table (Students and Faculty)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, -- In production, store hashed passwords
  role ENUM('admin', 'faculty', 'student') NOT NULL DEFAULT 'student',
  department VARCHAR(100),
  semester INT,
  roll_number VARCHAR(20),
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  biometric_data TEXT, -- Store hashed/encrypted biometric data in production
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  semester INT,
  credits INT,
  faculty_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Course enrollments
CREATE TABLE IF NOT EXISTS course_enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  semester INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Class schedule
CREATE TABLE IF NOT EXISTS class_schedule (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Attendance records
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  class_date DATE NOT NULL,
  check_in DATETIME NOT NULL,
  method ENUM('fingerprint', 'face', 'manual') NOT NULL,
  status ENUM('present', 'late', 'absent') NOT NULL DEFAULT 'present',
  marked_by INT, -- Faculty who marked attendance manually
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (marked_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Holidays table
CREATE TABLE IF NOT EXISTS holidays (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Leave applications
CREATE TABLE IF NOT EXISTS leave_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  document_url VARCHAR(255), -- For medical certificates etc.
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  approved_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
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
VALUES ('Admin User', 'admin@college.edu', 'admin123', 'admin')
ON DUPLICATE KEY UPDATE email = email;

-- Insert sample faculty
INSERT INTO users (name, email, password, role, department) 
VALUES 
  ('Dr. Smith', 'smith@college.edu', 'faculty123', 'faculty', 'Computer Science'),
  ('Dr. Johnson', 'johnson@college.edu', 'faculty123', 'faculty', 'Electronics')
ON DUPLICATE KEY UPDATE email = email;

-- Insert sample courses
INSERT INTO courses (code, name, department, semester, credits, faculty_id)
SELECT 'CS101', 'Introduction to Programming', 'Computer Science', 1, 4, id
FROM users WHERE email = 'smith@college.edu'
ON DUPLICATE KEY UPDATE code = code;

INSERT INTO courses (code, name, department, semester, credits, faculty_id)
SELECT 'CS102', 'Data Structures', 'Computer Science', 2, 4, id
FROM users WHERE email = 'smith@college.edu'
ON DUPLICATE KEY UPDATE code = code;

-- Default settings
INSERT INTO settings (setting_key, setting_value)
VALUES 
  ('college_name', 'Tech University'),
  ('attendance_threshold', '75'),
  ('late_threshold_minutes', '10'),
  ('biometric_confidence_threshold', '85'),
  ('enable_fingerprint', 'true'),
  ('enable_facial_recognition', 'true')
ON DUPLICATE KEY UPDATE setting_key = setting_key;