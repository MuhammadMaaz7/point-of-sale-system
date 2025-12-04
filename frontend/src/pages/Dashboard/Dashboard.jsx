/**
 * Dashboard Page
 * Overview of key metrics and quick actions
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Package,
  Repeat,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useToastContext } from '../../context/ToastContext';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import { LoadingPage } from '../../components/common/Loading/Loading';
import { formatCurrency, formatNumber } from '../../utils/formatting';
import inventoryService from '../../services/inventoryService';
import saleService from '../../services/saleService';
import rentalService from '../../services/rentalService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { error: showError } = useToastContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todaySales: 0,
    totalItems: 0,
    lowStockItems: 0,
    activeRentals: 0,
  });
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load inventory
      const items = await inventoryService.getItems();
      const lowStock = items.filter(item => item.quantity < 10);
      
      // Load sales (simplified - would need date filtering in real app)
      const sales = await saleService.getSales();
      const todaySales = sales.reduce((sum, sale) => sum + sale.total, 0);
      
      // Load active rentals
      let activeRentalsCount = 0;
      try {
        const activeRentals = await rentalService.getActiveRentals();
        activeRentalsCount = activeRentals.length;
      } catch (err) {
        console.error('Failed to load active rentals:', err);
      }
      
      setStats({
        todaySales,
        totalItems: items.length,
        lowStockItems: lowStock.length,
        activeRentals: activeRentalsCount,
      });
    } catch (err) {
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <LoadingPage message="Loading dashboard..." />;
  }
  
  const statCards = [
    {
      title: 'Today\'s Sales',
      value: formatCurrency(stats.todaySales),
      icon: DollarSign,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      trend: '+12%',
    },
    {
      title: 'Total Items',
      value: formatNumber(stats.totalItems),
      icon: Package,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Low Stock Items',
      value: formatNumber(stats.lowStockItems),
      icon: AlertCircle,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
      alert: stats.lowStockItems > 0,
    },
    {
      title: 'Active Rentals',
      value: formatNumber(stats.activeRentals),
      icon: Repeat,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
  ];
  
  const quickActions = [
    {
      title: 'New Sale',
      description: 'Process a new sale transaction',
      icon: ShoppingCart,
      color: 'primary',
      path: '/sales/new',
    },
    {
      title: 'Manage Inventory',
      description: 'View and update inventory',
      icon: Package,
      color: 'success',
      path: '/inventory',
    },
    {
      title: 'Process Rental',
      description: 'Create a new rental',
      icon: Repeat,
      color: 'warning',
      path: '/rentals/process',
    },
    {
      title: 'View Reports',
      description: 'Access sales and inventory reports',
      icon: TrendingUp,
      color: 'danger',
      path: '/reports',
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your store today.
        </p>
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} variant="elevated" padding="default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.trend && (
                  <p className="text-sm text-success-600 mt-1 flex items-center gap-1">
                    <TrendingUp size={14} />
                    {stat.trend} from yesterday
                  </p>
                )}
                {stat.alert && (
                  <p className="text-sm text-warning-600 mt-1">
                    Needs attention
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              variant="elevated"
              hoverable
              onClick={() => navigate(action.path)}
              padding="default"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-4 rounded-full bg-${action.color}-50 mb-3`}>
                  <action.icon className={`text-${action.color}-600`} size={32} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {action.description}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Go
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Low stock alert */}
      {stats.lowStockItems > 0 && (
        <Card variant="outlined" className="border-warning-300 bg-warning-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-warning-600 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="font-semibold text-warning-900 mb-1">
                Low Stock Alert
              </h3>
              <p className="text-sm text-warning-800 mb-3">
                You have {stats.lowStockItems} item(s) running low on stock. Consider restocking soon.
              </p>
              <Button
                variant="warning"
                size="sm"
                onClick={() => navigate('/inventory')}
              >
                View Inventory
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
