-- Add 'clerk' to UserRole enum
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'clerk';
