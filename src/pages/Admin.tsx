
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, UserCog, Shield, ListFilter } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface User {
  id: string;
  email: string;
  role: string;
}

interface Track {
  id: string;
  name: string;
}

interface Permission {
  id: string;
  user_id: string;
  track_id: string;
  can_view: boolean;
  can_edit: boolean;
}

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin()) {
      navigate('/');
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You don't have permission to access the admin page.",
      });
    } else if (!loading && user) {
      fetchUsers();
      fetchTracks();
      fetchPermissions();
    }
  }, [loading, user, navigate, isAdmin]);

  const fetchUsers = async () => {
    try {
      // Get profiles and join with user_roles
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          user_roles (
            role
          )
        `);

      if (error) throw error;

      const formattedUsers = data.map((profile: any) => ({
        id: profile.id,
        email: profile.username,
        role: profile.user_roles[0]?.role || 'viewer'
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users.",
      });
    }
  };

  const fetchTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('id, name');

      if (error) throw error;
      setTracks(data);
      setIsLoadingData(false);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tracks.",
      });
      setIsLoadingData(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('track_permissions')
        .select('*');

      if (error) throw error;
      setPermissions(data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // First delete existing role
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Then insert new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role: newRole }]);

      if (insertError) throw insertError;

      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));

      toast({
        title: "Role updated",
        description: `User role has been updated to ${newRole}.`,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user role.",
      });
    }
  };

  const updateTrackPermission = async (
    userId: string, 
    trackId: string, 
    field: 'can_view' | 'can_edit', 
    value: boolean
  ) => {
    try {
      // Check if permission already exists
      const existingPermission = permissions.find(
        p => p.user_id === userId && p.track_id === trackId
      );

      if (existingPermission) {
        // Update existing permission
        const { error } = await supabase
          .from('track_permissions')
          .update({ [field]: value })
          .eq('id', existingPermission.id);

        if (error) throw error;

        // Update local state
        setPermissions(permissions.map(p => 
          p.id === existingPermission.id ? { ...p, [field]: value } : p
        ));
      } else {
        // Create new permission
        const newPermission = {
          user_id: userId,
          track_id: trackId,
          can_view: field === 'can_view' ? value : true, // Default view to true
          can_edit: field === 'can_edit' ? value : false // Default edit to false
        };

        const { data, error } = await supabase
          .from('track_permissions')
          .insert([newPermission])
          .select();

        if (error) throw error;

        // Update local state
        setPermissions([...permissions, data[0]]);
      }

      toast({
        title: "Permission updated",
        description: "Track permission has been updated.",
      });
    } catch (error) {
      console.error('Error updating track permission:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update track permission.",
      });
    }
  };

  // Helper to check permissions
  const getPermission = (userId: string, trackId: string, type: 'can_view' | 'can_edit') => {
    const permission = permissions.find(
      p => p.user_id === userId && p.track_id === trackId
    );
    return permission ? permission[type] : (type === 'can_view');
  };

  if (loading || isLoadingData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users" className="flex items-center">
            <UserCog className="h-4 w-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Track Permissions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Roles</CardTitle>
              <CardDescription>
                Manage user roles and access levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value) => updateUserRole(user.id, value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                        >
                          Manage Permissions
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Track Permissions</CardTitle>
              <CardDescription>
                Control which users can view and edit specific tracks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px] min-w-[200px]">User</TableHead>
                      {tracks.map((track) => (
                        <TableHead key={track.id} className="text-center min-w-[120px]">
                          {track.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        {tracks.map((track) => (
                          <TableCell key={`${user.id}-${track.id}`} className="text-center">
                            <div className="flex flex-col items-center space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${user.id}-${track.id}-view`}
                                  checked={getPermission(user.id, track.id, 'can_view')}
                                  onCheckedChange={(checked) => 
                                    updateTrackPermission(user.id, track.id, 'can_view', !!checked)
                                  }
                                />
                                <label htmlFor={`${user.id}-${track.id}-view`} className="text-xs">
                                  View
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${user.id}-${track.id}-edit`}
                                  checked={getPermission(user.id, track.id, 'can_edit')}
                                  onCheckedChange={(checked) => 
                                    updateTrackPermission(user.id, track.id, 'can_edit', !!checked)
                                  }
                                />
                                <label htmlFor={`${user.id}-${track.id}-edit`} className="text-xs">
                                  Edit
                                </label>
                              </div>
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
