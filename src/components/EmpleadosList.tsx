import React from "react";
import { EmpleadoForm } from "@/models/empleado";
import { EmpleadoPictureCard } from "@/components/EmpleadoPictureCard";

interface EmpleadoListProps<T extends EmpleadoForm> {
  messageNothingAdded: string;
  empleados: T[];
  className?: string;
  selector?: (index: number, item: T) => React.ReactNode;
  error?: (index: number) => React.ReactNode;
}

export function EmpleadosList<T extends EmpleadoForm>({
  messageNothingAdded,
  empleados,
  className,
  selector,
  error,
}: EmpleadoListProps<EmpleadoForm>) {
  return (
    <div
      className={`mx-3 ${className} grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}
    >
      {empleados.length === 0 ? (
        <p className="w-full text-center text-gray-500">
          {messageNothingAdded}
        </p>
      ) : (
        empleados.map((empleado, index) => (
          <div
            key={empleado.idEmpleado}
            className="p-4 rounded-md border shadow-sm bg-white/35 flex flex-col space-y-2"
          >
            {/* Imagen */}
            <div className="flex flex-row items-center justify-between">
              <div className="w-1/2">
                <EmpleadoPictureCard empleado={empleado} />
              </div>
              {/* Selector opcional */}
              {selector && (
                <div className="my-auto">{selector(index, empleado as T)}</div>
              )}
            </div>
            {/* Información del empleado */}
            <div className="flex-1 flex flex-col items-start">
              <span className="text-lg font-medium text-gray-800">{`${empleado.nombre} ${empleado.apellido}`}</span>
              <p className="text-sm text-gray-600">{empleado.correo}</p>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="mt-2 text-red-500 text-sm">{error(index)}</div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
