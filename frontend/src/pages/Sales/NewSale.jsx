/**
 * New Sale Page
 * Point of Sale interface for processing sales
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Tag, CreditCard } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuthContext } from '../../context/AuthContext';
import { useToastContext } from '../../context/ToastContext';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Modal from '../../components/common/Modal/Modal';
import { LoadingPage } from '../../components/common/Loading/Loading';
import { formatCurrency } from '../../utils/formatting';
import inventoryService from '../../services/inventoryService';
import saleService from '../../services/saleService';

const NewSale = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { success, error: showError } = useToastContext();
  const { items: cartItems, addItem, updateQuantity, removeItem, clearCart, getSubtotal, getTax, getTotal } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getItems();
      setItems(data.filter(item => item.isActive && item.quantity > 0));
    } catch (err) {
      showError('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    if (item.quantity <= 0) {
      showError('Item out of stock');
      return;
    }
    
    const cartItem = cartItems.find(ci => ci.itemId === item.itemId);
    if (cartItem && cartItem.quantity >= item.quantity) {
      showError('Not enough stock');
      return;
    }
    
    addItem({
      itemId: item.itemId,
      name: item.name,
      price: item.price,
      quantity: 1,
    });
    success(`${item.name} added to cart`);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const item = items.find(i => i.itemId === itemId);
    if (newQuantity > item.quantity) {
      showError('Not enough stock');
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  const handleApplyCoupon = () => {
    // Simplified coupon logic - in real app, validate with backend
    if (couponCode === 'SAVE10') {
      setDiscount(getSubtotal() * 0.10);
      success('Coupon applied: 10% off');
    } else if (couponCode === 'SAVE20') {
      setDiscount(getSubtotal() * 0.20);
      success('Coupon applied: 20% off');
    } else {
      showError('Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showError('Cart is empty');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleCompleteSale = async () => {
    setProcessing(true);
    try {
      const saleData = {
        items: cartItems.map(item => ({
          itemId: item.itemId,
          quantity: item.quantity,
        })),
        couponCode: couponCode || null,
      };
      
      const sale = await saleService.createSale(saleData.items, saleData.couponCode);
      success('Sale completed successfully!');
      clearCart();
      setCouponCode('');
      setDiscount(0);
      setShowPaymentModal(false);
      navigate('/sales');
    } catch (err) {
      showError(err.message || 'Failed to process sale');
    } finally {
      setProcessing(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemId.includes(searchTerm)
  );

  if (loading) return <LoadingPage message="Loading items..." />;

  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal(discount);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Items Grid */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.itemId}
              hoverable
              onClick={() => handleAddToCart(item)}
              className="cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <p className="text-lg font-bold text-primary-600 mt-2">
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Stock: {item.quantity}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card>
            <p className="text-center text-gray-500 py-8">No items found</p>
          </Card>
        )}
      </div>

      {/* Cart */}
      <div className="space-y-4">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart size={24} className="text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Cart</h2>
            <span className="ml-auto text-sm text-gray-600">
              {cartItems.length} items
            </span>
          </div>

          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Cart is empty</p>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.itemId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.itemId, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.itemId, item.quantity + 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.itemId)}
                    className="p-1 text-danger-600 hover:bg-danger-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Coupon */}
        {cartItems.length > 0 && (
          <Card>
            <div className="flex gap-2">
              <Input
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                icon={Tag}
              />
              <Button variant="outline" onClick={handleApplyCoupon}>
                Apply
              </Button>
            </div>
          </Card>
        )}

        {/* Total */}
        {cartItems.length > 0 && (
          <Card>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Tax (6%):</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon={CreditCard}
              onClick={handleCheckout}
              className="mt-4"
            >
              Checkout
            </Button>
          </Card>
        )}
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Complete Payment"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
            <Button
              variant="success"
              loading={processing}
              onClick={handleCompleteSale}
            >
              Complete Sale
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success-600">
                <span>Discount:</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Click "Complete Sale" to process the transaction.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default NewSale;
