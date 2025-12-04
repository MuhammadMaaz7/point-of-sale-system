/**
 * Sales Page
 * View all sales transactions
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import { useToastContext } from '../../context/ToastContext';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Table from '../../components/common/Table/Table';
import { LoadingPage } from '../../components/common/Loading/Loading';
import { formatCurrency, formatDate } from '../../utils/formatting';
import saleService from '../../services/saleService';

const Sales = () => {
  const navigate = useNavigate();
  const { error: showError } = useToastContext();
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      const data = await saleService.getSales();
      setSales(data);
    } catch (err) {
      showError('Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'saleId', label: 'Sale ID' },
    { 
      key: 'saleDate', 
      label: 'Date',
      render: (value) => formatDate(value, true)
    },
    { key: 'employeeId', label: 'Employee' },
    { 
      key: 'subtotal', 
      label: 'Subtotal',
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'taxAmount', 
      label: 'Tax',
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'total', 
      label: 'Total',
      render: (value) => <span className="font-semibold">{formatCurrency(value)}</span>
    },
    {
      key: 'couponCode',
      label: 'Coupon',
      render: (value) => value || '-'
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, sale) => (
        <Button
          variant="ghost"
          size="sm"
          icon={Eye}
          onClick={() => navigate(`/sales/${sale.saleId}`)}
        >
          View
        </Button>
      ),
    },
  ];

  if (loading) return <LoadingPage message="Loading sales..." />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Sales Transactions</h1>
          <p className="text-gray-600 text-lg">View and manage all sales</p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => navigate('/sales/new')}
          className="btn-shine shadow-medium hover:shadow-strong"
        >
          New Sale
        </Button>
      </div>

      {/* Sales table */}
      <Card className="bg-white shadow-medium border border-gray-100 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <Table
          columns={columns}
          data={sales}
          searchable
          sortable
          pagination
          pageSize={10}
          emptyMessage="No sales found"
        />
      </Card>
    </div>
  );
};

export default Sales;
