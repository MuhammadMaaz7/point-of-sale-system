/**
 * Inventory Page
 * View and manage inventory items
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
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
import inventoryService from '../../services/inventoryService';

const Inventory = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthContext();
  const { success, error: showError } = useToastContext();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getItems();
      setItems(data);
    } catch (err) {
      showError('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const addValidationRules = {
    name: { required: true, requiredMessage: 'Name is required' },
    price: { required: true, requiredMessage: 'Price is required', min: 0 },
    quantity: { required: true, requiredMessage: 'Quantity is required', min: 0 },
    category: { required: true, requiredMessage: 'Category is required' },
  };

  const addForm = useForm(
    { name: '', price: '', quantity: '', category: 'General' },
    addValidationRules
  );

  const editForm = useForm(
    { name: '', price: '', quantity: '', category: '' },
    { name: { required: true }, price: { required: true, min: 0 }, quantity: { required: true, min: 0 } }
  );

  const handleAdd = async (values) => {
    setSubmitting(true);
    try {
      await inventoryService.addItem(values);
      success('Item added successfully');
      setShowAddModal(false);
      addForm.reset();
      loadItems();
    } catch (err) {
      showError(err.message || 'Failed to add item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (values) => {
    setSubmitting(true);
    try {
      await inventoryService.updateItem(selectedItem.itemId, values);
      success('Item updated successfully');
      setShowEditModal(false);
      setSelectedItem(null);
      loadItems();
    } catch (err) {
      showError(err.message || 'Failed to update item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    
    try {
      await inventoryService.deleteItem(item.itemId);
      success('Item deleted successfully');
      loadItems();
    } catch (err) {
      showError(err.message || 'Failed to delete item');
    }
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    editForm.setFieldValue('name', item.name);
    editForm.setFieldValue('price', item.price);
    editForm.setFieldValue('quantity', item.quantity);
    editForm.setFieldValue('category', item.category);
    setShowEditModal(true);
  };

  const baseColumns = [
    { key: 'itemId', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { 
      key: 'price', 
      label: 'Price',
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'quantity', 
      label: 'Stock',
      render: (value) => (
        <span className={value < 10 ? 'text-danger-600 font-semibold' : ''}>
          {value}
          {value < 10 && <AlertCircle className="inline ml-1" size={14} />}
        </span>
      )
    },
  ];

  const actionsColumn = {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    render: (_, item) => (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          icon={Edit}
          onClick={() => openEditModal(item)}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon={Trash2}
          onClick={() => handleDelete(item)}
          className="text-danger-600 hover:text-danger-700"
        >
          Delete
        </Button>
      </div>
    ),
  };

  // Only show actions column for admins
  const columns = isAdmin() ? [...baseColumns, actionsColumn] : baseColumns;

  if (loading) return <LoadingPage message="Loading inventory..." />;

  const lowStockItems = items.filter(item => item.quantity < 10);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Inventory Management</h1>
          <p className="text-gray-600 text-lg">Manage your product inventory</p>
        </div>
        {isAdmin() && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowAddModal(true)}
            className="btn-shine shadow-medium hover:shadow-strong"
          >
            Add Item
          </Button>
        )}
      </div>

      {/* Low stock alert */}
      {lowStockItems.length > 0 && (
        <Card className="bg-gradient-to-r from-warning-50 to-warning-100/50 shadow-medium border border-warning-200 animate-fade-in">
          <div className="flex items-start gap-4 p-6">
            <div className="p-3 bg-warning-100 rounded-xl">
              <AlertCircle className="text-warning-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-warning-900 mb-2 text-lg">
                Low Stock Alert
              </h3>
              <p className="text-warning-800">
                <span className="font-bold">{lowStockItems.length}</span> item(s) are running low on stock
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Inventory table */}
      <Card className="bg-white shadow-medium border border-gray-100 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <Table
          columns={columns}
          data={items}
          searchable
          sortable
          pagination
          pageSize={10}
          emptyMessage="No items in inventory"
        />
      </Card>

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Item"
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
            label="Price"
            name="price"
            type="number"
            step="0.01"
            value={addForm.values.price}
            onChange={addForm.handleChange}
            onBlur={addForm.handleBlur}
            error={addForm.touched.price && addForm.errors.price}
            required
          />
          <Input
            label="Quantity"
            name="quantity"
            type="number"
            value={addForm.values.quantity}
            onChange={addForm.handleChange}
            onBlur={addForm.handleBlur}
            error={addForm.touched.quantity && addForm.errors.quantity}
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

      {/* Edit Item Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Item"
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
            label="Price"
            name="price"
            type="number"
            step="0.01"
            value={editForm.values.price}
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
            error={editForm.touched.price && editForm.errors.price}
            required
          />
          <Input
            label="Quantity"
            name="quantity"
            type="number"
            value={editForm.values.quantity}
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
            error={editForm.touched.quantity && editForm.errors.quantity}
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
    </div>
  );
};

export default Inventory;
