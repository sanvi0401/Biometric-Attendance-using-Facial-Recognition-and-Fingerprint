import { Outlet } from 'react-router-dom';
import Sidebar from '../ui/Sidebar';
import Header from '../ui/Header';
import { 
  Fingerprint, 
  Clock, 
  Home, 
  User 
} from 'lucide-react';
import { useState } from 'react';

const EmployeeLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Check In/Out', path: '/check-in', icon: Fingerprint },
    { name: 'Attendance History', path: '/history', icon: Clock },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar 
        navigation={navigation} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        userRole="Employee"
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          showToggle={true}
        />
        
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;