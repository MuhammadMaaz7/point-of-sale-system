-- Migration script to add passwordHash column to users table
-- Run this if you have an existing database

USE pos_db;

-- Add passwordHash column to users table if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS passwordHash VARCHAR(255) NULL;

-- Show the updated table structure
DESCRIBE users;
