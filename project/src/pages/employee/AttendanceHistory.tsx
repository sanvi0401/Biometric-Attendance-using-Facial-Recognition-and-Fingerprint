import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface AttendanceRecord {
  id: number;
  date: string;
  checkIn: string;
  checkOut: string | null;
  workHours: number | null;
  status: 'on-time' | 'late' | 'absent';
}

const AttendanceHistory = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Calculate stats
  const totalWorkDays = attendanceRecords.length;
  const onTimeDays = attendanceRecords.filter(record => record.status === 'on-time').length;
  const lateDays = attendanceRecords.filter(record => record.status === 'late').length;
  const absentDays = attendanceRecords.filter(record => record.status === 'absent').length;
  
  // Calculate total work hours
  const totalWorkHours = attendanceRecords.reduce((total, record) => {
    return total + (record.workHours || 0);
  }, 0);
  
  // Generate mock attendance data for the selected month
  useEffect(() => {
    const generateMonthAttendance = () => {
      const daysInMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
      ).getDate();
      
      const records: AttendanceRecord[] = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        
        // Skip future dates
        if (date > new Date()) continue;
        
        // Generate random status with higher probability for on-time
        const rand = Math.random();
        let status: 'on-time' | 'late' | 'absent';
        
        if (rand < 0.8) {
          status = 'on-time';
        } else if (rand < 0.95) {
          status = 'late';
        } else {
          status = 'absent';
        }
        
        // Generate check-in time (around 9:00 AM)
        const hour = status === 'on-time' ? 9 : 10;
        const minute = Math.floor(Math.random() * 60);
        const checkIn = status !== 'absent' ? `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}` : '-';
        
        // Generate check-out time (around 5:00 PM)
        const checkOutHour = 17 + Math.floor(Math.random() * 2);
        const checkOutMinute = Math.floor(Math.random() * 60);
        const checkOut = status !== 'absent' ? `${checkOutHour.toString().padStart(2, '0')}:${checkOutMinute.toString().padStart(2, '0')}` : null;
        
        // Calculate work hours
        const workHours = status !== 'absent' ? parseFloat((checkOutHour - hour + (checkOutMinute - minute) / 60).toFixed(1)) : null;
        
        records.push({
          id: day,
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
          checkIn,
          checkOut,
          workHours,
          status,
        });
      }
      
      setAttendanceRecords(records);
    };
    
    generateMonthAttendance();
    
    // In a real app, we would fetch data from the API
    // const fetchAttendanceHistory = async () => {
    //   try {
    //     const response = await axios.get(
    //       `http://localhost:5000/api/attendance/history?month=${currentMonth.getMonth() + 1}&year=${currentMonth.getFullYear()}`
    //     );
    //     setAttendanceRecords(response.data);
    //   } catch (error) {
    //     console.error('Error fetching attendance history:', error);
    //   }
    // };
    
    // fetchAttendanceHistory();
  }, [currentMonth]);
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    if (nextMonthDate <= new Date()) {
      setCurrentMonth(nextMonthDate);
    }
  };
  
  // Filter records based on selected status
  const filteredRecords = filterStatus === 'all'
    ? attendanceRecords
    : attendanceRecords.filter(record => record.status === filterStatus);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Attendance History</h1>
        <p className="text-neutral-500">View and filter your attendance records</p>
      </div>
      
      {/* Month navigation */}
      <div className="card">
        <div className="flex items-center justify-between">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-md hover:bg-neutral-100"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-600" />
          </button>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            <span className="text-lg font-medium">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          
          <button 
            onClick={nextMonth}
            className="p-2 rounded-md hover:bg-neutral-100"
            disabled={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1) > new Date()}
          >
            <ChevronRight className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      </div>
      
      {/* Statistics cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="card text-center py-4">
          <div className="text-neutral-600 text-sm mb-1">Work Days</div>
          <div className="text-2xl font-bold text-neutral-900">{totalWorkDays}</div>
        </div>
        
        <div className="card text-center py-4">
          <div className="text-neutral-600 text-sm mb-1">On Time</div>
          <div className="text-2xl font-bold text-success-600">{onTimeDays}</div>
        </div>
        
        <div className="card text-center py-4">
          <div className="text-neutral-600 text-sm mb-1">Late</div>
          <div className="text-2xl font-bold text-warning-500">{lateDays}</div>
        </div>
        
        <div className="card text-center py-4">
          <div className="text-neutral-600 text-sm mb-1">Work Hours</div>
          <div className="text-2xl font-bold text-primary-600">{totalWorkHours.toFixed(1)}</div>
        </div>
      </div>
      
      {/* Filter and table */}
      <div className="card">
        <div className="flex flex-col mb-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-medium text-neutral-800 mb-2 md:mb-0">
            Attendance Records
          </h2>
          
          <div className="flex items-center">
            <div className="relative">
              <Filter className="w-5 h-5 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-10 py-2 border border-neutral-300 rounded-md text-neutral-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="on-time">On Time</option>
                <option value="late">Late</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{record.checkIn}</td>
                    <td>{record.checkOut || '-'}</td>
                    <td>{record.workHours?.toFixed(1) || '-'}</td>
                    <td>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          record.status === 'on-time'
                            ? 'bg-success-50 text-success-700'
                            : record.status === 'late'
                            ? 'bg-warning-50 text-warning-700'
                            : 'bg-error-50 text-error-700'
                        }`}
                      >
                        {record.status === 'on-time' ? 'On Time' : 
                         record.status === 'late' ? 'Late' : 'Absent'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-neutral-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;