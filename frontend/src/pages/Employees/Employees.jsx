/**
 * Employees Page
 * Manage employees (Admin only)
 */

import { useEffect, useState } from 'react';
import { Users, Plus, Edit, UserX } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useToastContext } from '../../context/ToastContext';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Table from '../../components/common/Table/Table';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import { LoadingPage } from '../../components/common/Loading/Loading';
import { formatDate, formatPhone } from '../../utils/formatting';
import { useForm } from '../../hooks/useForm';
import authService from '../../services/authService';

const formatDateForInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

const normalizeContactNumber = (value = '') => value.replace(/\D/g, '');

const Employees = () => {
  const { isAdmin } = useAuthContext();
  const { success, error: showError } = useToastContext();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      showError('Admin access required');
      return;
    }
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const employees = await authService.getAllEmployees();
      setEmployees(employees);
    } catch (err) {
      showError(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const addForm = useForm(
    { 
      employeeId: '', 
      firstName: '', 
      lastName: '', 
      contactNumber: '', 
      email: '',
      position: '',
      department: '',
      role: 'Cashier', 
      dateOfJoining: '',
      password: '' 
    },
    {
      employeeId: { required: true },
      firstName: { required: true },
      lastName: { required: true },
      role: { required: true },
      contactNumber: { required: true, custom: (value) => {
        const cleaned = value.replace(/\D/g, '');
        return cleaned.length === 10 ? '' : 'Contact number must be 10 digits';
      }},
      email: { required: true, email: true },
      position: { required: true },
      department: { required: true },
      dateOfJoining: { required: true, custom: (value) => isNaN(Date.parse(value)) ? 'Invalid date' : '' },
      password: { required: true, password: true },
    }
  );

  const editForm = useForm(
    { 
      firstName: '', 
      lastName: '', 
      contactNumber: '',
      email: '',
      position: '',
      department: '',
      role: '', 
      dateOfJoining: '',
      password: '' 
    },
    {
      firstName: { required: true },
      lastName: { required: true },
      role: { required: true },
      contactNumber: { required: true, custom: (value) => {
        const cleaned = value.replace(/\D/g, '');
        return cleaned.length === 10 ? '' : 'Contact number must be 10 digits';
      }},
      email: { required: true, email: true },
      position: { required: true },
      department: { required: true },
      dateOfJoining: { required: true, custom: (value) => isNaN(Date.parse(value)) ? 'Invalid date' : '' },
    }
  );

  const handleAddEmployee = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        contactNumber: normalizeContactNumber(values.contactNumber)
      };
      await authService.addEmployee(payload);
      success('Employee added successfully');
      setShowAddModal(false);
      addForm.reset();
      loadEmployees();
    } catch (err) {
      showError(err.message || 'Failed to add employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEmployee = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        contactNumber: normalizeContactNumber(values.contactNumber)
      };
      if (!payload.password) {
        delete payload.password;
      }
      await authService.updateEmployee(selectedEmployee.employeeId, payload);
      success('Employee updated successfully');
      setShowEditModal(false);
      setSelectedEmployee(null);
      loadEmployees();
    } catch (err) {
      showError(err.message || 'Failed to update employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (employee) => {
    if (!window.confirm(`Deactivate ${employee.firstName} ${employee.lastName}?`)) return;
    
    try {
      await authService.deactivateEmployee(employee.employeeId);
      success('Employee deactivated successfully');
      loadEmployees();
    } catch (err) {
      showError(err.message || 'Failed to deactivate employee');
    }
  };

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    editForm.setFieldValue('firstName', employee.firstName);
    editForm.setFieldValue('lastName', employee.lastName);
    editForm.setFieldValue('role', employee.role);
    editForm.setFieldValue('contactNumber', employee.contactNumber || '');
    editForm.setFieldValue('email', employee.email || '');
    editForm.setFieldValue('position', employee.position || '');
    editForm.setFieldValue('department', employee.department || '');
    editForm.setFieldValue('dateOfJoining', formatDateForInput(employee.dateOfJoining));
    setShowEditModal(true);
  };

  const columns = [
    { key: 'employeeId', label: 'Employee ID' },
    { 
      key: 'name', 
      label: 'Name',
      render: (_, emp) => `${emp.firstName} ${emp.lastName}`
    },
    {
      key: 'contactNumber',
      label: 'Contact',
      render: (value) => formatPhone(value) || value
    },
    { key: 'email', label: 'Email' },
    { key: 'position', label: 'Position' },
    { key: 'department', label: 'Department' },
    { 
      key: 'dateOfJoining', 
      label: 'Date Joined',
      render: (value) => formatDate(value)
    },
    { 
      key: 'role', 
      label: 'Role',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          value === 'Admin' 
            ? 'bg-primary-100 text-primary-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          value 
            ? 'bg-success-100 text-success-700' 
            : 'bg-danger-100 text-danger-700'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, employee) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => openEditModal(employee)}
          >
            Edit
          </Button>
          {employee.isActive && (
            <Button
              variant="ghost"
              size="sm"
              icon={UserX}
              onClick={() => handleDeactivate(employee)}
              className="text-danger-600 hover:text-danger-700"
            >
              Deactivate
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <LoadingPage message="Loading employees..." />;

  if (!isAdmin()) {
    return (
      <Card>
        <div className="text-center py-12">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">Admin access required</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-1">Manage employee accounts</p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowAddModal(true)}
        >
          Add Employee
        </Button>
      </div>

      {/* Employees table */}
      <Card className="bg-white shadow-medium border border-gray-100 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <Table
          columns={columns}
          data={employees}
          searchable
          sortable
          pagination
          pageSize={10}
          emptyMessage="No employees found"
        />
      </Card>

      {/* Add Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Employee"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={submitting}
              onClick={addForm.handleSubmit(handleAddEmployee)}
            >
              Add Employee
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Employee ID"
              name="employeeId"
              value={addForm.values.employeeId}
              onChange={addForm.handleChange}
              onBlur={addForm.handleBlur}
              error={addForm.touched.employeeId && addForm.errors.employeeId}
              required
            />
            <Input
              label="Date of Joining"
              name="dateOfJoining"
              type="date"
              value={addForm.values.dateOfJoining}
              onChange={addForm.handleChange}
              onBlur={addForm.handleBlur}
              error={addForm.touched.dateOfJoining && addForm.errors.dateOfJoining}
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={addForm.values.firstName}
              onChange={addForm.handleChange}
              onBlur={addForm.handleBlur}
              error={addForm.touched.firstName && addForm.errors.firstName}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={addForm.values.lastName}
              onChange={addForm.handleChange}
              onBlur={addForm.handleBlur}
              error={addForm.touched.lastName && addForm.errors.lastName}
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Contact Number"
              name="contactNumber"
              type="tel"
              value={addForm.values.contactNumber}
              onChange={addForm.handleChange}
              onBlur={addForm.handleBlur}
              error={addForm.touched.contactNumber && addForm.errors.contactNumber}
              placeholder="e.g. 5551234567"
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={addForm.values.email}
              onChange={addForm.handleChange}
              onBlur={addForm.handleBlur}
              error={addForm.touched.email && addForm.errors.email}
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Position"
              name="position"
              value={addForm.values.position}
              onChange={addForm.handleChange}
              onBlur={addForm.handleBlur}
              error={addForm.touched.position && addForm.errors.position}
              required
            />
            <Input
              label="Department"
              name="department"
              value={addForm.values.department}
              onChange={addForm.handleChange}
              onBlur={addForm.handleBlur}
              error={addForm.touched.department && addForm.errors.department}
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-danger-500">*</span>
              </label>
              <select
                name="role"
                value={addForm.values.role}
                onChange={addForm.handleChange}
                onBlur={addForm.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="Cashier">Cashier</option>
                <option value="Admin">Admin</option>
              </select>
              {addForm.touched.role && addForm.errors.role && (
                <p className="mt-1 text-sm text-danger-600">{addForm.errors.role}</p>
              )}
            </div>
            <Input
              label="Temporary Password"
              name="password"
              type="password"
              value={addForm.values.password}
              onChange={addForm.handleChange}
              onBlur={addForm.handleBlur}
              error={addForm.touched.password && addForm.errors.password}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Employee"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={submitting}
              onClick={editForm.handleSubmit(handleEditEmployee)}
            >
              Update Employee
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={editForm.values.firstName}
              onChange={editForm.handleChange}
              onBlur={editForm.handleBlur}
              error={editForm.touched.firstName && editForm.errors.firstName}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={editForm.values.lastName}
              onChange={editForm.handleChange}
              onBlur={editForm.handleBlur}
              error={editForm.touched.lastName && editForm.errors.lastName}
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Contact Number"
              name="contactNumber"
              type="tel"
              value={editForm.values.contactNumber}
              onChange={editForm.handleChange}
              onBlur={editForm.handleBlur}
              error={editForm.touched.contactNumber && editForm.errors.contactNumber}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={editForm.values.email}
              onChange={editForm.handleChange}
              onBlur={editForm.handleBlur}
              error={editForm.touched.email && editForm.errors.email}
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Position"
              name="position"
              value={editForm.values.position}
              onChange={editForm.handleChange}
              onBlur={editForm.handleBlur}
              error={editForm.touched.position && editForm.errors.position}
              required
            />
            <Input
              label="Department"
              name="department"
              value={editForm.values.department}
              onChange={editForm.handleChange}
              onBlur={editForm.handleBlur}
              error={editForm.touched.department && editForm.errors.department}
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-danger-500">*</span>
              </label>
              <select
                name="role"
                value={editForm.values.role}
                onChange={editForm.handleChange}
                onBlur={editForm.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="Cashier">Cashier</option>
                <option value="Admin">Admin</option>
              </select>
              {editForm.touched.role && editForm.errors.role && (
                <p className="mt-1 text-sm text-danger-600">{editForm.errors.role}</p>
              )}
            </div>
            <Input
              label="Date of Joining"
              name="dateOfJoining"
              type="date"
              value={editForm.values.dateOfJoining}
              onChange={editForm.handleChange}
              onBlur={editForm.handleBlur}
              error={editForm.touched.dateOfJoining && editForm.errors.dateOfJoining}
              required
            />
          </div>
          <Input
            label="New Password (optional)"
            name="password"
            type="password"
            value={editForm.values.password}
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
            error={editForm.touched.password && editForm.errors.password}
            placeholder="Leave blank to keep current password"
          />
        </form>
      </Modal>
    </div>
  );
};

export default Employees;
