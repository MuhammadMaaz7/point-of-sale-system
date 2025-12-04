/**
 * Rentals Page
 * Manage rental items and process rentals/returns
 */

import { useEffect, useState } from 'react';
import { Plus, Package, RotateCcw, Edit, Trash2 } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useToastContext } from '../../context/ToastContext';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Table from '../../components/common/Table/Table';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import { LoadingPage } from '../../components/common/Loading/Loading';
import { formatCurrency } from '../../utils/formatting';
import { useForm } from '../../hooks/useForm';
import rentalService from '../../services/rentalService';

const Rentals = () => {
  const { isAdmin } = useAuthContext();
  const { success, error: showError } = useToastContext();
  const [loading, setLoading] = useState(true);
  const [rentals, setRentals] = useState([]);
  const [activeRentals, setActiveRentals] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [selectedRental, setSelectedRental] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' or 'active'

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      setLoading(true);
      const data = await rentalService.getRentals();
      setRentals(data);
      await loadActiveRentals();
    } catch (err) {
      showError('Failed to load rentals');
    } finally {
      setLoading(false);
    }
  };

  const loadActiveRentals = async () => {
    try {
      const data = await rentalService.getActiveRentals();
      setActiveRentals(data);
    } catch (err) {
      console.error('Failed to load active rentals:', err);
      // Don't show error toast, just log it
    }
  };

  const addForm = useForm(
    { name: '', rentalPrice: '', totalQuantity: '', category: 'General' },
    {
      name: { required: true },
      rentalPrice: { required: true, min: 0 },
      totalQuantity: { required: true, min: 1 },
    }
  );

  const editForm = useForm(
    { name: '', rentalPrice: '', totalQuantity: '', category: '' },
    {
      name: { required: true },
      rentalPrice: { required: true, min: 0 },
      totalQuantity: { required: true, min: 1 },
    }
  );

  const processForm = useForm(
    { phoneNumber: '', rentalId: '', quantity: '1' },
    {
      phoneNumber: { required: true, phone: true },
      rentalId: { required: true },
      quantity: { required: true, min: 1 },
    }
  );

  const returnForm = useForm(
    { phoneNumber: '' },
    { phoneNumber: { required: true, phone: true } }
  );

  const handleAddRental = async (values) => {
    setSubmitting(true);
    try {
      await rentalService.addRental({
        ...values,
        availableQuantity: values.totalQuantity,
      });
      success('Rental item added successfully');
      setShowAddModal(false);
      addForm.reset();
      loadRentals();
    } catch (err) {
      showError(err.message || 'Failed to add rental item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditRental = async (values) => {
    setSubmitting(true);
    try {
      await rentalService.updateRental(selectedRental.rentalId, {
        ...values,
        availableQuantity: values.totalQuantity,
      });
      success('Rental item updated successfully');
      setShowEditModal(false);
      setSelectedRental(null);
      loadRentals();
    } catch (err) {
      showError(err.message || 'Failed to update rental item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (rental) => {
    if (!window.confirm(`Delete ${rental.name}? This action cannot be undone.`)) return;
    
    try {
      await rentalService.deleteRental(rental.rentalId);
      success('Rental item deleted successfully');
      loadRentals();
    } catch (err) {
      showError(err.message || 'Failed to delete rental item');
    }
  };

  const openEditModal = (rental) => {
    setSelectedRental(rental);
    editForm.setFieldValue('name', rental.name);
    editForm.setFieldValue('rentalPrice', rental.rentalPrice);
    editForm.setFieldValue('totalQuantity', rental.totalQuantity);
    editForm.setFieldValue('category', rental.category);
    setShowEditModal(true);
  };

  const handleProcessRental = async (values) => {
    setSubmitting(true);
    try {
      const result = await rentalService.processRental(values.phoneNumber, [
        { rentalId: values.rentalId, quantity: parseInt(values.quantity) }
      ]);
      
      // Show receipt
      setReceiptData({
        type: 'rental',
        ...result
      });
      setShowReceiptModal(true);
      
      success('Rental processed successfully');
      setShowProcessModal(false);
      processForm.reset();
      
      // Reload both rentals and active rentals
      await loadRentals();
      await loadActiveRentals();
    } catch (err) {
      showError(err.message || 'Failed to process rental');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProcessReturn = async (values) => {
    setSubmitting(true);
    try {
      // Get outstanding rentals for this user
      const outstanding = await rentalService.getOutstandingRentals(values.phoneNumber);
      
      if (outstanding.length === 0) {
        showError('No outstanding rentals for this phone number');
        setSubmitting(false);
        return;
      }

      // Process return for all outstanding items
      const result = await rentalService.processReturn(
        values.phoneNumber,
        outstanding.map(r => ({ rentalId: r.rentalId, quantity: r.quantity || 1 }))
      );
      
      // Show receipt
      setReceiptData({
        type: 'return',
        ...result
      });
      setShowReceiptModal(true);
      
      success('Return processed successfully');
      setShowReturnModal(false);
      returnForm.reset();
      
      // Reload both rentals and active rentals
      await loadRentals();
      await loadActiveRentals();
    } catch (err) {
      showError(err.message || 'Failed to process return');
    } finally {
      setSubmitting(false);
    }
  };

  const baseColumns = [
    { key: 'rentalId', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { 
      key: 'rentalPrice', 
      label: 'Price/Day',
      render: (value) => formatCurrency(value)
    },
    { key: 'totalQuantity', label: 'Total' },
    { 
      key: 'availableQuantity', 
      label: 'Available',
      render: (value, row) => (
        <span className={value === 0 ? 'text-danger-600 font-semibold' : ''}>
          {value} / {row.totalQuantity}
        </span>
      )
    },
  ];

  const actionsColumn = {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    render: (_, rental) => (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          icon={Edit}
          onClick={() => openEditModal(rental)}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon={Trash2}
          onClick={() => handleDelete(rental)}
          className="text-danger-600 hover:text-danger-700"
        >
          Delete
        </Button>
      </div>
    ),
  };

  // Only show actions column for admins
  const columns = isAdmin() ? [...baseColumns, actionsColumn] : baseColumns;

  const activeRentalColumns = [
    { key: 'id', label: 'Rental #' },
    { key: 'phoneNumber', label: 'Customer' },
    { key: 'rentalName', label: 'Item' },
    { 
      key: 'rentalDate', 
      label: 'Rented On',
      render: (value) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'dueDate', 
      label: 'Due Date',
      render: (value) => {
        const due = new Date(value);
        const isOverdue = due < new Date();
        return (
          <span className={isOverdue ? 'text-danger-600 font-semibold' : ''}>
            {due.toLocaleDateString()}
            {isOverdue && ' (Overdue)'}
          </span>
        );
      }
    },
    { 
      key: 'lateFee', 
      label: 'Late Fee',
      render: (value) => value > 0 ? formatCurrency(value) : '-'
    },
  ];

  if (loading) return <LoadingPage message="Loading rentals..." />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Rental Management</h1>
          <p className="text-gray-600 text-lg">Manage rental items and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="success"
            icon={Package}
            onClick={() => setShowProcessModal(true)}
            className="shadow-soft hover:shadow-medium"
          >
            Process Rental
          </Button>
          <Button
            variant="warning"
            icon={RotateCcw}
            onClick={() => setShowReturnModal(true)}
            className="shadow-soft hover:shadow-medium"
          >
            Process Return
          </Button>
          {isAdmin() && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setShowAddModal(true)}
              className="btn-shine shadow-medium hover:shadow-strong"
            >
              Add Rental Item
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'catalog'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Rental Catalog
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'active'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Active Rentals ({activeRentals.length})
        </button>
      </div>

      {/* Rental Catalog Table */}
      {activeTab === 'catalog' && (
        <Card className="bg-white shadow-medium border border-gray-100 animate-fade-in">
          <Table
            columns={columns}
            data={rentals}
            searchable
            sortable
            pagination
            pageSize={10}
            emptyMessage="No rental items available"
          />
        </Card>
      )}

      {/* Active Rentals Table */}
      {activeTab === 'active' && (
        <Card className="bg-white shadow-medium border border-gray-100 animate-fade-in">
          <Table
            columns={activeRentalColumns}
            data={activeRentals}
            searchable
            sortable
            pagination
            pageSize={10}
            emptyMessage="No active rentals"
          />
        </Card>
      )}

      {/* Add Rental Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Rental Item"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={submitting}
              onClick={addForm.handleSubmit(handleAddRental)}
            >
              Add Item
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={addForm.values.name}
            onChange={addForm.handleChange}
            onBlur={addForm.handleBlur}
            error={addForm.touched.name && addForm.errors.name}
            required
          />
          <Input
            label="Price per Day"
            name="rentalPrice"
            type="number"
            step="0.01"
            value={addForm.values.rentalPrice}
            onChange={addForm.handleChange}
            onBlur={addForm.handleBlur}
            error={addForm.touched.rentalPrice && addForm.errors.rentalPrice}
            required
          />
          <Input
            label="Total Quantity"
            name="totalQuantity"
            type="number"
            value={addForm.values.totalQuantity}
            onChange={addForm.handleChange}
            onBlur={addForm.handleBlur}
            error={addForm.touched.totalQuantity && addForm.errors.totalQuantity}
            required
          />
          <Input
            label="Category"
            name="category"
            value={addForm.values.category}
            onChange={addForm.handleChange}
            onBlur={addForm.handleBlur}
            error={addForm.touched.category && addForm.errors.category}
            required
          />
        </form>
      </Modal>

      {/* Edit Rental Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Rental Item"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={submitting}
              onClick={editForm.handleSubmit(handleEditRental)}
            >
              Update Item
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={editForm.values.name}
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
            error={editForm.touched.name && editForm.errors.name}
            required
          />
          <Input
            label="Price per Day"
            name="rentalPrice"
            type="number"
            step="0.01"
            value={editForm.values.rentalPrice}
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
            error={editForm.touched.rentalPrice && editForm.errors.rentalPrice}
            required
          />
          <Input
            label="Total Quantity"
            name="totalQuantity"
            type="number"
            value={editForm.values.totalQuantity}
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
            error={editForm.touched.totalQuantity && editForm.errors.totalQuantity}
            required
          />
          <Input
            label="Category"
            name="category"
            value={editForm.values.category}
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
            error={editForm.touched.category && editForm.errors.category}
            required
          />
        </form>
      </Modal>

      {/* Process Rental Modal */}
      <Modal
        isOpen={showProcessModal}
        onClose={() => setShowProcessModal(false)}
        title="Process Rental"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowProcessModal(false)}>
              Cancel
            </Button>
            <Button
              variant="success"
              loading={submitting}
              onClick={processForm.handleSubmit(handleProcessRental)}
            >
              Process Rental
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Customer Phone Number"
            name="phoneNumber"
            type="tel"
            placeholder="5551234567 (10 digits, no account needed)"
            value={processForm.values.phoneNumber}
            onChange={processForm.handleChange}
            onBlur={processForm.handleBlur}
            error={processForm.touched.phoneNumber && processForm.errors.phoneNumber}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rental Item <span className="text-danger-500">*</span>
            </label>
            <select
              name="rentalId"
              value={processForm.values.rentalId}
              onChange={processForm.handleChange}
              onBlur={processForm.handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select item...</option>
              {rentals.filter(r => r.availableQuantity > 0).map(rental => (
                <option key={rental.rentalId} value={rental.rentalId}>
                  {rental.name} - {formatCurrency(rental.rentalPrice)}/day (Available: {rental.availableQuantity})
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Quantity"
            name="quantity"
            type="number"
            min="1"
            value={processForm.values.quantity}
            onChange={processForm.handleChange}
            onBlur={processForm.handleBlur}
            error={processForm.touched.quantity && processForm.errors.quantity}
            required
          />
          <div className="bg-primary-50 p-3 rounded-lg text-sm text-primary-900">
            <p className="font-medium">Rental Period: 14 days</p>
            <p className="text-xs mt-1">Late fee: 10% per day after due date</p>
          </div>
        </form>
      </Modal>

      {/* Process Return Modal */}
      <Modal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        title="Process Return"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowReturnModal(false)}>
              Cancel
            </Button>
            <Button
              variant="warning"
              loading={submitting}
              onClick={returnForm.handleSubmit(handleProcessReturn)}
            >
              Process Return
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Customer Phone Number"
            name="phoneNumber"
            type="tel"
            placeholder="5551234567"
            value={returnForm.values.phoneNumber}
            onChange={returnForm.handleChange}
            onBlur={returnForm.handleBlur}
            error={returnForm.touched.phoneNumber && returnForm.errors.phoneNumber}
            required
          />
          <div className="bg-warning-50 p-3 rounded-lg text-sm text-warning-900">
            <p className="font-medium">Note:</p>
            <p className="text-xs mt-1">
              All outstanding rentals for this customer will be returned.
              Late fees will be calculated automatically.
            </p>
          </div>
        </form>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        title={receiptData?.type === 'rental' ? 'Rental Receipt' : 'Return Receipt'}
        size="lg"
      >
        {receiptData && (
          <div className="space-y-4">
            {/* Customer Info */}
            <div className="border-b pb-3">
              <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
              <p className="text-sm text-gray-600">
                Phone: {receiptData.phoneNumber}
              </p>
              {receiptData.type === 'rental' && (
                <>
                  <p className="text-sm text-gray-600">
                    Rental Date: {new Date(receiptData.rentalDate).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Due Date: {new Date(receiptData.dueDate).toLocaleString()}
                  </p>
                </>
              )}
              {receiptData.type === 'return' && (
                <p className="text-sm text-gray-600">
                  Return Date: {new Date(receiptData.returnDate).toLocaleString()}
                </p>
              )}
            </div>

            {/* Items */}
            <div className="border-b pb-3">
              <h3 className="font-semibold text-gray-900 mb-2">Items</h3>
              <div className="space-y-2">
                {receiptData.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      {receiptData.type === 'rental' && (
                        <p className="text-xs text-gray-500">
                          {formatCurrency(item.rentalPrice)}/day × {item.quantity} × 14 days
                        </p>
                      )}
                      {receiptData.type === 'return' && item.daysLate > 0 && (
                        <p className="text-xs text-danger-600">
                          {item.daysLate} days late
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {receiptData.type === 'rental' && (
                        <p className="font-medium text-gray-900">
                          {formatCurrency(item.totalPrice)}
                        </p>
                      )}
                      {receiptData.type === 'return' && item.lateFee > 0 && (
                        <p className="font-medium text-danger-600">
                          Late Fee: {formatCurrency(item.lateFee)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-2">
              {receiptData.type === 'rental' && (
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-primary-600">
                    {formatCurrency(receiptData.totalAmount)}
                  </span>
                </div>
              )}
              {receiptData.type === 'return' && receiptData.totalLateFees > 0 && (
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Late Fees:</span>
                  <span className="text-danger-600">
                    {formatCurrency(receiptData.totalLateFees)}
                  </span>
                </div>
              )}
              {receiptData.type === 'return' && receiptData.totalLateFees === 0 && (
                <div className="text-center text-success-600 font-semibold">
                  ✓ Returned on time - No late fees
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t">
              <Button
                variant="primary"
                onClick={() => setShowReceiptModal(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Rentals;
