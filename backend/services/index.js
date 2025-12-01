/**
 * Service Layer Index
 * Centralized export of all services for easy importing
 * MySQL implementation with ESM
 */

import AuthService from './AuthService.js';
import InventoryService from './InventoryService.js';
import RentalService from './RentalService.js';
import SaleService from './SaleService.js';
import ReportService from './ReportService.js';
import CouponService from './CouponService.js';
import UserService from './UserService.js';

export {
  AuthService,
  InventoryService,
  RentalService,
  SaleService,
  ReportService,
  CouponService,
  UserService
};

export default {
  AuthService,
  InventoryService,
  RentalService,
  SaleService,
  ReportService,
  CouponService,
  UserService
};
