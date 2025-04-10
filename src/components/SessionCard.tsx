
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
    <div className={cn("session-card", type)}>
      <h3 className="session-title">{title}</h3>
      <p className="session-instructor">Instructor: {instructor}</p>
      <div className="session-info">
        <span className={cn("session-mode", type)}>{type}</span>
        <span className="session-count">{count}/{total}</span>
      </div>
    </div>
  );
};

export default SessionCard;
