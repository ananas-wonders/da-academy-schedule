
import React from 'react';
import { cn } from '@/lib/utils';

export type SessionType = 'online' | 'offline';

export interface SessionCardProps {
  title: string;
  instructor: string;
  type: SessionType;
  count: number;
  total: number;
}

const SessionCard: React.FC<SessionCardProps> = ({
  title,
  instructor,
  type,
  count,
  total
}) => {
  return (
    <div className={cn(
      "p-3 mb-2 rounded-md shadow-sm transition-all duration-200 hover:shadow-md",
      type === 'online' ? "bg-[hsl(var(--online-light))] border-l-4 border-[hsl(var(--online))]" : 
      "bg-[hsl(var(--offline-light))] border-l-4 border-[hsl(var(--offline))]"
    )}>
      <h3 className="font-medium text-sm mb-1 truncate">{title}</h3>
      <p className="text-xs text-gray-700 mb-1 truncate">Instructor: {instructor}</p>
      <div className="flex justify-between items-center">
        <span className={cn(
          "px-2 py-0.5 rounded-full text-white text-xs",
          type === 'online' ? "bg-[hsl(var(--online))]" : "bg-[hsl(var(--offline))]"
        )}>
          {type}
        </span>
        <span className="text-xs text-gray-500">{count}/{total}</span>
      </div>
    </div>
  );
};

export default SessionCard;
