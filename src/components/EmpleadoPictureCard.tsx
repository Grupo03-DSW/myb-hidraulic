"use client"
import React from "react";
import Image from "next/image";
import { Empleado } from "@/models/empleado";

export function EmpleadoPictureCard({
  empleado,
  enableOnHoverInfo
}: {
  empleado: Pick<Empleado, "nombre" | "apellido" | "linkImg" | "correo" | "telefono" | "direccion" | "rol">;
  enableOnHoverInfo?: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center group">
      {/* Imagen del empleado */}
      <div className="w-16 h-16 rounded-full overflow-hidden relative bg-gray-200 border border-gray-300 shadow">
        {empleado.linkImg ? (
          <Image
            src={empleado.linkImg}
            alt={`Foto de ${empleado.nombre} ${empleado.apellido}`}
            fill
            className="object-cover"
          />
        ) : null}
      </div>

      {/* Información emergente al hacer hover */}
      {enableOnHoverInfo && (
        <div className="absolute z-[10000] left-0 transform -translate-x-2/3 top-full opacity-0 hidden group-hover:opacity-100 group-hover:flex group-hover:flex-col transition-opacity duration-300 bg-white p-4 rounded-lg shadow-lg border border-gray-300 w-64">
          <h3 className="font-bold text-lg text-center">
            {empleado.nombre} {empleado.apellido}
          </h3>
          {empleado.correo && <p className="text-sm text-gray-600">Correo: {empleado.correo}</p>}
          {empleado.telefono && <p className="text-sm text-gray-600">Teléfono: {empleado.telefono}</p>}
          {empleado.direccion && <p className="text-sm text-gray-600">Dirección: {empleado.direccion}</p>}
          {empleado.rol && <p className="text-sm text-gray-600">Rol: {empleado.rol}</p>}
        </div>
      )}
    </div>
  );
}
