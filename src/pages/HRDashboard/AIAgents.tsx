import React, { useState, useEffect } from "react";
import { CpuIcon, Settings, Power, RotateCw, AlertCircle, CheckCircle, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const AIAgents = () => {
  const [agents, setAgents] = useState([]);
  const [systemStats, setSystemStats] = useState({
    activeAgents: 0,
    systemLoad: 0,
    averageAccuracy: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAIAgents() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('ai_agents')
          .select('*');

        if (error) {
          console.error("Error fetching AI agents:", error);
        } else if (data) {
          // Process agents data to add tasks (which would be in a separate table in a real app)
          // For now, we'll generate mock tasks for each agent
          const processedAgents = data.map(agent => {
            const mockTasks = [
              { id: `${agent.id}-1`, name: `${agent.agent_name} Task 1`, status: getRandomStatus() },
              { id: `${agent.id}-2`, name: `${agent.agent_name} Task 2`, status: getRandomStatus() },
              { id: `${agent.id}-3`, name: `${agent.agent_name} Task 3`, status: getRandomStatus() }
            ];
            
            return {
              ...agent,
              tasks: mockTasks
            };
          });
          
          setAgents(processedAgents);
          
          // Calculate system statistics
          const activeCount = data.filter(agent => agent.status === 'Active').length;
          
          // Make sure accuracy_rate is treated as a number with a default of 0 if null
          const avgAccuracy = data.length > 0 ? 
            data.reduce((sum, agent) => sum + (typeof agent.accuracy_rate === 'number' ? agent.accuracy_rate : 0), 0) / data.length : 
            0;
          
          setSystemStats({
            activeAgents: activeCount,
            systemLoad: Math.floor(Math.random() * 30) + 50, // Random load between 50-80%
            averageAccuracy: Math.round(avgAccuracy)
          });
        }
      } catch (error) {
        console.error("Error in fetching AI agents:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAIAgents();
  }, []);

  const getRandomStatus = () => {
    const statuses = ['done', 'in-progress', 'error', 'queued'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500';
      case 'Inactive':
        return 'bg-red-500';
      case 'Processing':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTaskStatusIcon = (status) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <RotateCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  // Format timestamp to relative time (e.g., "5 minutes ago")
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <CpuIcon className="h-6 w-6" />
              AI Agents
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor and control recruitment AI agents
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <RotateCw className="mr-1.5 h-4 w-4" />
              Refresh
            </Button>
            <Button className="bg-[#3b82f6] hover:bg-blue-700">
              <Zap className="mr-1.5 h-4 w-4" />
              Optimize All
            </Button>
          </div>
        </div>

        {/* System Health */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">System Health</CardTitle>
            <CardDescription>Overall AI system performance and status</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Agents</h4>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {loading ? "..." : `${systemStats.activeAgents}/${agents.length}`}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 mt-2 rounded-full">
                <div 
                  className="bg-green-500 h-1.5 rounded-full" 
                  style={{ width: loading ? '0%' : `${(systemStats.activeAgents / agents.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">System Load</h4>
                <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                  {loading ? "..." : `${systemStats.systemLoad}%`}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 mt-2 rounded-full">
                <div 
                  className="bg-yellow-500 h-1.5 rounded-full" 
                  style={{ width: loading ? '0%' : `${systemStats.systemLoad}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Accuracy</h4>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {loading ? "..." : `${systemStats.averageAccuracy}%`}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 mt-2 rounded-full">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full" 
                  style={{ width: loading ? '0%' : `${systemStats.averageAccuracy}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-10">Loading AI agents...</div>
          ) : agents.length > 0 ? (
            agents.map(agent => (
              <Card key={agent.id} className={cn(
                "bg-white dark:bg-gray-800 border-l-4",
                agent.status === 'Active' ? "border-l-green-500" :
                agent.status === 'Inactive' ? "border-l-red-500" :
                "border-l-yellow-500"
              )}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(agent.status)}`}></div>
                      <CardTitle className="text-base">{agent.agent_name}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{agent.agent_type}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5 mb-3">
                    <div className="flex justify-between">
                      <span>Last Activity:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {getRelativeTime(agent.last_activity)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Version:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {agent.configuration?.version || "1.0.0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {Math.round(agent.accuracy_rate)}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Current Tasks</h4>
                    <ul className="space-y-1">
                      {agent.tasks.map(task => (
                        <li key={task.id} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-700/30 px-2.5 py-1.5 rounded">
                          <span>{task.name}</span>
                          {getTaskStatusIcon(task.status)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              No AI agents found. Add your first agent to get started.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIAgents;
