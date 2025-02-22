"use client";
import { useState } from "react";
import { Proyecto } from "@/models/proyecto";
import ProjectDetailsModal from "@/components/ProyectDetailsModal";
import { Button } from "@/components/ui/button";
import { EmpleadoPictureCard } from "@/components/EmpleadoPictureCard";

export function ProyectoHeader({
  proyecto,
  showSeeDetailsBtn,
}: {
  proyecto: Proyecto;
  showSeeDetailsBtn: boolean;
}) {
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <div className="flex flex-row justify-between items-start md:items-center w-full gap-4">
      <ProjectDetailsModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
        }}
        proyecto={proyecto}
      />
      {/* Título y detalles del proyecto */}
      <div className="flex flex-col gap-2 w-full md:w-auto">
        <div className="flex flex-row items-center justify-between gap-4">
          <h1 className="font-bold text-3xl">{proyecto.titulo}</h1>
          {showSeeDetailsBtn && (
            <Button onClick={() => setDetailOpen(true)}>Ver Detalles</Button>
          )}
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <h4 className="text-xl">{proyecto.cliente?.nombre}</h4>
        </div>
      </div>
      {/* Empleados actuales */}
      <div className="flex gap-2 flex-wrap md:flex-nowrap h-auto md:h-20">
        {proyecto.empleadosActuales?.map((empleado) => (
          <EmpleadoPictureCard
            key={empleado.idEmpleado}
            empleado={empleado}
            enableOnHoverInfo
          />
        ))}
      </div>
    </div>
  );
}
