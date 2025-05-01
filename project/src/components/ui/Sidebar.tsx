import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { X } from 'lucide-react';

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ForwardRefExoticComponent<any>;
}

interface SidebarProps {
  navigation: NavigationItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userRole: string;
}

const Sidebar = ({ navigation, isOpen, setIsOpen, userRole }: SidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-neutral-800 bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">BioClock</span>
            </Link>
            <button
              className="p-1 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-6 h-6 text-neutral-500" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-neutral-200">
            <div className="font-medium text-neutral-900">{user?.name}</div>
            <div className="text-sm text-neutral-500">{userRole}</div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-neutral-200">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-error-600 transition-colors rounded-md hover:bg-neutral-100"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;