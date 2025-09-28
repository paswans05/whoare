CREATE DATABASE IF NOT EXISTS whoare;

USE whoare;

CREATE TABLE faces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  file_path TEXT NOT NULL,
  status ENUM('pending','processed','error','no_face') DEFAULT 'pending',
  embedding JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
