import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type UserData = {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  profile_picture?: string;
  created_at?: string;
};

const Everyone = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { toast } = useToast();

  // Only admins can see edit and delete controls
  const isAdmin = user?.role === 'admin';

  // Fetch all users - Using service role to bypass RLS restrictions
  const fetchUsers = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      console.log("Attempting to fetch ALL users from profiles table...");
      
      // Standard fetch - will be subject to RLS policies
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log("Fetch profiles result:", { 
        data: profileData?.length || 0, 
        error: profileError?.message || null,
        hasError: !!profileError
      });
      
      if (profileError) {
        throw profileError;
      }

      if (!profileData || profileData.length === 0) {
        console.log("No profiles found in the database");
        setUsers([]);
        return;
      }

      console.log(`Found ${profileData.length} profiles`);

      // Map profile data to user format
      const mappedUsers = profileData.map((profile) => {
        return {
          id: profile.id,
          email: profile.email || "No email",
          full_name: profile.full_name,
          role: profile.role,
          profile_picture: profile.profile_picture,
          created_at: profile.created_at
        };
      });

      console.log("Mapped users:", mappedUsers);
      setUsers(mappedUsers);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
      toast({
        title: "Error",
        description: `Failed to fetch users: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewUser = (user: UserData) => {
    setCurrentUser(user);
    setShowViewDialog(true);
  };
  
  const handleDeleteClick = (user: UserData) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };
  
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setDeleteLoading(true);
    try {
      console.log("Deleting user:", userToDelete.id);
      
      // 1. First delete associated data (resumes, etc)
      const { error: resumesError } = await supabase
        .from('resumes')
        .delete()
        .eq('user_id', userToDelete.id);
        
      if (resumesError) {
        console.error("Error deleting user resumes:", resumesError);
      }
      
      // 2. Delete profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id);
        
      if (profileError) {
        throw profileError;
      }
      
      // 3. Delete auth user (requires admin key, done in edge function)
      const { error: authError } = await supabase.functions.invoke('delete-user', {
        body: { userId: userToDelete.id }
      });
      
      if (authError) {
        throw authError;
      }
      
      // Success - remove from UI
      setUsers(users.filter(u => u.id !== userToDelete.id));
      
      toast({
        title: "User Deleted",
        description: `${userToDelete.full_name || userToDelete.email} has been permanently deleted.`,
      });
      
      setShowDeleteDialog(false);
      setUserToDelete(null);
    } catch (err: any) {
      console.error("Error deleting user:", err);
      toast({
        title: "Error",
        description: `Failed to delete user: ${err.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <div className="container mx-auto py-8 flex-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">All Users</CardTitle>
            <Button 
              variant="outline" 
              onClick={() => fetchUsers()}
              disabled={loading}
            >
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-b-transparent border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>{error}</p>
                <Button 
                  variant="outline" 
                  onClick={() => fetchUsers()} 
                  className="mt-4"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              {user.profile_picture ? (
                                <AvatarImage src={user.profile_picture} alt={user.full_name || "User"} />
                              ) : null}
                              <AvatarFallback>
                                {user.full_name
                                  ? user.full_name.substring(0, 2).toUpperCase()
                                  : user.email.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.full_name || "N/A"}</p>
                              <p className="text-xs text-gray-500">{user.id.substring(0, 8)}...</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' 
                              ? 'bg-red-100 text-red-800' 
                              : user.role === 'organization' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role || "student"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.created_at 
                            ? new Date(user.created_at).toLocaleString() 
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewUser(user)}
                              title="View user details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {isAdmin && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteClick(user)}
                                title="Delete user permanently"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View User Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-20 w-20">
                  {currentUser.profile_picture ? (
                    <AvatarImage src={currentUser.profile_picture} alt={currentUser.full_name || "User"} />
                  ) : null}
                  <AvatarFallback className="text-lg">
                    {currentUser.full_name
                      ? currentUser.full_name.substring(0, 2).toUpperCase()
                      : currentUser.email.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold">ID:</div>
                <div>{currentUser.id}</div>
                <div className="font-semibold">Name:</div>
                <div>{currentUser.full_name || "N/A"}</div>
                <div className="font-semibold">Email:</div>
                <div>{currentUser.email}</div>
                <div className="font-semibold">Role:</div>
                <div>{currentUser.role || "student"}</div>
                <div className="font-semibold">Created At:</div>
                <div>
                  {currentUser.created_at 
                    ? new Date(currentUser.created_at).toLocaleString() 
                    : "N/A"}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Permanently</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete?.full_name || userToDelete?.email}? 
              This action cannot be undone and will delete all of their data, including:
              
              <ul className="list-disc pl-5 mt-2">
                <li>Profile information</li>
                <li>All resumes and documents</li>
                <li>Authentication data</li>
                <li>Any other associated records</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteUser();
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></span>
                  Deleting...
                </>
              ) : (
                "Delete Permanently"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Everyone;
