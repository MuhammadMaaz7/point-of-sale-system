/**
 * Report Controller - Handles reporting requests
 * MySQL implementation
 */
import { getPool } from '../config/db.js';
import ReportService from '../services/ReportService.js';
import SaleRepository from '../repositories/SaleRepository.js';
import ItemRepository from '../repositories/ItemRepository.js';
import RentalRepository from '../repositories/RentalRepository.js';

const getReportService = () => {
  const pool = getPool();
  const saleRepo = new SaleRepository(pool);
  return new ReportService(saleRepo);
};

export const getTopSellingItems = async (req, res, next) => {
  try {
    const limit = req.query.limit || 10;
    const reportService = getReportService();
    const items = await reportService.getTopSellingItems(limit);
    
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

export const getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const reportService = getReportService();
    const report = await reportService.getSalesReport(startDate, endDate);
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getInventoryReport = async (req, res, next) => {
  try {
    const pool = getPool();
    const itemRepo = new ItemRepository(pool);
    const items = await itemRepo.findAll();
    
    const report = {
      totalItems: items.length,
      totalValue: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      lowStockItems: items.filter(item => item.quantity < 10),
      items: items
    };
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getRentalReport = async (req, res, next) => {
  try {
    const pool = getPool();
    const rentalRepo = new RentalRepository(pool);
    const rentals = await rentalRepo.findAll();
    
    const report = {
      totalRentals: rentals.length,
      totalAvailable: rentals.reduce((sum, r) => sum + r.availableQuantity, 0),
      totalRented: rentals.reduce((sum, r) => sum + (r.totalQuantity - r.availableQuantity), 0),
      rentals: rentals
    };
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeePerformance = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const reportService = getReportService();
    const performance = await reportService.getEmployeePerformance(
      startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate || new Date()
    );
    
    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    next(error);
  }
};
