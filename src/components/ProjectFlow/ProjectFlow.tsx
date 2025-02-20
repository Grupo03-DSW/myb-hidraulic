"use client";
import { FlowStage } from "@/components/ProjectFlow/FlowStage";
import Timeline from "@mui/lab/Timeline";
import { stageLabels } from "@/lib/utils";
import { useState } from "react";
import { useMediaQuery } from "@mui/material";
import { ChevronDown } from "lucide-react";

const MyBTimeline = ({
  etapa,
  isMobile,
}: {
  etapa: number;
  isMobile: boolean;
}) => {
  return (
    <Timeline position={isMobile ? "right" : "alternate"}>
      {stageLabels.map((label, index) => (
        <FlowStage
          key={index}
          label={label}
          isCurrent={etapa === index}
          isCompleted={etapa > index}
        />
      ))}
    </Timeline>
  );
};

export function ProjectFlow({ etapa = 0 }: { etapa?: number }) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="flex justify-evenly w-full items-center">
      {isMobile ? (
        <div className="w-10/12 flex flex-col items-center justify-center mx-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-3 rounded-lg shadow-md bg-primary flex items-center justify-between hover:bg-primary-foreground/80 transition-colors"
          >
            <span className="font-medium text-background">
              Flujo del Proyecto
            </span>
            <ChevronDown
              className={`w-5 h-5 text-background transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`mt-2 overflow-hidden h-full transition-all duration-300 ease-in-out origin-top ${
              isOpen
                ? "opacity-100 translate-y-0 scale-100"
                : "max-h-0 opacity-0 -translate-y-4 scale-95"
            }`}
          >
            <div className="content-form-group">
              <MyBTimeline etapa={etapa} isMobile={isMobile} />
            </div>
          </div>
        </div>
      ) : (
        <MyBTimeline etapa={etapa} isMobile={isMobile} />
      )}
    </div>
  );
}
