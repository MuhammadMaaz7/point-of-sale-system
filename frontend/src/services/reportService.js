/**
 * Report Service
 * Handles all report-related API calls
 */

import api from './api';
import { API_ENDPOINTS } from '../config/api';

const reportService = {
  /**
   * Get sales report
   */
  getSalesReport: async (startDate, endDate) => {
    const response = await api.get(API_ENDPOINTS.REPORTS.SALES, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  /**
   * Get inventory report
   */
  getInventoryReport: async () => {
    const response = await api.get(API_ENDPOINTS.REPORTS.INVENTORY);
    return response.data;
  },

  /**
   * Get rental report (Admin only)
   */
  getRentalReport: async (startDate, endDate) => {
    const response = await api.get(API_ENDPOINTS.REPORTS.RENTALS, {
      params: { startDate, endDate }
    });
    return response.data;
  }
};

export default reportService;
