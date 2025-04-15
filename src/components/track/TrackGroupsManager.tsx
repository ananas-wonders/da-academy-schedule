import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash, Edit, EyeOff, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TrackGroup } from '@/types/schedule';

interface TrackGroupsManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupsUpdated?: () => void;
}

const TrackGroupsManager: React.FC<TrackGroupsManagerProps> = ({
  open,
  onOpenChange,
  onGroupsUpdated
}) => {
  const [groups, setGroups] = useState<TrackGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [newGroupDialogOpen, setNewGroupDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<TrackGroup | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('#6366f1');
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrackGroups = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('track_groups')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        setGroups(data || []);
      } catch (error) {
        console.error('Error fetching track groups:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load track groups."
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (open) {
      fetchTrackGroups();
    }
  }, [open, toast]);

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Group name is required."
      });
      return;
    }

    try {
      const newGroup = {
        id: `group-${Date.now()}`,
        name: newGroupName.trim(),
        color: newGroupColor,
        visible: true
      };

      const { error } = await supabase
        .from('track_groups')
        .insert([newGroup]);
      
      if (error) throw error;
      
      setGroups(prev => [...prev, {...newGroup}]);
      setNewGroupName('');
      setNewGroupColor('#6366f1');
      setNewGroupDialogOpen(false);
      toast({
        title: "Group Added",
        description: "Track group has been added successfully."
      });
      
      if (onGroupsUpdated) onGroupsUpdated();
    } catch (error) {
      console.error('Error adding track group:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add track group."
      });
    }
  };

  const handleUpdateGroup = async () => {
    if (!editingGroup || !editingGroup.name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Group name is required."
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('track_groups')
        .update({
          name: editingGroup.name,
          color: editingGroup.color,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingGroup.id);
      
      if (error) throw error;
      
      setGroups(prev => prev.map(group => 
        group.id === editingGroup.id 
          ? { ...editingGroup } 
          : group
      ));
      setEditingGroup(null);
      toast({
        title: "Group Updated",
        description: "Track group has been updated successfully."
      });
      
      if (onGroupsUpdated) onGroupsUpdated();
    } catch (error) {
      console.error('Error updating track group:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update track group."
      });
    }
  };

  const handleDeleteGroup = async (id: string) => {
    try {
      const { error } = await supabase
        .from('track_groups')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setGroups(prev => prev.filter(group => group.id !== id));
      toast({
        variant: "destructive",
        title: "Group Removed",
        description: "Track group has been removed."
      });
      
      if (onGroupsUpdated) onGroupsUpdated();
    } catch (error) {
      console.error('Error deleting track group:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete track group."
      });
    }
  };

  const toggleGroupVisibility = async (group: TrackGroup) => {
    try {
      const newVisibility = !group.visible;
      
      const { error } = await supabase
        .from('track_groups')
        .update({
          visible: newVisibility,
          updated_at: new Date().toISOString()
        })
        .eq('id', group.id);
      
      if (error) throw error;
      
      setGroups(prev => prev.map(g => 
        g.id === group.id 
          ? { ...g, visible: newVisibility, updatedAt: new Date().toISOString() } 
          : g
      ));
      
      toast({
        title: "Visibility Updated",
        description: `Group is now ${newVisibility ? 'visible' : 'hidden'}.`
      });
      
      if (onGroupsUpdated) onGroupsUpdated();
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update group visibility."
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Track Groups</DialogTitle>
          <DialogDescription>
            Create and manage track groups to better organize your tracks.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setNewGroupDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Group
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center py-4">Loading groups...</div>
          ) : groups.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No track groups found. Create one to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map(group => (
                <Card key={group.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-5 h-5 rounded-full" 
                          style={{ backgroundColor: group.color || '#e2e8f0' }}
                        />
                        <span className="font-medium">{group.name}</span>
                        {!group.visible && (
                          <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">
                            Hidden
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleGroupVisibility(group)}
                          title={group.visible ? "Hide group" : "Show group"}
                        >
                          {group.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setEditingGroup(group)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
      
      <Dialog open={newGroupDialogOpen} onOpenChange={setNewGroupDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Track Group</DialogTitle>
            <DialogDescription>
              Create a new group to organize your tracks.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input 
                id="groupName" 
                value={newGroupName} 
                onChange={(e) => setNewGroupName(e.target.value)} 
                placeholder="e.g., Undergraduate Programs"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="groupColor">Group Color</Label>
              <div className="flex items-center space-x-3">
                <input 
                  type="color" 
                  id="groupColor"
                  value={newGroupColor}
                  onChange={(e) => setNewGroupColor(e.target.value)}
                  className="w-10 h-10 p-0 rounded cursor-pointer"
                />
                <span className="text-sm text-muted-foreground">
                  This color will be used to identify the group.
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewGroupDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddGroup}>Add Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog 
        open={!!editingGroup} 
        onOpenChange={(open) => !open && setEditingGroup(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Track Group</DialogTitle>
            <DialogDescription>
              Update the group details.
            </DialogDescription>
          </DialogHeader>
          
          {editingGroup && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editGroupName">Group Name</Label>
                <Input 
                  id="editGroupName" 
                  value={editingGroup.name} 
                  onChange={(e) => setEditingGroup({...editingGroup, name: e.target.value})} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editGroupColor">Group Color</Label>
                <div className="flex items-center space-x-3">
                  <input 
                    type="color" 
                    id="editGroupColor"
                    value={editingGroup.color || '#e2e8f0'}
                    onChange={(e) => setEditingGroup({...editingGroup, color: e.target.value})}
                    className="w-10 h-10 p-0 rounded cursor-pointer"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Label htmlFor="groupVisibility" className="flex-grow">Group Visibility</Label>
                <Switch 
                  id="groupVisibility" 
                  checked={editingGroup.visible}
                  onCheckedChange={(checked) => setEditingGroup({...editingGroup, visible: checked})}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingGroup(null)}>Cancel</Button>
            <Button onClick={handleUpdateGroup}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default TrackGroupsManager;
