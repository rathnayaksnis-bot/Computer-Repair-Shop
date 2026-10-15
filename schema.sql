-- =====================================================
-- COMPUTER REPAIR SHOP SYSTEM - MySQL Schema
-- Project 21 | Practical 01 + 02
-- =====================================================

DROP DATABASE IF EXISTS computer_repair_db;
CREATE DATABASE computer_repair_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE computer_repair_db;

-- ---------- USERS (Admin/Technician) ----------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin','technician') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------- CUSTOMERS ----------
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------- DEVICES (Customer's Devices) ----------
CREATE TABLE devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    device_type ENUM('laptop','desktop','phone','tablet','printer','other') NOT NULL,
    brand VARCHAR(80) NOT NULL,
    model VARCHAR(80) NOT NULL,
    serial_number VARCHAR(100),
    purchase_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- ---------- SERVICES (Repair Services Catalog) ----------
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    category ENUM('hardware','software','network','data_recovery','other') DEFAULT 'hardware',
    price DECIMAL(10,2) NOT NULL,
    estimated_hours INT DEFAULT 1,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------- REPAIR JOBS ----------
CREATE TABLE repair_jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_number VARCHAR(20) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    device_id INT NOT NULL,
    service_id INT NOT NULL,
    problem_description TEXT NOT NULL,
    status ENUM('received','diagnosing','in_progress','completed','delivered','cancelled') DEFAULT 'received',
    priority ENUM('low','medium','high','urgent') DEFAULT 'medium',
    estimated_cost DECIMAL(10,2) NOT NULL,
    final_cost DECIMAL(10,2),
    received_date DATE NOT NULL,
    target_date DATE,
    completed_date DATE,
    technician_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT
);

-- ---------- PAYMENTS ----------
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    mode ENUM('cash','card','upi','netbanking') DEFAULT 'cash',
    status ENUM('pending','paid','failed') DEFAULT 'pending',
    transaction_ref VARCHAR(100),
    paid_at TIMESTAMP NULL,
    FOREIGN KEY (job_id) REFERENCES repair_jobs(id) ON DELETE CASCADE
);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Default admin: admin / admin123
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@repairshop.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin');

-- Customers
INSERT INTO customers (name, email, phone, address) VALUES
('John Silva', 'john@example.com', '071-2345678', 'No. 123, Main Street, Colombo'),
('Sarah Perera', 'sarah@example.com', '072-3456789', 'No. 45, Park Road, Kandy'),
('Mike Fernando', 'mike@example.com', '075-4567890', 'No. 78, Beach Road, Galle'),
('Emily Jayawardena', 'emily@example.com', '077-5678901', 'No. 12, Hill Street, Nuwara Eliya');

-- Devices
INSERT INTO devices (customer_id, device_type, brand, model, serial_number, purchase_date, notes) VALUES
(1, 'laptop', 'Dell', 'Inspiron 15 3000', 'DL12345678', '2022-03-15', 'Battery draining fast'),
(2, 'phone', 'Samsung', 'Galaxy S21', 'SM98765432', '2021-08-20', 'Screen cracked'),
(3, 'desktop', 'HP', 'Pavilion TG01', 'HP45678901', '2020-01-10', 'Not booting'),
(4, 'laptop', 'Lenovo', 'ThinkPad X1', 'LN11223344', '2023-05-05', 'Overheating'),
(1, 'tablet', 'Apple', 'iPad Air 4', 'AP55667788', '2022-11-12', 'Slow performance'),
(2, 'printer', 'Canon', 'Pixma G3020', 'CN33445566', '2021-02-25', 'Paper jam issue');

-- Services
INSERT INTO services (name, description, category, price, estimated_hours) VALUES
('Screen Replacement', 'Replace broken or damaged display screen', 'hardware', 8500.00, 2),
('Virus & Malware Removal', 'Complete scan and removal of viruses and malware', 'software', 2500.00, 1),
('OS Installation', 'Fresh installation of operating system', 'software', 3000.00, 2),
('Battery Replacement', 'Replace laptop battery with new one', 'hardware', 6500.00, 1),
('Data Recovery', 'Recover lost data from corrupted storage', 'data_recovery', 12000.00, 6),
('Hardware Diagnostics', 'Complete hardware diagnostic check', 'hardware', 1500.00, 1),
('Overheating Solution', 'Clean dust, replace thermal paste, fix cooling', 'hardware', 3500.00, 2),
('Network Setup', 'Setup wifi/router and network connectivity', 'network', 4000.00, 2),
('Keyboard Replacement', 'Replace faulty keyboard on laptop', 'hardware', 4500.00, 2),
('Software Troubleshooting', 'Fix software issues and errors', 'software', 2000.00, 1);

-- Repair Jobs
INSERT INTO repair_jobs 
(job_number, customer_id, device_id, service_id, problem_description, status, priority, estimated_cost, final_cost, received_date, target_date, completed_date, technician_notes) VALUES
('JOB-2026-0001', 1, 1, 4, 'Battery drains within 30 minutes of charge', 'completed', 'high', 6500.00, 6500.00, '2026-10-01', '2026-10-03', '2026-10-03', 'Battery replaced successfully'),
('JOB-2026-0002', 2, 2, 1, 'Screen cracked after fall, touch not working', 'in_progress', 'urgent', 8500.00, NULL, '2026-10-10', '2026-10-12', NULL, 'Waiting for replacement screen'),
('JOB-2026-0003', 3, 3, 3, 'Windows not booting, blue screen on startup', 'completed', 'medium', 3000.00, 3200.00, '2026-10-05', '2026-10-07', '2026-10-07', 'OS reinstalled, extra fee for license'),
('JOB-2026-0004', 4, 4, 7, 'Laptop overheating and shutting down randomly', 'diagnosing', 'high', 3500.00, NULL, '2026-10-14', '2026-10-16', NULL, 'Initial diagnosis: dust accumulation'),
('JOB-2026-0005', 1, 5, 5, 'Important files lost after tablet crash', 'received', 'urgent', 12000.00, NULL, '2026-10-15', '2026-10-20', NULL, 'Data recovery attempt'),
('JOB-2026-0006', 2, 6, 6, 'Printer not printing properly', 'completed', 'low', 1500.00, 1500.00, '2026-10-08', '2026-10-09', '2026-10-09', 'Cleaned print head');

-- Payments
INSERT INTO payments (job_id, amount, mode, status, transaction_ref, paid_at) VALUES
(1, 6500.00, 'card', 'paid', 'TXN-1001', '2026-10-03 10:30:00'),
(3, 3200.00, 'cash', 'paid', 'TXN-1002', '2026-10-07 15:45:00'),
(6, 1500.00, 'cash', 'paid', 'TXN-1003', '2026-10-09 11:20:00'),
(2, 8500.00, 'card', 'pending', NULL, NULL),
(4, 3500.00, 'upi', 'pending', NULL, NULL),
(5, 12000.00, 'netbanking', 'pending', NULL, NULL);