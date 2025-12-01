/**
 * Report Controller - Handles reporting requests
 * MySQL implementation
 */
import { getPool } from '../config/db.js';
import ReportService from '../services/ReportService.js';
import SaleRepository from '../repositories/SaleRepository.js';

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
