/**
 * EmployeeLog Model - Audit trail for employee actions
 * MySQL implementation
 * Eliminates data smell: Structured logging with action types
 */
class EmployeeLog {
  static ACTIONS = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    SALE: 'SALE',
    RENTAL: 'RENTAL',
    RETURN: 'RETURN',
    EMPLOYEE_CREATED: 'EMPLOYEE_CREATED',
    EMPLOYEE_UPDATED: 'EMPLOYEE_UPDATED',
    EMPLOYEE_DEACTIVATED: 'EMPLOYEE_DEACTIVATED',
    ITEM_ADDED: 'ITEM_ADDED',
    ITEM_UPDATED: 'ITEM_UPDATED',
    RENTAL_ADDED: 'RENTAL_ADDED',
    RENTAL_UPDATED: 'RENTAL_UPDATED'
  };

  constructor(data = {}) {
    this.logId = data.logId || null;
    this.employeeId = data.employeeId || null;
    this.action = data.action || null;
    this.details = data.details || null;
    this.timestamp = data.timestamp || null;
  }

  // Validation
  validate() {
    if (!this.employeeId) {
      throw new Error('Employee ID is required');
    }
    if (!this.action) {
      throw new Error('Action is required');
    }
    const validActions = Object.values(EmployeeLog.ACTIONS);
    if (!validActions.includes(this.action)) {
      throw new Error(`${this.action} is not a valid action`);
    }
    if (this.details && this.details.length > 500) {
      throw new Error('Details cannot exceed 500 characters');
    }
  }

  // Static method to get action types
  static getActions() {
    return EmployeeLog.ACTIONS;
  }

  // Convert to plain object
  toJSON() {
    return {
      logId: this.logId,
      employeeId: this.employeeId,
      action: this.action,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

export default EmployeeLog;
