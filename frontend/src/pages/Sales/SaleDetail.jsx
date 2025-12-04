/**
 * Sale Detail Page
 * View details of a specific sale
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Package, DollarSign } from 'lucide-react';
import { useToastContext } from '../../context/ToastContext';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import { LoadingPage } from '../../components/common/Loading/Loading';
import { formatCurrency, formatDate } from '../../utils/formatting';
import saleService from '../../services/saleService';

const SaleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { error: showError } = useToastContext();
  const [loading, setLoading] = useState(true);
  const [sale, setSale] = useState(null);

  useEffect(() => {
    loadSale();
  }, [id]);

  const loadSale = async () => {
    try {
      setLoading(true);
      const data = await saleService.getSale(id);
      setSale(data);
    } catch (err) {
      showError('Failed to load sale details');
      navigate('/sales');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage message="Loading sale details..." />;

  if (!sale) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sale Not Found</h2>
        <p className="text-gray-600 mb-4">The sale you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/sales')}>Back to Sales</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/sales')}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Sale #{sale.saleId}
            </h1>
            <p className="text-gray-600 mt-1">
              {formatDate(sale.saleDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Sale Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sale Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium text-gray-900">
                  {formatDate(sale.saleDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Employee</p>
                <p className="font-medium text-gray-900">
                  {sale.employeeId}
                </p>
              </div>
            </div>
            {sale.userId && (
              <div className="flex items-center gap-3">
                <User className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium text-gray-900">
                    {sale.userId}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Summary */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(sale.subtotal)}
              </span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-success-600">
                  -{formatCurrency(sale.discount)}
                </span>
              </div>
            )}
            {sale.couponCode && (
              <div className="flex justify-between">
                <span className="text-gray-600">Coupon</span>
                <span className="font-medium text-gray-900">
                  {sale.couponCode}
                </span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-primary-600">
                {formatCurrency(sale.total)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package size={20} />
          Items ({sale.items?.length || 0})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Item
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  Quantity
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sale.items?.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.itemName || item.itemId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SaleDetail;
