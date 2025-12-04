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
    const pool = getPool();
    const saleRepo = new SaleRepository(pool);
    
    const sales = await saleRepo.findByDateRange(startDate, endDate);
    
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const averageSale = sales.length > 0 ? totalRevenue / sales.length : 0;
    
    const report = {
      summary: {
        totalSales: sales.length,
        totalRevenue,
        averageSale
      },
      data: sales.map(sale => ({
        saleId: sale.saleId,
        date: sale.saleDate,
        employeeId: sale.employeeId,
        subtotal: sale.subtotal,
        discount: sale.discountAmount,
        total: sale.total,
        coupon: sale.couponCode || 'None'
      }))
    };
    
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
    
    const lowStockItems = items.filter(item => item.quantity < 10 && item.quantity > 0);
    const outOfStockItems = items.filter(item => item.quantity === 0);
    
    const report = {
      summary: {
        totalItems: items.length,
        totalValue: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        lowStock: lowStockItems.length,
        outOfStock: outOfStockItems.length
      },
      data: items.map(item => ({
        itemId: item.itemId,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
        totalValue: item.price * item.quantity,
        status: item.quantity === 0 ? 'Out of Stock' : item.quantity < 10 ? 'Low Stock' : 'In Stock'
      }))
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
    const activeRentals = await rentalRepo.findActiveRentals();
    
    const report = {
      summary: {
        totalItems: rentals.length,
        totalAvailable: rentals.reduce((sum, r) => sum + r.availableQuantity, 0),
        totalRented: rentals.reduce((sum, r) => sum + (r.totalQuantity - r.availableQuantity), 0),
        activeRentals: activeRentals.length
      },
      data: rentals.map(rental => ({
        rentalId: rental.rentalId,
        name: rental.name,
        category: rental.category,
        pricePerDay: rental.rentalPrice,
        totalQuantity: rental.totalQuantity,
        available: rental.availableQuantity,
        rented: rental.totalQuantity - rental.availableQuantity,
        utilization: `${Math.round(((rental.totalQuantity - rental.availableQuantity) / rental.totalQuantity) * 100)}%`
      }))
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
