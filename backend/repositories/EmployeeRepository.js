/**
 * EmployeeRepository - Data access layer for employees
 * MySQL implementation
 */
import BaseRepository from './BaseRepository.js';
import Employee from '../models/Employee.js';

class EmployeeRepository extends BaseRepository {
  async findAll() {
    const query = 'SELECT * FROM employees WHERE isActive = 1';
    const [rows] = await this.pool.execute(query);
    return rows.map(row => new Employee(row));
  }

  async findById(employeeId) {
    const query = 'SELECT * FROM employees WHERE employeeId = ?';
    const [rows] = await this.pool.execute(query, [employeeId]);
    return rows.length > 0 ? new Employee(rows[0]) : null;
  }

  async findByIdWithPassword(employeeId) {
    const query = 'SELECT * FROM employees WHERE employeeId = ?';
    const [rows] = await this.pool.execute(query, [employeeId]);
    return rows.length > 0 ? new Employee(rows[0]) : null;
  }

  async create(employeeData) {
    const employee = new Employee(employeeData);
    employee.validate();
    
    const query = `INSERT INTO employees (employeeId, role, firstName, lastName, passwordHash) 
                   VALUES (?, ?, ?, ?, ?)`;
    await this.pool.execute(query, [
      employee.employeeId,
      employee.role,
      employee.firstName,
      employee.lastName,
      employee.passwordHash
    ]);
    
    return this.findById(employee.employeeId);
  }

  async update(employeeId, data) {
    const fields = [];
    const values = [];
    
    if (data.role) {
      fields.push('role = ?');
      values.push(data.role);
    }
    if (data.firstName) {
      fields.push('firstName = ?');
      values.push(data.firstName);
    }
    if (data.lastName) {
      fields.push('lastName = ?');
      values.push(data.lastName);
    }
    if (data.passwordHash) {
      fields.push('passwordHash = ?');
      values.push(data.passwordHash);
    }
    if (data.isActive !== undefined) {
      fields.push('isActive = ?');
      values.push(data.isActive);
    }
    
    fields.push('updatedAt = NOW()');
    values.push(employeeId);
    
    const query = `UPDATE employees SET ${fields.join(', ')} WHERE employeeId = ?`;
    await this.pool.execute(query, values);
    
    return this.findById(employeeId);
  }

  async delete(employeeId) {
    const query = 'UPDATE employees SET isActive = 0, updatedAt = NOW() WHERE employeeId = ?';
    await this.pool.execute(query, [employeeId]);
    return true;
  }
}

export default EmployeeRepository;
