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
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    loadItems();
    loadCoupons();
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

  const loadCoupons = async () => {
    try {
      const response = await saleService.getActiveCoupons();
      setCoupons(response);
    } catch (err) {
      console.error('Failed to load coupons:', err);
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
    if (!selectedCoupon) {
      showError('Please select a coupon');
      return;
    }

    const coupon = coupons.find(c => c.couponCode === selectedCoupon);
    if (!coupon) {
      showError('Invalid coupon');
      return;
    }

    const subtotal = getSubtotal();

    // Check minimum purchase amount
    if (subtotal < coupon.minPurchaseAmount) {
      showError(`Minimum purchase of ${formatCurrency(coupon.minPurchaseAmount)} required`);
      return;
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = subtotal * (coupon.discountValue / 100);
    } else {
      discountAmount = coupon.discountValue;
    }

    // Apply max discount limit if set
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }

    setDiscount(discountAmount);
    setAppliedCoupon(coupon);
    success(`Coupon applied: ${coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue)} off`);
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setSelectedCoupon('');
    success('Coupon removed');
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
        couponCode: appliedCoupon?.couponCode || null,
      };
      
      const sale = await saleService.createSale(saleData.items, saleData.couponCode);
      success('Sale completed successfully!');
      clearCart();
      setSelectedCoupon('');
      setAppliedCoupon(null);
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

  // Filter coupons based on current subtotal - only show coupons where min purchase is met
  const availableCoupons = coupons.filter(coupon => subtotal >= coupon.minPurchaseAmount);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Items Grid */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="bg-white shadow-medium border border-gray-100">
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
              onClick={() => handleAddToCart(item)}
              className="cursor-pointer bg-white shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border border-gray-100"
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
          <Card className="bg-white shadow-medium border border-gray-100">
            <p className="text-center text-gray-500 py-8">No items found</p>
          </Card>
        )}
      </div>

      {/* Cart */}
      <div className="space-y-4">
        <Card className="bg-white shadow-medium border border-gray-100 sticky top-4">
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
          <Card className="bg-white shadow-medium border border-gray-100">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Apply Discount Coupon
              </label>
              {!appliedCoupon ? (
                <>
                  <div className="flex gap-2">
                    <select
                      value={selectedCoupon}
                      onChange={(e) => setSelectedCoupon(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={availableCoupons.length === 0}
                    >
                      <option value="">
                        {availableCoupons.length === 0 
                          ? 'No coupons available for current total' 
                          : 'Select a coupon'}
                      </option>
                      {availableCoupons.map((coupon) => (
                        <option key={coupon.couponCode} value={coupon.couponCode}>
                          {coupon.couponCode} - {coupon.discountType === 'percentage' 
                            ? `${coupon.discountValue}% off` 
                            : `${formatCurrency(coupon.discountValue)} off`}
                          {coupon.minPurchaseAmount > 0 && ` (Min: ${formatCurrency(coupon.minPurchaseAmount)})`}
                        </option>
                      ))}
                    </select>
                    <Button 
                      variant="outline" 
                      onClick={handleApplyCoupon}
                      disabled={availableCoupons.length === 0}
                    >
                      Apply
                    </Button>
                  </div>
                  {availableCoupons.length === 0 && coupons.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Add more items to unlock available coupons
                    </p>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-between p-3 bg-success-50 border border-success-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-success-600" />
                    <span className="font-medium text-success-900">{appliedCoupon.couponCode}</span>
                    <span className="text-sm text-success-700">
                      ({appliedCoupon.discountType === 'percentage' 
                        ? `${appliedCoupon.discountValue}%` 
                        : formatCurrency(appliedCoupon.discountValue)} off)
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-success-600 hover:text-success-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Total */}
        {cartItems.length > 0 && (
          <Card className="bg-white shadow-medium border border-gray-100">
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
