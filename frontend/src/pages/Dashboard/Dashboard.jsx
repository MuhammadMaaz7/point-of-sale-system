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
      path: '/rentals',
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
    <div className="space-y-8">
      {/* Welcome message */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-gradient mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600 text-lg">
          Here's what's happening with your store today.
        </p>
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card 
            key={index} 
            className="animate-scale-in bg-white shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between p-6">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-3">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                {stat.trend && (
                  <div className="flex items-center gap-1 text-sm font-medium text-success-600">
                    <TrendingUp size={16} />
                    <span>{stat.trend}</span>
                    <span className="text-gray-500 font-normal">from yesterday</span>
                  </div>
                )}
                {stat.alert && (
                  <div className="flex items-center gap-1 text-sm font-medium text-warning-600 animate-pulse-soft">
                    <AlertCircle size={16} />
                    <span>Needs attention</span>
                  </div>
                )}
              </div>
              <div className={`p-4 rounded-2xl ${stat.bgColor} shadow-soft`}>
                <stat.icon className={stat.color} size={28} />
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Quick actions */}
      <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="group cursor-pointer bg-white shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              onClick={() => navigate(action.path)}
            >
              <div className="flex flex-col items-center text-center p-6">
                <div className={`p-5 rounded-2xl bg-gradient-to-br from-${action.color}-50 to-${action.color}-100 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-soft`}>
                  <action.icon className={`text-${action.color}-600`} size={36} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {action.description}
                </p>
                <div className="flex items-center gap-2 text-primary-600 font-medium text-sm group-hover:gap-3 transition-all">
                  <span>Get Started</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Low stock alert */}
      {stats.lowStockItems > 0 && (
        <Card className="animate-slide-up border-warning-200 bg-gradient-to-r from-warning-50 to-warning-100/50 shadow-medium" style={{ animationDelay: '600ms' }}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-warning-100 rounded-xl">
              <AlertCircle className="text-warning-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-warning-900 mb-2 text-lg">
                Low Stock Alert
              </h3>
              <p className="text-warning-800 mb-4">
                You have <span className="font-bold">{stats.lowStockItems}</span> item(s) running low on stock. Consider restocking soon to avoid stockouts.
              </p>
              <Button
                variant="warning"
                size="sm"
                onClick={() => navigate('/inventory')}
                className="btn-shine shadow-soft hover:shadow-medium"
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
