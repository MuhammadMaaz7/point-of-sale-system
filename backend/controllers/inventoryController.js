/**
 * Inventory Controller - Handles inventory management requests
 * MySQL implementation
 */
import { getPool } from '../config/db.js';
import InventoryService from '../services/InventoryService.js';
import ItemRepository from '../repositories/ItemRepository.js';

const getInventoryService = () => {
  const pool = getPool();
  const itemRepo = new ItemRepository(pool);
  return new InventoryService(itemRepo);
};

export const getItems = async (req, res, next) => {
  try {
    const inventoryService = getInventoryService();
    const items = await inventoryService.getAllItems();
    
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

export const addItem = async (req, res, next) => {
  try {
    const inventoryService = getInventoryService();
    const item = await inventoryService.addItem(req.body);
    
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const updateItemQuantity = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const inventoryService = getInventoryService();
    const item = await inventoryService.updateItemQuantity(itemId, quantity);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const getItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const pool = getPool();
    const itemRepo = new ItemRepository(pool);
    const item = await itemRepo.findById(itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const pool = getPool();
    const itemRepo = new ItemRepository(pool);
    const item = await itemRepo.update(itemId, req.body);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const pool = getPool();
    const itemRepo = new ItemRepository(pool);
    await itemRepo.delete(itemId);
    
    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getLowStock = async (req, res, next) => {
  try {
    const threshold = req.query.threshold || 10;
    const inventoryService = getInventoryService();
    const items = await inventoryService.getLowStockItems(threshold);
    
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    next(error);
  }
};
