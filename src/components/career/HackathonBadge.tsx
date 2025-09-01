
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const HackathonBadge = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-indigo-900 cursor-help">
            <span className="mr-1">🔬</span>
            <span>Hackathon Innovation</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs">
            <p className="font-medium">GenAI Hackathon Project</p>
            <p className="text-xs mt-1">
              This experimental AI career planner module was developed by QwikZen Group India as part of a GenAI Hackathon project.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
