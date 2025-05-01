import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Clock } from 'lucide-react';
import BiometricCapture from '../../components/ui/BiometricCapture';

interface Attendance {
  id: number;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'pending' | 'approved' | 'rejected';
}

const CheckIn = () => {
  const { user } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [biometricMethod, setBiometricMethod] = useState<'face' | 'fingerprint'>('face');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  
  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    // Check if already checked in today
    const checkAttendance = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await axios.get('http://localhost:5000/api/attendance/today');
        // setTodayAttendance(response.data);
        
        // Mock data
        const mockAttendance: Attendance | null = Math.random() > 0.5 
          ? {
              id: 1,
              date: new Date().toISOString().split('T')[0],
              checkIn: '08:30',
              checkOut: null,
              status: 'approved',
            }
          : null;
          
        setTodayAttendance(mockAttendance);
      } catch (error) {
        console.error('Error fetching today\'s attendance:', error);
      }
    };
    
    checkAttendance();
    
    return () => clearInterval(timer);
  }, []);
  
  const handleBiometricCapture = async (data: string) => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // In a real app, this would send the biometric data to the server
      // const action = todayAttendance?.checkIn ? 'checkout' : 'checkin';
      // const response = await axios.post(`http://localhost:5000/api/attendance/${action}`, {
      //   biometricData: data,
      //   method: biometricMethod,
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update attendance state
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      
      if (todayAttendance?.checkIn) {
        setTodayAttendance({
          ...todayAttendance,
          checkOut: time,
        });
        setSuccessMessage(`Successfully checked out at ${time}`);
      } else {
        setTodayAttendance({
          id: 1,
          date: now.toISOString().split('T')[0],
          checkIn: time,
          checkOut: null,
          status: 'approved',
        });
        setSuccessMessage(`Successfully checked in at ${time}`);
      }
    } catch (error) {
      console.error('Error with biometric capture:', error);
      setErrorMessage('Failed to process biometric data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Format current time and date
  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });
  
  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Attendance Check In/Out</h1>
        <p className="text-neutral-500">Use biometric verification to record your attendance</p>
      </div>
      
      {/* Clock display */}
      <div className="card text-center py-8">
        <Clock className="w-16 h-16 mx-auto text-primary-600 mb-4" />
        <div className="text-4xl font-bold text-neutral-900 mb-2">{formattedTime}</div>
        <div className="text-neutral-600">{formattedDate}</div>
      </div>
      
      {/* Status display */}
      <div className="card">
        <h2 className="text-lg font-medium text-neutral-800 mb-4">Today's Status</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-500">Check In</p>
            <p className="text-lg font-medium">
              {todayAttendance?.checkIn ? todayAttendance.checkIn : 'Not checked in'}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Check Out</p>
            <p className="text-lg font-medium">
              {todayAttendance?.checkOut ? todayAttendance.checkOut : 'Not checked out'}
            </p>
          </div>
        </div>
        
        {/* Success/Error messages */}
        {successMessage && (
          <div className="mt-4 p-3 bg-success-50 text-success-700 rounded-md">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mt-4 p-3 bg-error-50 text-error-700 rounded-md">
            {errorMessage}
          </div>
        )}
      </div>
      
      {/* Biometric options */}
      <div className="card">
        <h2 className="text-lg font-medium text-neutral-800 mb-4">Select Verification Method</h2>
        
        <div className="flex space-x-4 mb-6">
          <button
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              biometricMethod === 'face'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
            onClick={() => setBiometricMethod('face')}
          >
            Facial Recognition
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              biometricMethod === 'fingerprint'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
            onClick={() => setBiometricMethod('fingerprint')}
          >
            Fingerprint
          </button>
        </div>
        
        <BiometricCapture
          type={biometricMethod}
          onCapture={handleBiometricCapture}
        />
        
        <div className="mt-6 text-center">
          <button 
            className={`btn-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Processing...' : todayAttendance?.checkIn ? 'Check Out' : 'Check In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;