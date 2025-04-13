
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { TrackGroup } from '@/types/schedule';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';

interface GroupSettingsProps {
  groups: TrackGroup[];
  onUpdateGroups: (updatedGroups: TrackGroup[]) => void;
  onToggleGroupVisibility: (groupId: string, visible: boolean) => void;
}

const GroupSettings: React.FC<GroupSettingsProps> = ({ 
  groups,
  onUpdateGroups,
  onToggleGroupVisibility
}) => {
  const [editingGroups, setEditingGroups] = useState<TrackGroup[]>([...groups]);
  
  const handleUpdateGroup = (index: number, field: keyof TrackGroup, value: any) => {
    const newGroups = [...editingGroups];
    newGroups[index] = { ...newGroups[index], [field]: value };
    setEditingGroups(newGroups);
  };
  
  const handleSave = () => {
    onUpdateGroups(editingGroups);
  };
  
  return (
    <div className="p-4 space-y-4">
      <h3 className="font-medium">Manage Track Groups</h3>
      
      <div className="space-y-4">
        {editingGroups.map((group, index) => (
          <div key={group.id} className="flex flex-col space-y-2 p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`visible-${group.id}`}
                  checked={group.visible !== false}
                  onChange={(e) => onToggleGroupVisibility(group.id, e.target.checked)}
                />
                <Label htmlFor={`visible-${group.id}`} className="cursor-pointer">
                  {group.visible !== false ? 
                    <Eye className="h-4 w-4" /> : 
                    <EyeOff className="h-4 w-4" />
                  }
                </Label>
              </div>
              <input
                type="color"
                value={group.color || '#e2e8f0'}
                onChange={(e) => handleUpdateGroup(index, 'color', e.target.value)}
                className="w-8 h-8 p-0 rounded cursor-pointer"
                title="Select group color"
              />
            </div>
            <Input
              value={group.name}
              onChange={(e) => handleUpdateGroup(index, 'name', e.target.value)}
              placeholder="Group name"
            />
          </div>
        ))}
      </div>
      
      <Button onClick={handleSave} className="w-full">Save Changes</Button>
    </div>
  );
};

export default GroupSettings;
