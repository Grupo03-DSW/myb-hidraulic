import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const stageLabels = [
  "Asignando Repuestos",
  "Asignando Reparacion",
  "Reparando",
  "Control de Calidad",
  "Generando informe de Control de Calidad",
  "Asignando pintado y embalaje",
  "Pintando y embalando",
  "Generando informe de ventas",
  "Terminado",
];
