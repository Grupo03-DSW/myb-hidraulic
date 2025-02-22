"use client";
import React, { useState } from "react";
import { Proyecto } from "@/models/proyecto";
import { Repuesto } from "@/models/repuesto";
import { Empleado } from "@/models/empleado";
import { Cliente } from "@/models/cliente";
import Image from "next/image";
import { EspecificacionPrueba } from "@/models/especificacion";
import { Button } from "@/components/ui/button";
import { ResultadosModal } from "@/components/ResultadosModal";
import { EmpleadoPictureCard } from "@/components/EmpleadoPictureCard";

interface ProyectoDetalleProps {
  proyecto: Proyecto;
}

const ProyectoDetalle: React.FC<ProyectoDetalleProps> = ({ proyecto }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <div className="border-b py-4">
        <h1 className="text-4xl">{proyecto.titulo}</h1>
      </div>
      <div className="pl-4 py-2">
        <span className="text-xl">{proyecto.descripcion}</span>
        <p className="text-lg font-semibold my-2">
          Costo Total:{" "}
          <span className="text-green-600">
            ${proyecto.costoTotal?.toFixed(2) || "No calculado"}
          </span>
        </p>
      </div>
      <div className="py-2 pl-2 pr-5 space-y-10">
        {/* Cliente */}
        {proyecto.cliente && <ClienteInfo cliente={proyecto.cliente} />}

        <div className="grid grid-cols-1 gap-4 space-y-6 sm:grid-cols-2 sm:space-y-0">
          {/* Jefe */}
          {proyecto.jefe && (
            <div className="content-form-group">
              <div className="content-form-group-label">
                <label className="form-group-label">Jefe de Proyecto</label>
              </div>
              <div>
                <div
                  key={proyecto.jefe.idEmpleado}
                  className="flex items-center gap-4 p-4"
                >
                  <EmpleadoPictureCard empleado={proyecto.jefe} />
                  <div className="flex-1">
                    <p className="text-lg font-medium text-primary-foreground">{`${proyecto.jefe.nombre} ${proyecto.jefe.apellido}`}</p>
                    <p className="text-sm">{proyecto.jefe.correo}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Supervisor */}
          {proyecto.supervisor && (
            <div className="content-form-group">
              <div className="content-form-group-label">
                <label className="form-group-label">
                  Supervisor de Proyecto
                </label>
              </div>
              <div>
                <div
                  key={proyecto.supervisor.idEmpleado}
                  className="flex items-center gap-4 p-4"
                >
                  <EmpleadoPictureCard empleado={proyecto.supervisor} />
                  <div className="flex-1">
                    <p className="text-lg font-medium text-primary-foreground">{`${proyecto.supervisor.nombre} ${proyecto.supervisor.apellido}`}</p>
                    <p className="text-sm">{proyecto.supervisor.correo}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empleados */}
        {proyecto.empleadosActuales && (
          <EmpleadosInfo empleados={proyecto.empleadosActuales} />
        )}

        {/* Repuestos */}
        {proyecto.repuestos && <RepuestosInfo repuestos={proyecto.repuestos} />}

        {/* Especificaciones */}
        {proyecto.especificaciones && (
          <EspecificacionesInfo especificaciones={proyecto.especificaciones} />
        )}

        <div className="w-full flex justify-center">
          <Button
            onClick={() => setDialogOpen(true)}
            className="w-full mx-4 lg:w-1/2 bg-black text-white hover:bg-gray-600 transition-colors duration-200"
          >
            Ver Historial de Pruebas
          </Button>
        </div>
      </div>
      <ResultadosModal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        proyecto={proyecto}
      />
    </div>
  );
};

export default ProyectoDetalle;

interface ClienteInfoProps {
  cliente: Cliente;
}

const ClienteInfo: React.FC<ClienteInfoProps> = ({ cliente }) => {
  return (
    <div className="content-form-group">
      <div className="content-form-group-label">
        <label className="form-group-label">Información del Cliente</label>
      </div>
      <div className="p-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-primary-foreground">
              Nombre:
            </p>
            <p className="text-sm">{cliente.nombre}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-foreground">
              RUC:
            </p>
            <p className="text-sm">{cliente.ruc}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-foreground">
              Dirección:
            </p>
            <p className="text-sm">{cliente.direccion}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-foreground">
              Teléfono:
            </p>
            <p className="text-sm">{cliente.telefono}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm font-semibold text-primary-foreground">
              Correo:
            </p>
            <p className="text-sm">{cliente.correo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface EmpleadosInfoProps {
  empleados: Empleado[];
}

const EmpleadosInfo: React.FC<EmpleadosInfoProps> = ({ empleados }) => {
  return (
    <div className="content-form-group">
      <div className="content-form-group-label">
        <label className="form-group-label">Técnicos Actuales</label>
      </div>
      <div className="py-5 w-full 2xl:grid 2xl:grid-cols-2 2xl:gap-4">
        {empleados.map((empleado) => (
          <div
            key={empleado.idEmpleado}
            className="flex items-center w-full gap-4 bg-white/50 p-4 rounded-lg shadow"
          >
            <EmpleadoPictureCard empleado={empleado} />
            <div className="flex-1">
              <p className="text-lg font-medium text-primary-foreground">{`${empleado.nombre} ${empleado.apellido}`}</p>
              <p className="text-sm">{empleado.correo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface RepuestosInfoProps {
  repuestos: Repuesto[];
}

const RepuestosInfo: React.FC<RepuestosInfoProps> = ({ repuestos }) => {
  return (
    <div className="content-form-group">
      <div className="content-form-group-label">
        <label className="form-group-label">Repuestos</label>
      </div>
      <div className="py-5 w-full 2xl:grid 2xl:grid-cols-2 2xl:gap-4">
        {repuestos.map((repuesto) => (
          <li
            key={repuesto.idRepuesto}
            className="flex items-center gap-4 bg-white/50 p-4 rounded-lg shadow"
          >
            {repuesto.linkImg && (
              <Image
                src={repuesto.linkImg}
                alt={`Imagen de ${repuesto.nombre}`}
                width={50}
                height={50}
                className="rounded-md"
              />
            )}
            <div>
              <p className="font-semibold">
                {repuesto.nombre}: {repuesto.cantidad}
              </p>
              <p className="text-gray-600">
                Precio: ${repuesto.precio.toFixed(2)}
              </p>
              <p>{repuesto.descripcion}</p>
            </div>
          </li>
        ))}
      </div>
    </div>
  );
};

interface EspecificacionesInfoProps {
  especificaciones: EspecificacionPrueba[];
}

const EspecificacionesInfo: React.FC<EspecificacionesInfoProps> = ({
  especificaciones,
}) => {
  return (
    <div className="content-form-group">
      <div className="content-form-group-label">
        <label className="form-group-label">Especificaciones de Pruebas</label>
      </div>
      <div className="py-5 flex w-full items-center justify-center 2xl:grid 2xl:grid-cols-2 2xl:gap-4">
        {especificaciones.map((especificacion) => (
          <div
            key={especificacion.idTipoPrueba}
            className="relative w-full lg:w-10/12 md:mx-6 2xl:mx-0 rounded-lg shadow-lg overflow-hidden bg-secondary/50"
          >
            <div className="flex flex-row items-center w-full text-white rounded-t-lg p-4 bg-primary-foreground">
              <h3 className="text-xl text-left font-medium leading-none">
                {especificacion.nombre}
              </h3>
            </div>
            <div className="col-span-6 flex mt-2 p-3">
              <div className="overflow-x-auto w-full border-[1px] border-secondary-foreground/30 rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right bg-white/85">
                  <thead>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-xs font-medium">
                        Parametro
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium">
                        Unidad
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium">
                        Rango
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {especificacion.parametros.map((parametro) => (
                      <tr
                        key={parametro.idParametro}
                        className="bg-secondary/30"
                      >
                        <td
                          scope="row"
                          className="px-6 py-4 font-medium whitespace-nowrap"
                        >
                          {parametro.nombre}
                        </td>
                        <td
                          scope="row"
                          className="px-6 py-4 font-medium whitespace-nowrap"
                        >
                          {parametro.unidades}
                        </td>
                        <td
                          scope="row"
                          className="px-6 py-4 font-medium whitespace-nowrap"
                        >
                          {parametro.valorMinimo} a {parametro.valorMaximo}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
