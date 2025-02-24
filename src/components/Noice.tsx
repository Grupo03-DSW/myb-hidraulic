"use client";
import { NoiceType } from "@/models/noice";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoadingGear } from "./LoadingGear";
import { LoadingTyping } from "./LoadingTyping";
import { Settings, CircleCheck, CircleX } from "lucide-react";

interface NoiceProps {
  noice: NoiceType;
}

export function Noice({ noice }: NoiceProps) {
  if (noice.type === "loading") {
    return (
      <div
        className={cn(
          "fixed z-[30000] inset-0 flex items-center justify-center bg-background",
          noice.styleType === "modal" && "bg-black bg-opacity-50"
        )}
      >
        <div
          role="status"
          className={cn(
            "max-w-sm bg-background rounded-lg shadow-xl p-3",
            noice.styleType === "modal" && "z-50"
          )}
        >
          <div className="flex flex-col justify-center items-center border-2 border-primary-foreground shadow-lg bg-white/35 rounded-lg gap-4 p-5">
            <LoadingGear size="lg" color="text-primary-foreground" />
            <LoadingTyping text={noice.message} size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (noice.type === "error") {
    return (
      <div
        className={cn(
          "fixed  z-[30000] right-0 top-0 w-lvw h-lvh flex items-center justify-center bg-white",
          noice.styleType === "modal" && "bg-black bg-opacity-50"
        )}
      >
        <div
          role="status"
          className={cn(
            "max-w-sm bg-background rounded-lg shadow-xl p-3",
            noice.styleType === "modal" && "z-50"
          )}
        >
          <div className="flex flex-col justify-center items-center border-2 border-primary-foreground shadow-lg bg-white/35 rounded-lg gap-4 p-5">
            <div className="relative">
              <Settings
                width={150}
                height={150}
                strokeWidth={1}
                className="animate-failedCircularDash"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  ">
                <CircleX
                  size={70}
                  className="animate-jump bg-background rounded-full text-red-700"
                />
              </div>
            </div>
            <p className="flex flex-col items-center text-sm font-medium text-primary-foreground gap-y-4 text-red-700">
              {noice.message || "Todo salio bien."}
            </p>
            <div className="w-2/3 flex flex-col items-center gap-y-2">
              <Button
                onClick={() => {
                  window.location.reload();
                }}
                variant={"outline"}
                className="text-black px-4 py-2 rounded-lg w-full min-w-min"
              >
                Volver a intentar
              </Button>
              <a className="w-full" href="/">
                <Button variant={"destructive"} className="text-white bg-red-700 px-4 py-2 rounded-lg w-full">
                  Ir al inicio
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (noice.type === "success") {
    return (
      <div
        className={cn(
          "fixed  z-[30000] right-0 top-0 w-lvw h-lvh flex items-center justify-center bg-background",
          noice.styleType === "modal" && "bg-black bg-opacity-50"
        )}
      >
        <div
          role="status"
          className={cn(
            "max-w-sm bg-background rounded-lg shadow-xl p-3",
            noice.styleType === "modal" && "z-50"
          )}
        >
          <div className="flex flex-col justify-center items-center border-2 border-primary-foreground shadow-lg bg-white/35 rounded-lg gap-4 p-5">
            <div className="relative">
              <Settings
                width={150}
                height={150}
                strokeWidth={1}
                className="animate-circularDash"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  ">
                <CircleCheck
                  size={40}
                  className="animate-jump bg-primary-foreground rounded-full text-background"
                />
              </div>
            </div>
            <p className="flex flex-col items-center text-sm font-medium text-primary-foreground gap-y-4">
              {noice.message || "Todo salio bien."}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
