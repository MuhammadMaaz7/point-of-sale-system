/**
 * Profile Page
 * View user profile information
 */

import { User, Mail, Phone, Briefcase, Calendar, Shield } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import Card from '../../components/common/Card/Card';
import { formatDate, formatPhone } from '../../utils/formatting';

const Profile = () => {
  const { user } = useAuthContext();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex items-start gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <User size={48} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">{user?.firstName} {user?.lastName}</h2>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user?.role === 'Admin' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-success-100 text-success-700'
              }`}>
                {user?.role}
              </span>
              <span className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium flex items-center gap-1">
                <Shield size={14} />
                Active
              </span>
            </div>
            <p className="text-gray-600">Employee ID: {user?.employeeId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Briefcase className="text-primary-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Position</p>
              <p className="font-semibold text-gray-900">{user?.position || 'Not specified'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Shield className="text-primary-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-semibold text-gray-900">{user?.department || 'Not specified'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
            <div className="p-3 bg-success-100 rounded-lg">
              <Calendar className="text-success-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Date of Joining</p>
              <p className="font-semibold text-gray-900">
                {user?.dateOfJoining ? formatDate(user.dateOfJoining) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Mail className="text-primary-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-900">{user?.email || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="p-3 bg-success-100 rounded-lg">
              <Phone className="text-success-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold text-gray-900">
                {user?.contactNumber ? formatPhone(user.contactNumber) : 'Not provided'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Additional Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Employee ID</span>
            <span className="font-semibold text-gray-900">{user?.employeeId}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Full Name</span>
            <span className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Role</span>
            <span className="font-semibold text-gray-900">{user?.role}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Position</span>
            <span className="font-semibold text-gray-900">{user?.position || 'Not specified'}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Department</span>
            <span className="font-semibold text-gray-900">{user?.department || 'Not specified'}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Date of Joining</span>
            <span className="font-semibold text-gray-900">
              {user?.dateOfJoining ? formatDate(user.dateOfJoining) : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Contact Number</span>
            <span className="font-semibold text-gray-900">
              {user?.contactNumber ? formatPhone(user.contactNumber) : 'Not provided'}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Email</span>
            <span className="font-semibold text-gray-900">{user?.email || 'Not provided'}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600">Account Status</span>
            <span className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-semibold">
              Active
            </span>
          </div>
        </div>
      </Card>
      
      {/* Info Note */}
      <Card className="bg-primary-50 border-primary-200">
        <div className="flex gap-3">
          <Shield className="text-primary-600 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm text-primary-900 font-medium mb-1">Profile Management</p>
            <p className="text-sm text-primary-700">
              To update your profile information or change your password, please contact your administrator.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
