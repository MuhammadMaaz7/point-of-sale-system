/**
 * Settings Page
 * Application settings and preferences
 */

import { Settings as SettingsIcon, Info, Shield, Building } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import Card from '../../components/common/Card/Card';

const Settings = () => {
  const { user } = useAuthContext();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Application information and system details</p>
      </div>

      {/* Application Info */}
      <Card>
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-primary-100 rounded-xl">
            <Building size={24} className="text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Point of Sale System</h2>
            <p className="text-sm text-gray-600">Modern retail management solution</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Version</p>
            <p className="font-semibold text-gray-900">1.0.0</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Environment</p>
            <p className="font-semibold text-gray-900">Production</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Database</p>
            <p className="font-semibold text-gray-900">MySQL</p>
          </div> */}
          <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Your Role</p>
            <p className="font-semibold text-gray-900">{user?.role}</p>
          </div>
        </div>
      </Card>

      {/* System Features */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Features</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Sales Management</p>
              <p className="text-sm text-gray-600">Process sales and manage transactions</p>
            </div>
            <span className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Inventory Control</p>
              <p className="text-sm text-gray-600">Track and manage product inventory</p>
            </div>
            <span className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Rental Management</p>
              <p className="text-sm text-gray-600">Handle rental transactions and returns</p>
            </div>
            <span className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Discount Coupons</p>
              <p className="text-sm text-gray-600">Create and manage promotional coupons</p>
            </div>
            <span className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Reports & Analytics</p>
              <p className="text-sm text-gray-600">Generate business insights and reports</p>
            </div>
            <span className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
        </div>
      </Card>

      {/* Security Info */}
      <Card className="bg-primary-50 border-primary-200">
        <div className="flex gap-3">
          <Shield className="text-primary-600 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm text-primary-900 font-medium mb-1">Security & Access</p>
            <p className="text-sm text-primary-700">
              Your account is protected with role-based access control. Contact your administrator for password changes or permission updates.
            </p>
          </div>
        </div>
      </Card>

      {/* Info Note */}
      <Card className="bg-gray-50 border-gray-200">
        <div className="flex gap-3">
          <Info className="text-gray-600 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm text-gray-900 font-medium mb-1">Need Help?</p>
            <p className="text-sm text-gray-700">
              For technical support or feature requests, please contact your system administrator.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
