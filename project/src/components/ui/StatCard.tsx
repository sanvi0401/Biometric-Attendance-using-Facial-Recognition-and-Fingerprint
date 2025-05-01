import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string | number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'yellow' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, color }) => {
  const colorClasses = {
    blue: 'bg-primary-50 text-primary-600',
    green: 'bg-success-50 text-success-500',
    yellow: 'bg-warning-50 text-warning-500',
    red: 'bg-error-50 text-error-500',
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <h3 className="ml-3 text-lg font-medium text-neutral-700">{title}</h3>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-neutral-900">{value}</div>
          {change && (
            <div className="flex items-center mt-1">
              <span className={change.isPositive ? 'text-success-500' : 'text-error-500'}>
                {change.isPositive ? '↑' : '↓'} {change.value}
              </span>
              <span className="ml-1 text-xs text-neutral-500">from last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;