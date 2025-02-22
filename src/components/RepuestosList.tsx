"use client";
import React, { useEffect, useRef, useState } from "react";
import { Repuesto } from "@/models/repuesto";
import { PictureCard } from "@/components/PictureCard";
import { cn } from "@/lib/utils";

export function RepuestosList<T extends Repuesto>({
  messageNothingAdded,
  repuestos,
  className,
  repuestoCardClassName,
  counter,
  remover,
  selector,
  error,
}: {
  messageNothingAdded: string;
  repuestos: T[];
  repuestoCardClassName?: string;
  className?: string;
  counter?: (index: number, item: T) => React.ReactNode;
  remover?: (index: number, item: T) => React.ReactNode;
  selector?: (index: number, item: T) => React.ReactNode;
  error?: (index: number) => React.ReactNode;
  children?: React.ReactNode;
}) {
  const [infoOpen, setInfoOpen] = useState<number>();

  return (
    <div className={`mx-3 ${className}`} style={{ height: "40h" }}>
      {repuestos.length === 0 ? (
        <div className="flex items-center justify-center h-40 lg:col-span-2">
          <p className="text-lg text-center">{messageNothingAdded}</p>
        </div>
      ) : (
        repuestos.map((item, index) => (
          <RepCardWrapper
            key={item.idRepuesto}
            repuesto={item}
            infoOpen={infoOpen}
          >
            <div
              className={cn(
                "flex flex-row items-center justify-center space-x-4 p-4 h-32 w-full border rounded-xl overflow-hidden bg-white/35",
                repuestoCardClassName
              )}
            >
              {item.linkImg && (
                <PictureCard
                  imageSrc={item.linkImg}
                  name={item.nombre}
                  className="w-1/5 h-full overflow-hidden"
                />
              )}
              <div
                className="flex-1 space-y-1 w-2/5 h-full py-2 my-2 cursor-default"
                onMouseEnter={() => {
                  setInfoOpen(item.idRepuesto);
                }}
                onMouseLeave={() => {
                  setInfoOpen(undefined);
                }}
              >
                <p className="text-sm font-medium leading-none">
                  {item.nombre}
                </p>
                {/* <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap"> */}
                <p className="w-full h-1/2 text-sm text-muted-foreground overflow-hidden line-clamp-3 text-ellipsis">
                  {/* {item.descripcion.length > (isMd ? 80 : 20)
                    ? `${item.descripcion.substring(0, (isMd ? 80 : 20))}...`
                    : item.descripcion} */}
                  {item.descripcion}
                </p>
              </div>
              {/* Form mode */}
              {counter || selector ? (
                <div
                  className={cn(
                    "self-center gap-4 w-2/5",
                    counter &&
                      selector &&
                      " flex flex-col md:grid md:grid-cols-2"
                  )}
                >
                  {counter && (
                    <div className="w-full flex items-center justify-center">
                      {counter(index, item as T)}
                    </div>
                  )}
                  {selector && (
                    <div className="w-full flex items-center justify-center">
                      {selector(index, item as T)}
                    </div>
                  )}
                </div>
              ) : (
                /* Visualize mode */
                <div className="flex flex-col justify-center items-center gap-2 px-3">
                  <p className="text-4xl font-extralight">
                    {item.stockDisponible}
                    {item.cantidad && `/${item.cantidad}`}
                  </p>
                </div>
              )}
            </div>
            {remover && remover(index, item as T)}
            {error && error(index)}
          </RepCardWrapper>
        ))
      )}
    </div>
  );
}

const RepCardWrapper = ({
  repuesto,
  infoOpen,
  children,
}: {
  repuesto: Repuesto;
  infoOpen?: number;
  children?: React.ReactNode;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<"top" | "bottom">(
    "bottom"
  );

  useEffect(() => {
    const updateTooltipPosition = () => {
      if (!cardRef.current) return;

      const cardRect = cardRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - cardRect.bottom;
      const spaceAbove = cardRect.top;
      console.log(
        "position - ",
        repuesto.idRepuesto,
        " - ",
        spaceBelow < 100 && spaceAbove > 100 ? "top" : "bottom"
      );
      // If there's more space above than below, show tooltip on top
      setTooltipPosition(
        spaceBelow < 100 && spaceAbove > 100 ? "top" : "bottom"
      );
    };

    updateTooltipPosition();
    window.addEventListener("scroll", updateTooltipPosition);
    window.addEventListener("resize", updateTooltipPosition);

    return () => {
      window.removeEventListener("scroll", updateTooltipPosition);
      window.removeEventListener("resize", updateTooltipPosition);
    };
  }, []);

  return (
    <div className={`pt-2 h-min w-full relative`} ref={cardRef}>
      {children}
      {infoOpen === repuesto.idRepuesto &&
        (tooltipPosition === "bottom" ? (
          <div className="absolute z-[10000] bottom-4 left-1/4 w-1/2 flex items-center justify-center transition-opacity duration-200 ease-in opacity-0 animate-fadeIn">
            <div className="absolute top-0 left-1/4 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-secondary-foreground"></div>

            <div className="absolute top-2 w-full bg-secondary-foreground rounded-lg p-4">
              <span className="text-white text-sm font-medium">
                {repuesto.nombre}
              </span>
              <p className="text-white text-xs">{repuesto.descripcion}</p>
            </div>
          </div>
        ) : (
          <div className="absolute z-[10000] bottom-full left-1/4 w-1/2 flex items-center justify-center transition-opacity duration-200 ease-in opacity-0 animate-fadeIn">
            <div className="absolute -bottom-2 left-1/4 w-0 h-0 border-r-8 border-r-transparent border-l-8 border-l-transparent border-t-8 border-t-secondary-foreground"></div>

            <div className="absolute -bottom-0 w-full bg-secondary-foreground rounded-lg p-4">
              <span className="text-white text-sm font-medium">
                {repuesto.nombre}
              </span>
              <p className="text-white text-xs">{repuesto.descripcion}</p>
            </div>
          </div>
        ))}
    </div>
  );
};
