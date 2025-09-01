
import React, { useEffect, useState } from "react";
import { CareerPath, CareerNode } from "@/types/career";
import { ArrowRight } from "lucide-react";

interface CareerPathVisualizationProps {
  path: CareerPath;
  onRoleSelect: (role: CareerNode) => void;
}

export const CareerPathVisualization = ({ path, onRoleSelect }: CareerPathVisualizationProps) => {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  // Set up path colors based on the path type
  const getPathColor = () => {
    switch(path.type) {
      case "ambitious":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          nodeColor: "bg-blue-500",
          nodeHover: "hover:bg-blue-600",
          nodeBorder: "border-blue-600",
          nodeSelected: "ring-blue-300",
          arrow: "text-blue-500"
        };
      case "skills":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-700",
          nodeColor: "bg-emerald-500",
          nodeHover: "hover:bg-emerald-600",
          nodeBorder: "border-emerald-600",
          nodeSelected: "ring-emerald-300",
          arrow: "text-emerald-500"
        };
      case "balanced":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          text: "text-purple-700",
          nodeColor: "bg-purple-500",
          nodeHover: "hover:bg-purple-600", 
          nodeBorder: "border-purple-600",
          nodeSelected: "ring-purple-300",
          arrow: "text-purple-500"
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          nodeColor: "bg-gray-500",
          nodeHover: "hover:bg-gray-600",
          nodeBorder: "border-gray-600", 
          nodeSelected: "ring-gray-300",
          arrow: "text-gray-500"
        };
    }
  };

  const colors = getPathColor();

  const handleNodeClick = (index: number, role: CareerNode) => {
    setSelectedNode(index);
    onRoleSelect(role);
  };

  useEffect(() => {
    // Reset selection when path changes
    setSelectedNode(null);
  }, [path]);

  return (
    <div className="w-full h-full p-8 overflow-auto">
      <div className={`w-full h-full rounded-lg p-4 flex flex-col justify-center relative ${colors.bg}`}>
        <div className="flex items-center justify-between w-full relative">
          {/* Path timeline */}
          <div className={`absolute top-1/2 left-0 w-full h-1 ${colors.border} bg-opacity-70 transform -translate-y-1/2`}></div>
          
          {/* Career nodes */}
          <div className="relative w-full flex justify-between items-center z-10">
            {path.nodes.map((node, index) => (
              <div key={index} className="flex flex-col items-center relative">
                {/* Node marker */}
                <button
                  className={`
                    w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all
                    ${colors.nodeColor} ${colors.nodeHover}
                    ${selectedNode === index ? `ring-4 ${colors.nodeSelected}` : ''}
                    shadow-md
                  `}
                  onMouseEnter={() => setHoveredNode(index)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleNodeClick(index, node)}
                >
                  <span className="text-white text-sm font-bold">
                    {node.yearsFromNow > 0 ? `+${node.yearsFromNow}y` : 'NOW'}
                  </span>
                </button>
                
                {/* Node label */}
                <div className={`text-center mt-4 ${selectedNode === index ? 'font-bold' : ''}`}>
                  <p className={`text-base ${colors.text} font-semibold whitespace-nowrap`}>
                    {node.title}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    {node.stage}
                  </p>
                </div>
                
                {/* Arrows between nodes */}
                {index < path.nodes.length - 1 && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                    <ArrowRight className={`w-6 h-6 ${colors.arrow}`} />
                  </div>
                )}
                
                {/* Tooltips */}
                {hoveredNode === index && (
                  <div className="absolute top-[-120px] left-1/2 transform -translate-x-1/2 z-20">
                    <div className={`p-3 rounded-lg shadow-lg bg-white border ${colors.border}`}>
                      <p className="font-semibold">{node.title}</p>
                      <p className="text-sm text-gray-600">{node.salaryRange}</p>
                      <p className="text-xs mt-1 text-gray-500">Click for details</p>
                    </div>
                    <div className={`w-3 h-3 rotate-45 bg-white border-b border-r ${colors.border} absolute -bottom-1.5 left-1/2 transform -translate-x-1/2`}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
