import { useState } from 'react';
import { Search, UserPlus, Edit, Trash2, CheckCircle, Filter } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
  joiningDate: string;
}

// Mock employees data
const mockEmployees: Employee[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    department: 'Engineering',
    position: 'Software Developer',
    status: 'active',
    joiningDate: '2020-05-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    status: 'active',
    joiningDate: '2021-02-10',
  },
  {
    id: 3,
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    department: 'Finance',
    position: 'Financial Analyst',
    status: 'inactive',
    joiningDate: '2019-11-22',
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    department: 'Human Resources',
    position: 'HR Specialist',
    status: 'active',
    joiningDate: '2022-01-05',
  },
  {
    id: 5,
    name: 'Robert Wilson',
    email: 'robert.w@example.com',
    department: 'Engineering',
    position: 'UI/UX Designer',
    status: 'active',
    joiningDate: '2021-08-15',
  },
];

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Filter employees based on search term and filters
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });
  
  // Get unique departments for filter
  const departments = Array.from(new Set(employees.map(emp => emp.department)));
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Employee Management</h1>
          <p className="text-neutral-500">Manage your organization's employees</p>
        </div>
        
        <button 
          className="btn-primary flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add Employee
        </button>
      </div>
      
      {/* Search and filters */}
      <div className="card">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search employees..."
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
          
          {/* Status filter */}
          <div className="relative">
            <CheckCircle className="w-5 h-5 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              className="pl-10 w-full border border-neutral-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Employees table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Joining Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="font-medium">{employee.name}</td>
                    <td>{employee.department}</td>
                    <td>{employee.position}</td>
                    <td>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          employee.status === 'active'
                            ? 'bg-success-50 text-success-700'
                            : 'bg-neutral-50 text-neutral-700'
                        }`}
                      >
                        {employee.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(employee.joiningDate).toLocaleDateString()}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button className="p-1 text-primary-600 hover:text-primary-800 rounded-md">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="p-1 text-error-600 hover:text-error-800 rounded-md">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-neutral-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Add New Employee</h2>
            
            <form>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="label">Full Name</label>
                  <input type="text" id="name" className="input" />
                </div>
                
                <div>
                  <label htmlFor="email" className="label">Email Address</label>
                  <input type="email" id="email" className="input" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="department" className="label">Department</label>
                    <select id="department" className="input">
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="position" className="label">Position</label>
                    <input type="text" id="position" className="input" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="joiningDate" className="label">Joining Date</label>
                  <input type="date" id="joiningDate" className="input" />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="button" className="btn-primary">
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;