/**
 * Reports Page
 * View sales, inventory, and rental reports
 */

import { useState } from 'react';
import { BarChart3, Download, Calendar } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useToastContext } from '../../context/ToastContext';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Table from '../../components/common/Table/Table';
import { formatCurrency, formatDate } from '../../utils/formatting';
import reportService from '../../services/reportService';

const Reports = () => {
  const { isAdmin } = useAuthContext();
  const { success, error: showError } = useToastContext();
  const [activeTab, setActiveTab] = useState('sales');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadSalesReport = async () => {
    setLoading(true);
    try {
      const data = await reportService.getSalesReport(startDate, endDate);
      setReportData(data);
      success('Sales report loaded');
    } catch (err) {
      showError('Failed to load sales report');
    } finally {
      setLoading(false);
    }
  };

  const loadInventoryReport = async () => {
    setLoading(true);
    try {
      const data = await reportService.getInventoryReport();
      setReportData(data);
      success('Inventory report loaded');
    } catch (err) {
      showError('Failed to load inventory report');
    } finally {
      setLoading(false);
    }
  };

  const loadRentalReport = async () => {
    if (!isAdmin()) {
      showError('Admin access required');
      return;
    }
    setLoading(true);
    try {
      const data = await reportService.getRentalReport(startDate, endDate);
      setReportData(data);
      success('Rental report loaded');
    } catch (err) {
      showError('Failed to load rental report');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    setReportData(null);
    switch (activeTab) {
      case 'sales':
        loadSalesReport();
        break;
      case 'inventory':
        loadInventoryReport();
        break;
      case 'rentals':
        loadRentalReport();
        break;
      default:
        break;
    }
  };

  const handleExport = () => {
    if (!reportData || !reportData.data || reportData.data.length === 0) {
      showError('No data to export');
      return;
    }

    try {
      // Convert data to CSV
      const headers = Object.keys(reportData.data[0]);
      const csvContent = [
        headers.join(','),
        ...reportData.data.map(row =>
          headers.map(header => {
            const value = row[header];
            // Escape commas and quotes in values
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${activeTab}_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      success('Report exported successfully');
    } catch (err) {
      showError('Failed to export report');
    }
  };

  const tabs = [
    { id: 'sales', label: 'Sales Report', roles: ['Admin', 'Cashier'] },
    { id: 'inventory', label: 'Inventory Report', roles: ['Admin', 'Cashier'] },
    { id: 'rentals', label: 'Rental Report', roles: ['Admin'] },
  ];

  const filteredTabs = tabs.filter(tab => 
    tab.roles.includes(isAdmin() ? 'Admin' : 'Cashier')
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Generate and view business reports</p>
      </div>

      {/* Tabs */}
      <Card padding="none">
        <div className="border-b border-gray-200">
          <div className="flex">
            {filteredTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setReportData(null);
                }}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Date Range Filter */}
          {(activeTab === 'sales' || activeTab === 'rentals') && (
            <div className="flex gap-4 mb-6">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                icon={Calendar}
              />
              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                icon={Calendar}
              />
            </div>
          )}

          {/* Generate Button */}
          <div className="flex gap-2 mb-6">
            <Button
              variant="primary"
              icon={BarChart3}
              onClick={handleGenerateReport}
              loading={loading}
            >
              Generate Report
            </Button>
            {reportData && (
              <Button
                variant="outline"
                icon={Download}
                onClick={handleExport}
              >
                Export CSV
              </Button>
            )}
          </div>

          {/* Report Content */}
          {reportData && (
            <div className="space-y-6">
              {/* Summary Cards */}
              {activeTab === 'sales' && reportData.summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card variant="elevated">
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {reportData.summary.totalSales || 0}
                    </p>
                  </Card>
                  <Card variant="elevated">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-success-600 mt-1">
                      {formatCurrency(reportData.summary.totalRevenue || 0)}
                    </p>
                  </Card>
                  <Card variant="elevated">
                    <p className="text-sm text-gray-600">Average Sale</p>
                    <p className="text-2xl font-bold text-primary-600 mt-1">
                      {formatCurrency(reportData.summary.averageSale || 0)}
                    </p>
                  </Card>
                </div>
              )}

              {activeTab === 'inventory' && reportData.summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card variant="elevated">
                    <p className="text-sm text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {reportData.summary.totalItems || 0}
                    </p>
                  </Card>
                  <Card variant="elevated">
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-success-600 mt-1">
                      {formatCurrency(reportData.summary.totalValue || 0)}
                    </p>
                  </Card>
                  <Card variant="elevated">
                    <p className="text-sm text-gray-600">Low Stock</p>
                    <p className="text-2xl font-bold text-warning-600 mt-1">
                      {reportData.summary.lowStock || 0}
                    </p>
                  </Card>
                  <Card variant="elevated">
                    <p className="text-sm text-gray-600">Out of Stock</p>
                    <p className="text-2xl font-bold text-danger-600 mt-1">
                      {reportData.summary.outOfStock || 0}
                    </p>
                  </Card>
                </div>
              )}

              {/* Data Table */}
              {reportData.data && reportData.data.length > 0 && (
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Detailed Data
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          {Object.keys(reportData.data[0]).map(key => (
                            <th key={key} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reportData.data.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            {Object.entries(row).map(([key, value], i) => (
                              <td key={i} className="px-4 py-3 text-sm text-gray-900">
                                {typeof value === 'number' && key.toLowerCase().includes('price') || key.toLowerCase().includes('total')
                                  ? formatCurrency(value)
                                  : value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* Empty State */}
              {(!reportData.data || reportData.data.length === 0) && (
                <Card>
                  <p className="text-center text-gray-500 py-8">
                    No data available for the selected period
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* Initial State */}
          {!reportData && !loading && (
            <Card variant="outlined" className="border-dashed">
              <div className="text-center py-12">
                <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">
                  Click "Generate Report" to view {activeTab} data
                </p>
              </div>
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Reports;
