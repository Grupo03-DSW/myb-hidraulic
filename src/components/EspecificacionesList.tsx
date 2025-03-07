import React from "react";
import { EspecificacionPrueba } from "@/models/especificacion";
import { PruebasTable } from "@/components/PruebasTable";

type ResultadosForm = {
  idTipoPrueba: number;
  especificaciones: {
    idParametro: number;
    resultado: number;
  }[];
};

interface EspecificacionesListProps {
  especificaciones: ResultadosForm[];
  especificacionesOriginales: EspecificacionPrueba[];
  messageNothingAdded: string;
  className?: string;
  counterResult: (prueba_index: number, espec_index: number) => React.ReactNode;
  error?: (index: number) => React.ReactNode;
}

export function EspecificacionesList({
  especificaciones,
  especificacionesOriginales,
  messageNothingAdded,
  className,
  counterResult,
  error,
}: EspecificacionesListProps) {
  return (
    <PruebasTable
      pruebas={especificaciones}
      pruebasOriginales={especificacionesOriginales}
      className={className}
      messageNothingAdded={messageNothingAdded}
      columnas={
        <>
          <th scope="col" className="px-2 py-3  text-xs font-medium">
            Resultado
          </th>
          <th scope="col" className="px-2 py-3  text-xs font-medium">
            Min.
          </th>
          <th scope="col" className="px-2 py-3  text-xs font-medium">
            Max.
          </th>
        </>
      }
      filas={(prueba_index, espec_index, especificacion) => (
        <>
          <td className="px-2 min-w-16 py-4">
            {counterResult(prueba_index, espec_index)}
          </td>
          <td className="px-2 py-4">{especificacion.valorMinimo}</td>
          <td className="px-2 py-4">{especificacion.valorMaximo}</td>
        </>
      )}
      error={error}
    />
  );
}
