import { useState } from 'react';
import { Save, Clock, Bell, Shield, Database, Fingerprint } from 'lucide-react';

const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'Acme Corporation',
    workingHours: {
      start: '09:00',
      end: '17:00',
    },
    graceTimeInMinutes: 15,
    weeklyHolidays: ['Saturday', 'Sunday'],
    timeZone: 'UTC+0',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    lateArrivalAlert: true,
    earlyDepartureAlert: true,
    missingCheckInAlert: true,
    adminReportDaily: true,
    adminReportWeekly: true,
  });
  
  const [biometricSettings, setBiometricSettings] = useState({
    fingerprintEnabled: true,
    facialRecognitionEnabled: true,
    minimumConfidenceScore: 85,
    retryAttempts: 3,
  });
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">System Settings</h1>
        <p className="text-neutral-500">Configure your attendance system settings</p>
      </div>
      
      {/* Settings tabs */}
      <div className="border-b border-neutral-200">
        <nav className="flex space-x-8">
          <button className="py-2 px-1 border-b-2 border-primary-500 text-primary-600 font-medium">
            General
          </button>
          <button className="py-2 px-1 border-b-2 border-transparent text-neutral-600 hover:text-neutral-900">
            Notifications
          </button>
          <button className="py-2 px-1 border-b-2 border-transparent text-neutral-600 hover:text-neutral-900">
            Security
          </button>
          <button className="py-2 px-1 border-b-2 border-transparent text-neutral-600 hover:text-neutral-900">
            Backup & Restore
          </button>
        </nav>
      </div>
      
      {/* General settings */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Clock className="w-6 h-6 text-primary-600 mr-3" />
          <h2 className="text-lg font-medium text-neutral-800">Working Hours & Attendance Rules</h2>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="companyName" className="label">Company Name</label>
              <input
                type="text"
                id="companyName"
                className="input"
                value={generalSettings.companyName}
                onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="timeZone" className="label">Time Zone</label>
              <select
                id="timeZone"
                className="input"
                value={generalSettings.timeZone}
                onChange={(e) => setGeneralSettings({...generalSettings, timeZone: e.target.value})}
              >
                <option value="UTC-8">Pacific Time (UTC-8)</option>
                <option value="UTC-5">Eastern Time (UTC-5)</option>
                <option value="UTC+0">UTC+0</option>
                <option value="UTC+1">Central European Time (UTC+1)</option>
                <option value="UTC+5:30">Indian Standard Time (UTC+5:30)</option>
                <option value="UTC+8">China Standard Time (UTC+8)</option>
                <option value="UTC+9">Japan Standard Time (UTC+9)</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="label">Work Start Time</label>
              <input
                type="time"
                className="input"
                value={generalSettings.workingHours.start}
                onChange={(e) => setGeneralSettings({
                  ...generalSettings,
                  workingHours: { ...generalSettings.workingHours, start: e.target.value }
                })}
              />
            </div>
            
            <div>
              <label className="label">Work End Time</label>
              <input
                type="time"
                className="input"
                value={generalSettings.workingHours.end}
                onChange={(e) => setGeneralSettings({
                  ...generalSettings,
                  workingHours: { ...generalSettings.workingHours, end: e.target.value }
                })}
              />
            </div>
          </div>
          
          <div>
            <label className="label">Late Arrival Grace Period (minutes)</label>
            <input
              type="number"
              className="input"
              min="0"
              max="60"
              value={generalSettings.graceTimeInMinutes}
              onChange={(e) => setGeneralSettings({
                ...generalSettings,
                graceTimeInMinutes: parseInt(e.target.value)
              })}
            />
          </div>
          
          <div>
            <label className="label">Weekly Holidays</label>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-2 mt-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <label key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={generalSettings.weeklyHolidays.includes(day)}
                    onChange={(e) => {
                      const holidays = e.target.checked
                        ? [...generalSettings.weeklyHolidays, day]
                        : generalSettings.weeklyHolidays.filter(d => d !== day);
                      
                      setGeneralSettings({
                        ...generalSettings,
                        weeklyHolidays: holidays
                      });
                    }}
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-700">{day.substring(0, 3)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Notification settings */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Bell className="w-6 h-6 text-primary-600 mr-3" />
          <h2 className="text-lg font-medium text-neutral-800">Notification Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-800">Late Arrival Alerts</h3>
              <p className="text-sm text-neutral-500">Notify when employees arrive after grace period</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.lateArrivalAlert}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  lateArrivalAlert: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-800">Early Departure Alerts</h3>
              <p className="text-sm text-neutral-500">Notify when employees leave before end time</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.earlyDepartureAlert}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  earlyDepartureAlert: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-800">Missing Check-in Alerts</h3>
              <p className="text-sm text-neutral-500">Notify when employees have no check-in by noon</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.missingCheckInAlert}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  missingCheckInAlert: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-800">Daily Admin Reports</h3>
              <p className="text-sm text-neutral-500">Send daily attendance summary to admins</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.adminReportDaily}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  adminReportDaily: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      {/* Biometric settings */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Fingerprint className="w-6 h-6 text-primary-600 mr-3" />
          <h2 className="text-lg font-medium text-neutral-800">Biometric Configuration</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-800">Fingerprint Authentication</h3>
              <p className="text-sm text-neutral-500">Enable fingerprint for attendance</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={biometricSettings.fingerprintEnabled}
                onChange={(e) => setBiometricSettings({
                  ...biometricSettings,
                  fingerprintEnabled: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-800">Facial Recognition</h3>
              <p className="text-sm text-neutral-500">Enable facial recognition for attendance</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={biometricSettings.facialRecognitionEnabled}
                onChange={(e) => setBiometricSettings({
                  ...biometricSettings,
                  facialRecognitionEnabled: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div>
            <label className="label">Minimum Confidence Score (%)</label>
            <input
              type="range"
              min="60"
              max="99"
              value={biometricSettings.minimumConfidenceScore}
              onChange={(e) => setBiometricSettings({
                ...biometricSettings,
                minimumConfidenceScore: parseInt(e.target.value)
              })}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-neutral-500 mt-1">
              <span>Min: 60%</span>
              <span>Current: {biometricSettings.minimumConfidenceScore}%</span>
              <span>Max: 99%</span>
            </div>
          </div>
          
          <div>
            <label className="label">Retry Attempts</label>
            <select
              className="input"
              value={biometricSettings.retryAttempts}
              onChange={(e) => setBiometricSettings({
                ...biometricSettings,
                retryAttempts: parseInt(e.target.value)
              })}
            >
              <option value="1">1 attempt</option>
              <option value="2">2 attempts</option>
              <option value="3">3 attempts</option>
              <option value="4">4 attempts</option>
              <option value="5">5 attempts</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Save button */}
      <div className="flex justify-end">
        <button className="btn-primary flex items-center">
          <Save className="w-5 h-5 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;