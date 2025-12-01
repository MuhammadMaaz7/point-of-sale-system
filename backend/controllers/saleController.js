/**
 * Sale Controller - Handles sale-related requests
 * MySQL implementation
 */
import { getPool } from '../config/db.js';
import SaleService from '../services/SaleService.js';
import SaleRepository from '../repositories/SaleRepository.js';
import ItemRepository from '../repositories/ItemRepository.js';
import CouponRepository from '../repositories/CouponRepository.js';

const getSaleService = () => {
  const pool = getPool();
  const saleRepo = new SaleRepository(pool);
  const itemRepo = new ItemRepository(pool);
  const couponRepo = new CouponRepository(pool);
  return new SaleService(saleRepo, itemRepo, couponRepo);
};

export const createSale = async (req, res, next) => {
  try {
    const { cartItems, couponCode } = req.body;
    const employeeId = req.employee.employeeId;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart cannot be empty' });
    }

    const saleService = getSaleService();
    const sale = await saleService.processSale(
      employeeId,
      cartItems,
      couponCode
    );

    res.status(201).json({
      success: true,
      data: sale
    });
  } catch (error) {
    next(error);
  }
};

export const getSales = async (req, res, next) => {
  try {
    const pool = getPool();
    const saleRepo = new SaleRepository(pool);
    const sales = await saleRepo.findAll();

    res.json({
      success: true,
      data: sales
    });
  } catch (error) {
    next(error);
  }
};
