"use client";
import { cn } from "@/lib/utils";
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import { Bookmark, CircleCheck, Clock } from "lucide-react";

export function FlowStage({
  isCurrent,
  isCompleted,
  label,
}: {
  isCurrent: boolean;
  isCompleted: boolean;
  label: string;
}) {
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
}
