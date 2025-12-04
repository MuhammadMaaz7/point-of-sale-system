/**
 * Inventory Service
 * Handles all inventory-related API calls
 */

import api from './api';
import { API_ENDPOINTS } from '../config/api';

const inventoryService = {
  /**
   * Get all items
   */
  getItems: async () => {
    const response = await api.get(API_ENDPOINTS.INVENTORY.BASE);
    return response.data;
  },

  /**
   * Get item by ID
   */
  getItem: async (id) => {
    const response = await api.get(API_ENDPOINTS.INVENTORY.BY_ID(id));
    return response.data;
  },

  /**
   * Add new item (Admin only)
   */
  addItem: async (itemData) => {
    const response = await api.post(API_ENDPOINTS.INVENTORY.BASE, itemData);
    return response.data;
  },

  /**
   * Update item (Admin only)
   */
  updateItem: async (id, itemData) => {
    const response = await api.put(API_ENDPOINTS.INVENTORY.BY_ID(id), itemData);
    return response.data;
  },

  /**
   * Delete item (Admin only)
   */
  deleteItem: async (id) => {
    const response = await api.delete(API_ENDPOINTS.INVENTORY.BY_ID(id));
    return response.data;
  }
};

export default inventoryService;
