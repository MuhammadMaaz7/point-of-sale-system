/**
 * Sidebar Component
 * Navigation sidebar with menu items
 */

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Repeat,
  BarChart3,
  Users,
  Ticket,
  X,
} from 'lucide-react';
import { useAuthContext } from '../../../context/AuthContext';
import { ROLES } from '../../../config/constants';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuthContext();
  
  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      roles: [ROLES.ADMIN, ROLES.CASHIER],
    },
    {
      label: 'Sales',
      icon: ShoppingCart,
      path: '/sales',
      roles: [ROLES.ADMIN, ROLES.CASHIER],
    },
    {
      label: 'Inventory',
      icon: Package,
      path: '/inventory',
      roles: [ROLES.ADMIN, ROLES.CASHIER],
    },
    {
      label: 'Rentals',
      icon: Repeat,
      path: '/rentals',
      roles: [ROLES.ADMIN, ROLES.CASHIER],
    },
    {
      label: 'Reports',
      icon: BarChart3,
      path: '/reports',
      roles: [ROLES.ADMIN, ROLES.CASHIER],
    },
    {
      label: 'Employees',
      icon: Users,
      path: '/employees',
      roles: [ROLES.ADMIN],
    },
    {
      label: 'Coupons',
      icon: Ticket,
      path: '/coupons',
      roles: [ROLES.ADMIN],
    },
  ];
  
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close button (mobile only) */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {filteredMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              POS System v1.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
