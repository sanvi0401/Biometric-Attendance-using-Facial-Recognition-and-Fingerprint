import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, Calendar, MapPin, Building, Save } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    birthdate: '1990-05-15',
    address: '123 Main St, Anytown, ST 12345',
    department: 'Engineering',
    position: 'Software Developer',
    joiningDate: '2020-03-15',
    employeeId: 'EMP001',
  });
  
  const [editing, setEditing] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the profile data to the server
    setEditing(false);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">My Profile</h1>
        <p className="text-neutral-500">View and edit your personal information</p>
      </div>
      
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold mr-4">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">{profile.name}</h2>
              <p className="text-neutral-600">{profile.position} | {profile.department}</p>
              <p className="text-sm text-neutral-500">Employee ID: {profile.employeeId}</p>
            </div>
          </div>
          
          <button
            className="btn-outline mt-4 md:mt-0"
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-800 mb-2">Personal Information</h3>
              
              <div>
                <label className="label flex items-center">
                  <User className="w-4 h-4 mr-2 text-neutral-500" />
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="input"
                  />
                ) : (
                  <p className="py-2 px-3 bg-neutral-50 rounded-md">{profile.name}</p>
                )}
              </div>
              
              <div>
                <label className="label flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-neutral-500" />
                  Email Address
                </label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="input"
                  />
                ) : (
                  <p className="py-2 px-3 bg-neutral-50 rounded-md">{profile.email}</p>
                )}
              </div>
              
              <div>
                <label className="label flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-neutral-500" />
                  Phone Number
                </label>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="input"
                  />
                ) : (
                  <p className="py-2 px-3 bg-neutral-50 rounded-md">{profile.phone}</p>
                )}
              </div>
              
              <div>
                <label className="label flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-neutral-500" />
                  Date of Birth
                </label>
                {editing ? (
                  <input
                    type="date"
                    name="birthdate"
                    value={profile.birthdate}
                    onChange={handleChange}
                    className="input"
                  />
                ) : (
                  <p className="py-2 px-3 bg-neutral-50 rounded-md">
                    {new Date(profile.birthdate).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <div>
                <label className="label flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-neutral-500" />
                  Address
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    className="input"
                  />
                ) : (
                  <p className="py-2 px-3 bg-neutral-50 rounded-md">{profile.address}</p>
                )}
              </div>
            </div>
            
            {/* Employment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-800 mb-2">Employment Information</h3>
              
              <div>
                <label className="label flex items-center">
                  <Building className="w-4 h-4 mr-2 text-neutral-500" />
                  Department
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="department"
                    value={profile.department}
                    onChange={handleChange}
                    className="input"
                    disabled
                  />
                ) : (
                  <p className="py-2 px-3 bg-neutral-50 rounded-md">{profile.department}</p>
                )}
              </div>
              
              <div>
                <label className="label flex items-center">
                  <User className="w-4 h-4 mr-2 text-neutral-500" />
                  Position / Title
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="position"
                    value={profile.position}
                    onChange={handleChange}
                    className="input"
                    disabled
                  />
                ) : (
                  <p className="py-2 px-3 bg-neutral-50 rounded-md">{profile.position}</p>
                )}
              </div>
              
              <div>
                <label className="label flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-neutral-500" />
                  Joining Date
                </label>
                {editing ? (
                  <input
                    type="date"
                    name="joiningDate"
                    value={profile.joiningDate}
                    onChange={handleChange}
                    className="input"
                    disabled
                  />
                ) : (
                  <p className="py-2 px-3 bg-neutral-50 rounded-md">
                    {new Date(profile.joiningDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <div>
                <label className="label flex items-center">
                  <User className="w-4 h-4 mr-2 text-neutral-500" />
                  Employee ID
                </label>
                <p className="py-2 px-3 bg-neutral-50 rounded-md">{profile.employeeId}</p>
              </div>
            </div>
          </div>
          
          {editing && (
            <div className="mt-6 flex justify-end">
              <button type="submit" className="btn-primary flex items-center">
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
      
      {/* Password change section */}
      <div className="card">
        <h3 className="text-lg font-medium text-neutral-800 mb-4">Change Password</h3>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="label">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              className="input"
              placeholder="Enter your current password"
            />
          </div>
          
          <div>
            <label htmlFor="newPassword" className="label">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="input"
              placeholder="Enter your new password"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="input"
              placeholder="Confirm your new password"
            />
          </div>
          
          <div className="pt-2">
            <button type="button" className="btn-primary">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;