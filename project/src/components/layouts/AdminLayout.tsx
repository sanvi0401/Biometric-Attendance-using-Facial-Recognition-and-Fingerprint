import { Outlet } from 'react-router-dom';
import Sidebar from '../ui/Sidebar';
import Header from '../ui/Header';
import { 
  Users, 
  FileBarChart, 
  Settings, 
  Home, 
  User 
} from 'lucide-react';
import { useState } from 'react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/admin', icon: Home },
    { name: 'Employees', path: '/admin/employees', icon: Users },
    { name: 'Reports', path: '/admin/reports', icon: FileBarChart },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
    { name: 'My Profile', path: '/admin/profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar 
        navigation={navigation} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        userRole="Administrator"
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

export default AdminLayout;