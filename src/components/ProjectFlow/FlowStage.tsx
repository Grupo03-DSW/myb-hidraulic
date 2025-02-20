"use client";
import React from "react";
import { cn } from "@/lib/utils";
import {
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import { Bookmark, CircleCheck, Clock } from "lucide-react";

export const FlowStage = ({
  isCurrent,
  isCompleted,
  label,
}: {
  isCurrent: boolean;
  isCompleted: boolean;
  label: string;
}) => {
  return (
    <TimelineItem>
      <TimelineSeparator>
        {isCompleted ? (
          <CircleCheck size={24} className="my-1" />
        ) : isCurrent ? (
          <Bookmark size={24} className="my-1" />
        ) : (
          <Clock size={24} className="my-1" />
        )}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <p className={cn((isCompleted || isCurrent) && "font-semibold")}>
          {label}
        </p>
      </TimelineContent>
    </TimelineItem>
  );
};
