import { useAuth } from '../../contexts/AuthContext';
import { Menu, Bell } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
  showToggle: boolean;
}

const Header = ({ toggleSidebar, showToggle }: HeaderProps) => {
  const { user } = useAuth();
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  // Get current time
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const formattedDate = now.toLocaleDateString('en-US', options);

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-neutral-200 md:px-6">
      <div className="flex items-center">
        {showToggle && (
          <button
            className="p-1 mr-3 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6 text-neutral-500" />
          </button>
        )}
        <div>
          <h1 className="text-lg font-semibold text-neutral-800 md:text-xl">Welcome, {user?.name}</h1>
          <p className="text-xs text-neutral-500 md:text-sm">{formattedDate}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            className="p-1 text-neutral-600 rounded-full hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={() => setNotificationOpen(!notificationOpen)}
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary-500 rounded-full"></span>
          </button>
          
          {notificationOpen && (
            <div className="absolute right-0 z-10 w-80 mt-2 bg-white rounded-md shadow-lg">
              <div className="p-3 border-b border-neutral-200">
                <h3 className="text-sm font-medium text-neutral-900">Notifications</h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <div className="p-3 border-b border-neutral-100 hover:bg-neutral-50">
                  <p className="text-sm text-neutral-800">Your attendance for yesterday has been approved</p>
                  <p className="text-xs text-neutral-500">2 hours ago</p>
                </div>
                <div className="p-3 border-b border-neutral-100 hover:bg-neutral-50">
                  <p className="text-sm text-neutral-800">Welcome to the new BioClock system!</p>
                  <p className="text-xs text-neutral-500">1 day ago</p>
                </div>
              </div>
              <div className="p-2 text-center border-t border-neutral-200">
                <button className="text-xs text-primary-600 hover:text-primary-800">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* User menu - simplified version */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;