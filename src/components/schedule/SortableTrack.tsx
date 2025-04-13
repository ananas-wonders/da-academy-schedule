
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit, GripHorizontal, Eye, EyeOff, Link as LinkIcon, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Track } from '@/types/schedule';

interface SortableTrackProps {
  track: Track;
  onEditName: (id: string, name: string) => void;
  groupName?: string;
  groupColor?: string;
  grouped?: boolean;
  onToggleVisibility?: (id: string, visible: boolean) => void;
  onCopyLink?: (id: string, name: string) => void;
  onAddTrack?: () => void;
}

const SortableTrack: React.FC<SortableTrackProps> = ({ 
  track, 
  onEditName, 
  groupName,
  groupColor = '#e2e8f0',
  grouped = false,
  onToggleVisibility,
  onCopyLink,
  onAddTrack
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(track.name);
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: track.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(grouped ? { borderTop: `3px solid ${groupColor}` } : {})
  };

  const handleSaveName = () => {
    onEditName(track.id, name);
    setIsEditing(false);
  };

  return (
    <th 
      ref={setNodeRef} 
      style={style} 
      className="min-w-[250px] bg-gray-50 p-3 font-semibold text-center border-b border-r border-gray-200 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {grouped && (
        <div className="text-xs text-gray-500 mb-1" style={{ color: groupColor }}>{groupName}</div>
      )}
      
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="h-8"
            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
          />
          <Button size="sm" onClick={handleSaveName}>Save</Button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <span>{track.name}</span>
          <div className="flex items-center">
            <button 
              onClick={() => setIsEditing(true)} 
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              title="Edit track name"
            >
              <Edit size={14} />
            </button>
            <button 
              {...attributes} 
              {...listeners}
              className="p-1 cursor-move rounded-full hover:bg-gray-200 transition-colors"
              title="Drag to reorder"
            >
              <GripHorizontal size={14} />
            </button>
            
            {onToggleVisibility && (
              <button 
                onClick={() => onToggleVisibility(track.id, !(track.visible !== false))} 
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                title={track.visible !== false ? "Hide track" : "Show track"}
              >
                {track.visible !== false ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            )}
            
            {onCopyLink && (
              <button 
                onClick={() => onCopyLink(track.id, track.name)} 
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                title="Copy track link"
              >
                <LinkIcon size={14} />
              </button>
            )}
          </div>
          
          {isHovered && onAddTrack && (
            <button
              onClick={onAddTrack}
              className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-1 shadow-md hover:bg-blue-600 transition-colors z-10"
              title="Add new track"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      )}
    </th>
  );
};

export default SortableTrack;
