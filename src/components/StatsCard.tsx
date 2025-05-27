
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  trendUp: boolean;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp, 
  color 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 hover-lift">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          <div className="flex items-center space-x-1">
            <span className={`text-sm font-medium ${
              trendUp ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend}
            </span>
            <span className="text-sm text-gray-500">vs mês anterior</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
