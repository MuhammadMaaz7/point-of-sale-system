/**
 * Rental Controller - Handles rental-related requests
 * MySQL implementation
 */
import { getPool } from '../config/db.js';
import RentalService from '../services/RentalService.js';
import RentalRepository from '../repositories/RentalRepository.js';
import UserRepository from '../repositories/UserRepository.js';

const getRentalService = () => {
  const pool = getPool();
  const rentalRepo = new RentalRepository(pool);
  const userRepo = new UserRepository(pool);
  return new RentalService(rentalRepo, userRepo);
};

export const getRentals = async (req, res, next) => {
  try {
    const pool = getPool();
    const rentalRepo = new RentalRepository(pool);
    const rentals = await rentalRepo.findAll();
    
    res.json({
      success: true,
      data: rentals
    });
  } catch (error) {
    next(error);
  }
};

export const rentItem = async (req, res, next) => {
  try {
    const { phoneNumber, rentalId } = req.body;

    if (!phoneNumber || !rentalId) {
      return res.status(400).json({ 
        error: 'Phone number and rental ID required' 
      });
    }

    const rentalService = getRentalService();
    const rental = await rentalService.rentItem(phoneNumber, rentalId);
    
    res.status(201).json({
      success: true,
      data: rental
    });
  } catch (error) {
    next(error);
  }
};

export const returnItem = async (req, res, next) => {
  try {
    const { userRentalId } = req.params;

    const rentalService = getRentalService();
    const result = await rentalService.returnItem(userRentalId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
