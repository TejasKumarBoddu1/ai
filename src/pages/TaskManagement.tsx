import React from 'react';
import Layout from '@/components/layout/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ClockIcon, 
  BarChart3Icon, 
  CalendarIcon, 
  TargetIcon, 
  ListTodoIcon, 
  SparklesIcon,
  AlertTriangleIcon,
  ArrowRightIcon
} from "lucide-react";
import { generateQwiXProContent, getCareerSimulatorMockData } from "@/utils/qwixProApi";
import { toast } from "@/components/ui/use-toast";

const TaskManagement = () => {
  return (
    <Layout>
      <div className="container max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-2">Task Management</h1>
        <p className="text-gray-600 mb-8">
          Organize and manage your tasks efficiently
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
              <CardDescription>
                Create a new task to track
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Task Title
                </label>
                <Input 
                  placeholder="Enter task title" 
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Description
                </label>
                <Textarea 
                  placeholder="Enter task description" 
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Due Date
                </label>
                <Input 
                  type="date"
                />
              </div>
              <Button className="w-full">
                Add Task
              </Button>
            </CardContent>
          </Card>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Task List</CardTitle>
                <CardDescription>
                  Manage your current tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="all">All Tasks</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Complete project proposal</h3>
                          <p className="text-sm text-gray-500">Due: Tomorrow</p>
                        </div>
                        <Button variant="outline" size="sm">Mark Complete</Button>
                      </div>
                      <p className="text-sm mt-2">Finish the project proposal for the client meeting.</p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Review resume</h3>
                          <p className="text-sm text-gray-500">Due: Next week</p>
                        </div>
                        <Button variant="outline" size="sm">Mark Complete</Button>
                      </div>
                      <p className="text-sm mt-2">Review and update resume with recent experience.</p>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold line-through text-gray-500">Submit application</h3>
                          <p className="text-sm text-gray-500">Completed: Yesterday</p>
                        </div>
                        <Button variant="ghost" size="sm">Undo</Button>
                      </div>
                      <p className="text-sm mt-2 text-gray-500">Submit job application to tech company.</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pending" className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Complete project proposal</h3>
                          <p className="text-sm text-gray-500">Due: Tomorrow</p>
                        </div>
                        <Button variant="outline" size="sm">Mark Complete</Button>
                      </div>
                      <p className="text-sm mt-2">Finish the project proposal for the client meeting.</p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Review resume</h3>
                          <p className="text-sm text-gray-500">Due: Next week</p>
                        </div>
                        <Button variant="outline" size="sm">Mark Complete</Button>
                      </div>
                      <p className="text-sm mt-2">Review and update resume with recent experience.</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="completed" className="space-y-4">
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold line-through text-gray-500">Submit application</h3>
                          <p className="text-sm text-gray-500">Completed: Yesterday</p>
                        </div>
                        <Button variant="ghost" size="sm">Undo</Button>
                      </div>
                      <p className="text-sm mt-2 text-gray-500">Submit job application to tech company.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TaskManagement;
