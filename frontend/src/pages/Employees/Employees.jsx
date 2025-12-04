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
import { formatDate } from '../../utils/formatting';
import { useForm } from '../../hooks/useForm';
import authService from '../../services/authService';

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
    { employeeId: '', firstName: '', lastName: '', role: 'Cashier', password: '' },
    {
      employeeId: { required: true },
      firstName: { required: true },
      lastName: { required: true },
      role: { required: true },
      password: { required: true, password: true },
    }
  );

  const editForm = useForm(
    { firstName: '', lastName: '', role: '', password: '' },
    {
      firstName: { required: true },
      lastName: { required: true },
      role: { required: true },
    }
  );

  const handleAddEmployee = async (values) => {
    setSubmitting(true);
    try {
      await authService.addEmployee(values);
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
      await authService.updateEmployee(selectedEmployee.employeeId, values);
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
      key: 'createdAt', 
      label: 'Created',
      render: (value) => formatDate(value)
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
      <Card>
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
          </div>
          <Input
            label="Password"
            name="password"
            type="password"
            value={addForm.values.password}
            onChange={addForm.handleChange}
            onBlur={addForm.handleBlur}
            error={addForm.touched.password && addForm.errors.password}
            required
          />
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
