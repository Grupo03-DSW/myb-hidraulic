"use client";
import React, { useState } from "react";
import { Noice } from "@/components/Noice";
import { Button } from "@/components/ui/button";
import MyBError from "@/lib/mybError";
import { NoiceType } from "@/models/noice";
import { Proyecto } from "@/models/proyecto";

export function InterfazSeguimientoTareasPintado({
  proyecto,
}: {
  proyecto: Proyecto;
}) {
  const [noice, setNoice] = useState<NoiceType | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setNoice({
      type: "loading",
      message: "Registrando completado de tarea de pintado y embalado....",
      styleType: "modal",
    });

    try {
      const response = await fetch(`/api/proyecto/etapa`, {
        method: "PUT",
        body: JSON.stringify({
          idProyecto: proyecto.idProyecto,
          idEtapa: 8,
          fechaInicio: new Date(),
        }),
      });

      if (!response.ok) throw new Error("Error al cambiar de etapa");

      setNoice({
        type: "success",
        message: "Tarea de pintado y embalado completada con éxito",
        styleType: "modal",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
          window.location.reload();
        }, 2000);
      });
    } catch (error) {
      if (error instanceof MyBError)
        setNoice({ type: "error", message: error.message });
      else
        setNoice({
          type: "error",
          message: "Error en el registro de la tarea de pintado y embalado",
        });
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full h-full flex flex-row items-center justify-center"
    >
      {noice && <Noice noice={noice} />}
      <Button type="submit" className="w-full lg:w-1/2  my-10 min-h-min mx-5 flex items-center justify-center">
        <span className="w-full mx-10 text-center break-words text-wrap">
          Completar Tarea de pintado y embalado
        </span>
      </Button>
    </form>
  );
}
