/**
 * Sale Service
 * Handles all sale-related API calls
 */

import api from './api';
import { API_ENDPOINTS } from '../config/api';

const saleService = {
  /**
   * Create a new sale
   */
  createSale: async (items, couponCode = null) => {
    const response = await api.post(API_ENDPOINTS.SALES.BASE, {
      items,
      couponCode
    });
    return response.data;
  },

  /**
   * Get all sales
   */
  getSales: async () => {
    const response = await api.get(API_ENDPOINTS.SALES.BASE);
    return response.data;
  },

  /**
   * Get sale by ID
   */
  getSale: async (id) => {
    const response = await api.get(API_ENDPOINTS.SALES.BY_ID(id));
    return response.data;
  },

  /**
   * Process a return
   */
  processReturn: async (saleId, itemId, quantity, reason = '') => {
    const response = await api.post(API_ENDPOINTS.SALES.RETURNS, {
      saleId,
      itemId,
      quantity,
      reason
    });
    return response.data;
  },

  /**
   * Get active coupons
   */
  getActiveCoupons: async () => {
    const response = await api.get('/coupons/active');
    return response.data;
  }
};

export default saleService;
