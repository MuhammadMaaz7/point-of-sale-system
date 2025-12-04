/**
 * Rental Service
 * Handles all rental-related API calls
 */

import api from './api';
import { API_ENDPOINTS } from '../config/api';

const rentalService = {
  /**
   * Get all rentals
   */
  getRentals: async () => {
    const response = await api.get(API_ENDPOINTS.RENTALS.BASE);
    return response.data;
  },

  /**
   * Get rental by ID
   */
  getRental: async (id) => {
    const response = await api.get(API_ENDPOINTS.RENTALS.BY_ID(id));
    return response.data;
  },

  /**
   * Add new rental (Admin only)
   */
  addRental: async (rentalData) => {
    const response = await api.post(API_ENDPOINTS.RENTALS.BASE, rentalData);
    return response.data;
  },

  /**
   * Update rental (Admin only)
   */
  updateRental: async (id, rentalData) => {
    const response = await api.put(API_ENDPOINTS.RENTALS.BY_ID(id), rentalData);
    return response.data;
  },

  /**
   * Delete rental (Admin only)
   */
  deleteRental: async (id) => {
    const response = await api.delete(API_ENDPOINTS.RENTALS.BY_ID(id));
    return response.data;
  },

  /**
   * Process rental transaction
   */
  processRental: async (phoneNumber, items) => {
    const response = await api.post(API_ENDPOINTS.RENTALS.PROCESS, {
      phoneNumber,
      items
    });
    return response.data;
  },

  /**
   * Process rental return
   */
  processReturn: async (phoneNumber, items) => {
    const response = await api.post(API_ENDPOINTS.RENTALS.RETURN, {
      phoneNumber,
      items
    });
    return response.data;
  },

  /**
   * Get outstanding rentals for a phone number
   */
  getOutstandingRentals: async (phoneNumber) => {
    const response = await api.get(API_ENDPOINTS.RENTALS.OUTSTANDING, {
      params: { phoneNumber }
    });
    return response.data;
  },

  /**
   * Get rental history for a user
   */
  getRentalHistory: async (userId) => {
    const response = await api.get(API_ENDPOINTS.RENTALS.HISTORY(userId));
    return response.data;
  },

  /**
   * Get all active rentals (not yet returned)
   */
  getActiveRentals: async () => {
    const response = await api.get('/rentals/active');
    return response.data;
  }
};

export default rentalService;
