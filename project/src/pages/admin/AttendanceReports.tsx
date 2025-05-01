import { useState } from 'react';
import { Download, Calendar, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface AttendanceReport {
  id: number;
  employeeName: string;
  employeeId: number;
  department: string;
  present: number;
  late: number;
  absent: number;
  totalWorkHours: number;
  averageWorkHours: number;
}

// Mock report data
const mockReportData: AttendanceReport[] = [
  {
    id: 1,
    employeeName: 'John Doe',
    employeeId: 1001,
    department: 'Engineering',
    present: 19,
    late: 2,
    absent: 1,
    totalWorkHours: 168,
    averageWorkHours: 8.4,
  },
  {
    id: 2,
    employeeName: 'Jane Smith',
    employeeId: 1002,
    department: 'Marketing',
    present: 18,
    late: 3,
    absent: 1,
    totalWorkHours: 160,
    averageWorkHours: 8.0,
  },
  {
    id: 3,
    employeeName: 'Michael Johnson',
    employeeId: 1003,
    department: 'Finance',
    present: 20,
    late: 1,
    absent: 1,
    totalWorkHours: 170,
    averageWorkHours: 8.5,
  },
  {
    id: 4,
    employeeName: 'Emily Davis',
    employeeId: 1004,
    department: 'Human Resources',
    present: 21,
    late: 0,
    absent: 1,
    totalWorkHours: 172,
    averageWorkHours: 8.6,
  },
  {
    id: 5,
    employeeName: 'Robert Wilson',
    employeeId: 1005,
    department: 'Engineering',
    present: 17,
    late: 4,
    absent: 1,
    totalWorkHours: 155,
    averageWorkHours: 7.75,
  },
];

const AttendanceReports = () => {
  const [reports, setReports] = useState<AttendanceReport[]>(mockReportData);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  
  // Get unique departments
  const departments = Array.from(new Set(reports.map(report => report.department)));
  
  // Filter reports based on search and department
  const filteredReports = reports.filter((report) => {
    const matchesSearch = 
      report.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.employeeId.toString().includes(searchTerm);
      
    const matchesDepartment = selectedDepartment === 'all' || report.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Attendance Reports</h1>
          <p className="text-neutral-500">Monthly attendance summary for all employees</p>
        </div>
        
        <button className="btn-primary flex items-center">
          <Download className="w-5 h-5 mr-2" />
          Export Report
        </button>
      </div>
      
      {/* Month selector and filters */}
      <div className="card">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Month selector */}
          <div className="flex items-center justify-between border border-neutral-300 rounded-md p-2">
            <button 
              onClick={prevMonth}
              className="p-1 rounded-md hover:bg-neutral-100"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-600" />
            </button>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              <span className="font-medium">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            
            <button 
              onClick={nextMonth}
              className="p-1 rounded-md hover:bg-neutral-100"
              disabled={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1) > new Date()}
            >
              <ChevronRight className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              className="pl-10 w-full border border-neutral-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Department filter */}
          <div className="relative">
            <Filter className="w-5 h-5 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              className="pl-10 w-full border border-neutral-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Summary statistics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="card text-center py-4">
          <div className="text-neutral-600 text-sm mb-1">Total Employees</div>
          <div className="text-2xl font-bold text-neutral-900">{filteredReports.length}</div>
        </div>
        
        <div className="card text-center py-4">
          <div className="text-neutral-600 text-sm mb-1">Avg. Attendance</div>
          <div className="text-2xl font-bold text-success-600">
            {Math.round(filteredReports.reduce((sum, report) => sum + (report.present / 22 * 100), 0) / filteredReports.length)}%
          </div>
        </div>
        
        <div className="card text-center py-4">
          <div className="text-neutral-600 text-sm mb-1">Avg. Late</div>
          <div className="text-2xl font-bold text-warning-500">
            {(filteredReports.reduce((sum, report) => sum + report.late, 0) / filteredReports.length).toFixed(1)}
          </div>
        </div>
        
        <div className="card text-center py-4">
          <div className="text-neutral-600 text-sm mb-1">Avg. Work Hours</div>
          <div className="text-2xl font-bold text-primary-600">
            {(filteredReports.reduce((sum, report) => sum + report.averageWorkHours, 0) / filteredReports.length).toFixed(1)}
          </div>
        </div>
      </div>
      
      {/* Reports table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Present</th>
                <th>Late</th>
                <th>Absent</th>
                <th>Work Hours</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td className="font-medium">{report.employeeName}</td>
                    <td>{report.department}</td>
                    <td className="text-success-600">{report.present}</td>
                    <td className="text-warning-600">{report.late}</td>
                    <td className="text-error-600">{report.absent}</td>
                    <td>{report.totalWorkHours} hrs</td>
                    <td>
                      <button className="text-primary-600 hover:text-primary-800 font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-neutral-500">
                    No reports found
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

export default AttendanceReports;