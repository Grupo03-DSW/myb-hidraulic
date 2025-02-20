"use client";
import React, { Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { NoiceType } from "@/models/noice";
import { Noice } from "@/components/Noice";
import { authorizedRoutes } from "@/lib/auth";
import { NavBar } from "@/components/NavBar";
import { SideBar } from "@/components/SideBar";

export default function Home() {
  const { data: session } = useSession();
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    styleType: "page",
    message: "Estamos configurando algunas cosas...",
  });

  useEffect(() => {
    if (session) {
      setNoice(null);
    }
  }, [session]);

  if (!session)
    return (
      <Noice
        noice={{
          type: "loading",
          styleType: "page",
          message: "Estamos configurando algunas cosas...",
        }}
      />
    );

  return (
    <main className="min-h-screen flex flex-col">
      <NavBar title="Menú Principal">
        <SideBar session={session} />
      </NavBar>
      <div className="h-full w-full flex flex-1 items-center justify-center bg-background">
        {noice && <Noice noice={noice} />}
        {session?.user.rol === "admin" ? (
          <div className="flex flex-col md:grid md:grid-cols-3 gap-4 lg:flex-row justify-center p-6 bg-white shadow-lg rounded-lg">
            {authorizedRoutes.admin.map((route) => (
              <Fragment key={route}>{getRoute(route)}</Fragment>
            ))}
          </div>
        ) : session?.user.rol === "jefe" ? (
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 w-full px-32 justify-center p-6 bg-white shadow-lg rounded-lg">
            {authorizedRoutes.jefe.map((route) => (
              <Fragment key={route}>{getRoute(route)}</Fragment>
            ))}
          </div>
        ) : session?.user.rol === "supervisor" ? (
          <div className="flex flex-col gap-4 w-full px-32 justify-center p-6 bg-white shadow-lg rounded-lg">
            {authorizedRoutes.supervisor.map((route) => (
              <Fragment key={route}>{getRoute(route)}</Fragment>
            ))}
          </div>
        ) : session?.user.rol === "tecnico" ? (
          <div className="flex flex-col gap-4 w-full px-32 justify-center p-6 bg-white shadow-lg rounded-lg">
            {authorizedRoutes.tecnico.map((route) => (
              <Fragment key={route}>{getRoute(route)}</Fragment>
            ))}
          </div>
        ) : (
          session?.user.rol === "logistica" && (
            <div className="flex flex-col gap-4 w-full px-32 justify-center p-6 bg-white shadow-lg rounded-lg">
              {authorizedRoutes.logistica.map((route) => (
                <Fragment key={route}>{getRoute(route)}</Fragment>
              ))}
            </div>
          )
        )}
      </div>
    </main>
  );
}

const getRoute = (path: string) => {
  switch (path) {
    case "/registroEmpleado":
      return (
        <a
          href="/registroEmpleado"
          className="btn-primary px-4 py-6 flex justify-center items-center"
        >
          Registrar Empleados
        </a>
      );
    case "/registroCliente":
      return (
        <a
          href="/registroCliente"
          className="btn-primary p-4 flex justify-center items-center"
        >
          Registro de Cliente
        </a>
      );
    case "/registroProyecto":
      return (
        <a
          href="/registroProyecto"
          className="btn-primary p-4 flex justify-center items-center"
        >
          Registro de Proyecto
        </a>
      );
    case "/registroPrueba":
      return (
        <a
          href="/registroPrueba"
          className="btn-primary p-4 flex justify-center items-center"
        >
          Registro de Prueba
        </a>
      );
    case "/registroRepuesto":
      return (
        <a
          href="/registroRepuesto"
          className="btn-primary p-4 flex justify-center items-center"
        >
          Registro de Repuesto
        </a>
      );
    case "/proyeccionRepuestos":
      return (
        <a
          href="/proyeccionRepuestos"
          className="btn-primary p-4 flex justify-center items-center"
        >
          Proyección de repuestos
        </a>
      );
    case "/visualizacionRepuestos":
      return (
        <a
          href="/visualizacionRepuestos"
          className="btn-primary p-4 flex justify-center items-center"
        >
          Visualización de repuestos requeridos
        </a>
      );
    case "/proyectos":
      return (
        <a
          href="/proyectos"
          className="btn-primary p-4 flex justify-center items-center"
        >
          Seguimiento de proyectos
        </a>
      );
    case "/seguimientoTareas":
      return (
        <a
          href="/seguimientoTareas"
          className="btn-primary p-4 flex justify-center items-center"
        >
          Seguimiento de tareas
        </a>
      );
    default:
      return <Home />;
  }
};
