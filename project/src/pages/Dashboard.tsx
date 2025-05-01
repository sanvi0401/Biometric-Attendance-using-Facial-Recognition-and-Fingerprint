import { useState, useEffect } from 'react';
import { 
  Clock, 
  Users, 
  UserCheck, 
  AlertTriangle,
  Calendar,
  Clock8
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// Mock data for the chart
const mockAttendanceData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Check-ins',
      data: [65, 78, 80, 81, 76, 55, 10],
      borderColor: '#2563EB',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      tension: 0.4,
    },
  ],
};

// Define attendance data type
interface AttendanceData {
  id: number;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: 'on-time' | 'late' | 'absent';
}

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [recentAttendance, setRecentAttendance] = useState<AttendanceData[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 45,
    presentToday: 38,
    lateToday: 4,
    absentToday: 3,
    onTimePercentage: 84,
    averageWorkHours: 7.8,
  });
  
  // Function to generate dummy recent attendance for the current user or all users
  useEffect(() => {
    // This would normally be an API call
    const generateDummyAttendance = () => {
      const statuses: ('on-time' | 'late' | 'absent')[] = ['on-time', 'late', 'absent'];
      const dummyData: AttendanceData[] = [];
      
      // Generate attendance for the last 5 days
      for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        
        const status = statuses[Math.floor(Math.random() * (statuses.length - (i === 0 ? 1 : 0)))];
        
        dummyData.push({
          id: i + 1,
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          checkIn: status !== 'absent' ? `${8 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : '-',
          checkOut: status !== 'absent' ? `${16 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : null,
          status,
        });
      }
      
      setRecentAttendance(dummyData);
    };
    
    generateDummyAttendance();
    
    // In a real app, we would fetch the dashboard data here
    // const fetchDashboardData = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:5000/api/dashboard');
    //     setDashboardStats(response.data);
    //     setRecentAttendance(response.data.recentAttendance);
    //   } catch (error) {
    //     console.error('Error fetching dashboard data:', error);
    //   }
    // };
    
    // fetchDashboardData();
  }, [user?.role]);
  
  // Get current time
  const now = new Date();
  const currentTime = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  const currentDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Status color mapping
  const statusColor = {
    'on-time': 'text-success-500',
    'late': 'text-warning-500',
    'absent': 'text-error-500',
  };
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-500">
            {currentDate} | <span className="font-medium">{currentTime}</span>
          </p>
        </div>
        
        {isAdmin ? (
          <button className="btn-primary md:self-end">Export Reports</button>
        ) : (
          <button className="btn-primary md:self-end">Check In/Out</button>
        )}
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isAdmin ? (
          <>
            <StatCard
              title="Total Employees"
              value={dashboardStats.totalEmployees}
              icon={<Users className="h-6 w-6" />}
              color="blue"
            />
            <StatCard
              title="Present Today"
              value={dashboardStats.presentToday}
              icon={<UserCheck className="h-6 w-6" />}
              change={{ value: '8%', isPositive: true }}
              color="green"
            />
            <StatCard
              title="Late Today"
              value={dashboardStats.lateToday}
              icon={<Clock className="h-6 w-6" />}
              change={{ value: '2%', isPositive: false }}
              color="yellow"
            />
            <StatCard
              title="Absent Today"
              value={dashboardStats.absentToday}
              icon={<AlertTriangle className="h-6 w-6" />}
              change={{ value: '1%', isPositive: true }}
              color="red"
            />
          </>
        ) : (
          <>
            <StatCard
              title="This Month"
              value={`${23} days`}
              icon={<Calendar className="h-6 w-6" />}
              color="blue"
            />
            <StatCard
              title="On Time"
              value={`${19} days`}
              icon={<UserCheck className="h-6 w-6" />}
              color="green"
            />
            <StatCard
              title="Late"
              value={`${3} days`}
              icon={<Clock className="h-6 w-6" />}
              color="yellow"
            />
            <StatCard
              title="Avg. Work Hours"
              value={`${7.8} hrs`}
              icon={<Clock8 className="h-6 w-6" />}
              color="blue"
            />
          </>
        )}
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Attendance</h2>
            <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View All
            </a>
          </div>
          
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAttendance.map((attendance) => (
                  <tr key={attendance.id}>
                    <td>{attendance.date}</td>
                    <td>{attendance.checkIn}</td>
                    <td>{attendance.checkOut || '-'}</td>
                    <td>
                      <span className={statusColor[attendance.status]}>
                        {attendance.status === 'on-time' ? 'On Time' : 
                         attendance.status === 'late' ? 'Late' : 'Absent'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Today's Attendance Summary */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              {isAdmin ? "Attendance Overview" : "Your Attendance Summary"}
            </h2>
            <div className="text-sm text-neutral-500">This Week</div>
          </div>
          
          <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
            <p className="text-neutral-500">Chart will be displayed here</p>
            {/* In a real app, a Chart.js component would be rendered here */}
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-neutral-500">On Time</p>
              <p className="text-lg font-medium text-success-500">
                {isAdmin ? `${dashboardStats.onTimePercentage}%` : '82%'}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Late</p>
              <p className="text-lg font-medium text-warning-500">
                {isAdmin ? `${(100 - dashboardStats.onTimePercentage) / 2}%` : '12%'}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Absent</p>
              <p className="text-lg font-medium text-error-500">
                {isAdmin ? `${(100 - dashboardStats.onTimePercentage) / 2}%` : '6%'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-primary-50 rounded-lg text-primary-700 font-medium text-center hover:bg-primary-100 transition-colors">
            {isAdmin ? 'Add Employee' : 'View Schedule'}
          </button>
          <button className="p-4 bg-secondary-50 rounded-lg text-secondary-700 font-medium text-center hover:bg-secondary-100 transition-colors">
            {isAdmin ? 'Generate Report' : 'Request Leave'}
          </button>
          <button className="p-4 bg-neutral-50 rounded-lg text-neutral-700 font-medium text-center hover:bg-neutral-100 transition-colors">
            {isAdmin ? 'Manage Shifts' : 'Attendance History'}
          </button>
          <button className="p-4 bg-neutral-50 rounded-lg text-neutral-700 font-medium text-center hover:bg-neutral-100 transition-colors">
            {isAdmin ? 'System Settings' : 'Update Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;