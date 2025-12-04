/**
 * Coupons Page
 * Manage discount coupons (Admin only)
 */

import { useEffect, useState } from 'react';
import { Ticket, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useToastContext } from '../../context/ToastContext';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Table from '../../components/common/Table/Table';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import { LoadingPage } from '../../components/common/Loading/Loading';
import { formatCurrency, formatDate } from '../../utils/formatting';
import { useForm } from '../../hooks/useForm';
import api from '../../services/api';

const Coupons = () => {
  const { isAdmin } = useAuthContext();
  const { success, error: showError } = useToastContext();
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      showError('Admin access required');
      return;
    }
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const response = await api.get('/coupons');
      setCoupons(response.data);
    } catch (err) {
      showError('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const addForm = useForm(
    { 
      couponCode: '', 
      discountType: 'percentage', 
      discountValue: '', 
      minPurchaseAmount: '0',
      maxDiscountAmount: '',
      expirationDate: '',
      usageLimit: '0'
    },
    {
      couponCode: { required: true },
      discountValue: { required: true, min: 0 },
    }
  );

  const editForm = useForm(
    { 
      discountType: '', 
      discountValue: '', 
      minPurchaseAmount: '',
      maxDiscountAmount: '',
      expirationDate: '',
      usageLimit: ''
    },
    {
      discountValue: { required: true, min: 0 },
    }
  );

  const handleAdd = async (values) => {
    setSubmitting(true);
    try {
      await api.post('/coupons', values);
      success('Coupon created successfully');
      setShowAddModal(false);
      addForm.reset();
      loadCoupons();
    } catch (err) {
      showError(err.message || 'Failed to create coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (values) => {
    setSubmitting(true);
    try {
      await api.put(`/coupons/${selectedCoupon.couponCode}`, values);
      success('Coupon updated successfully');
      setShowEditModal(false);
      setSelectedCoupon(null);
      loadCoupons();
    } catch (err) {
      showError(err.message || 'Failed to update coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm(`Delete coupon ${coupon.couponCode}?`)) return;
    
    try {
      await api.delete(`/coupons/${coupon.couponCode}`);
      success('Coupon deleted successfully');
      loadCoupons();
    } catch (err) {
      showError(err.message || 'Failed to delete coupon');
    }
  };

  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    editForm.setFieldValue('discountType', coupon.discountType);
    editForm.setFieldValue('discountValue', coupon.discountValue);
    editForm.setFieldValue('minPurchaseAmount', coupon.minPurchaseAmount);
    editForm.setFieldValue('maxDiscountAmount', coupon.maxDiscountAmount || '');
    editForm.setFieldValue('expirationDate', coupon.expirationDate ? coupon.expirationDate.split('T')[0] : '');
    editForm.setFieldValue('usageLimit', coupon.usageLimit);
    setShowEditModal(true);
  };

  const columns = [
    { key: 'couponCode', label: 'Code' },
    { 
      key: 'discountType', 
      label: 'Type',
      render: (value) => value === 'percentage' ? 'Percentage' : 'Fixed Amount'
    },
    { 
      key: 'discountValue', 
      label: 'Value',
      render: (value, row) => row.discountType === 'percentage' ? `${value}%` : formatCurrency(value)
    },
    { 
      key: 'minPurchaseAmount', 
      label: 'Min Purchase',
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'expirationDate', 
      label: 'Expires',
      render: (value) => value ? formatDate(value) : 'No expiration'
    },
    { 
      key: 'usageCount', 
      label: 'Usage',
      render: (value, row) => `${value}${row.usageLimit > 0 ? ` / ${row.usageLimit}` : ''}`
    },
    { 
      key: 'isValid', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          value ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, coupon) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => openEditModal(coupon)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => handleDelete(coupon)}
            className="text-danger-600 hover:text-danger-700"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingPage message="Loading coupons..." />;

  if (!isAdmin()) {
    return (
      <Card>
        <div className="text-center py-12">
          <Ticket className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">Admin access required</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-600 mt-1">Manage discount coupons</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>
          Add Coupon
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={coupons}
          searchable
          sortable
          pagination
          pageSize={10}
          emptyMessage="No coupons found"
        />
      </Card>

      {/* Add Coupon Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Coupon"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={submitting}
              onClick={addForm.handleSubmit(handleAdd)}
            >
              Create Coupon
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Coupon Code"
            name="couponCode"
            value={addForm.values.couponCode}
            onChange={addForm.handleChange}
            onBlur={addForm.handleBlur}
            error={addForm.touched.couponCode && addForm.errors.couponCode}
            placeholder="e.g., SAVE20"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type <span className="text-danger-500">*</span>
            </label>
            <select
              name="discountType"
              value={addForm.values.discountType}
              onChange={addForm.handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
          <Input
            label="Discount Value"
            name="discountValue"
            type="number"
            step="0.01"
            value={addForm.values.discountValue}
            onChange={addForm.handleChange}
            onBlur={addForm.handleBlur}
            error={addForm.touched.discountValue && addForm.errors.discountValue}
            placeholder={addForm.values.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 10.00'}
            required
          />
          <Input
            label="Minimum Purchase Amount"
            name="minPurchaseAmount"
            type="number"
            step="0.01"
            value={addForm.values.minPurchaseAmount}
            onChange={addForm.handleChange}
            onBlur={addForm.handleBlur}
            placeholder="0.00"
          />
          <Input
            label="Maximum Discount Amount (Optional)"
            name="maxDiscountAmount"
            type="number"
            step="0.01"
            value={addForm.values.maxDiscountAmount}
            onChange={addForm.handleChange}
            onBlur={addForm.handleBlur}
            placeholder="Leave empty for no limit"
          />
          <Input
            label="Expiration Date (Optional)"
            name="expirationDate"
            type="date"
            value={addForm.values.expirationDate}
            onChange={addForm.handleChange}
            onBlur={addForm.handleBlur}
          />
          <Input
            label="Usage Limit"
            name="usageLimit"
            type="number"
            value={addForm.values.usageLimit}
            onChange={addForm.handleChange}
            onBlur={addForm.handleBlur}
            placeholder="0 for unlimited"
          />
        </form>
      </Modal>

      {/* Edit Coupon Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Coupon"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={submitting}
              onClick={editForm.handleSubmit(handleEdit)}
            >
              Update Coupon
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Coupon Code</p>
            <p className="font-semibold text-gray-900">{selectedCoupon?.couponCode}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type <span className="text-danger-500">*</span>
            </label>
            <select
              name="discountType"
              value={editForm.values.discountType}
              onChange={editForm.handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
          <Input
            label="Discount Value"
            name="discountValue"
            type="number"
            step="0.01"
            value={editForm.values.discountValue}
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
            error={editForm.touched.discountValue && editForm.errors.discountValue}
            required
          />
          <Input
            label="Minimum Purchase Amount"
            name="minPurchaseAmount"
            type="number"
            step="0.01"
            value={editForm.values.minPurchaseAmount}
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
          />
          <Input
            label="Maximum Discount Amount (Optional)"
            name="maxDiscountAmount"
            type="number"
            step="0.01"
            value={editForm.values.maxDiscountAmount}
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
          />
          <Input
            label="Expiration Date (Optional)"
            name="expirationDate"
            type="date"
            value={editForm.values.expirationDate}
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
          />
          <Input
            label="Usage Limit"
            name="usageLimit"
            type="number"
            value={editForm.values.usageLimit}
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
          />
        </form>
      </Modal>
    </div>
  );
};

export default Coupons;
