"use client";
import React, { useEffect, useState } from "react";
import { ProjectFlow } from "@/components/ProjectFlow/ProjectFlow";
import { ProyectoHeader } from "@/components/ProyectoHeader";
import { InterfazAsignacionTareas } from "@/app/proyectos/[idProyecto]/InterfazAsignacionTareas";
import { Proyecto } from "@/models/proyecto";
import { InterfazVerificacionReparacion } from "./InterfazVerificacionReparacion";
import { InterfazGenerarCC } from "./InterfazGenerarCC";
import { InterfazGenerarVentas } from "./InterfazGenerarVentas";
import { NoiceType } from "@/models/noice";
import { Noice } from "@/components/Noice";
import MyBError from "@/lib/mybError";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { InterfazReparando } from "./InterfazReparando";
import { InterfazPintadoYEmbalado } from "./InterfazPintadoYEmbalado";
import { InterfazTerminado } from "./InterfazTerminado";
import { useSession } from "next-auth/react";
import { stageLabels } from "@/lib/utils";
import { InterfazAsignacionRepuestos } from "./InterfazAsignacionRepuestos";

export function InterfazFlujoProyecto({ idProyecto }: { idProyecto: string }) {
  const [proyecto, setProyecto] = useState<Proyecto>();
  const router = useRouter();
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando proyecto...",
  });

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchProyecto = async () => {
      try {
        const response = await fetch(`/api/proyecto/por-id/${idProyecto}`);
        if (!response.ok) throw new Error("Error al cargar el proyecto");

        const gettedProyecto = await response.json();

        const data: Proyecto = {
          ...gettedProyecto,
          fechaInicio: new Date(`${gettedProyecto.fechaInicio}T00:00:00`),
          fechaFin: new Date(`${gettedProyecto.fechaFin}T00:00:00`),
        };
        /* setProyecto(data); */
        setProyecto({
          ...data,
        });
        setNoice(null);
      } catch (error) {
        if (error instanceof MyBError)
          setNoice({ type: "error", message: error.message });
        else
          setNoice({ type: "error", message: "Error al cargar el proyecto" });
        console.error(error);
      }
    };

    fetchProyecto();
  }, [idProyecto]);

  if (!proyecto) return noice && <Noice noice={noice} />;

  return (
    <div className="flex flex-col items-center pt-10 px-20 gap-3">
      {noice && <Noice noice={noice} />}
      <div className="w-full">
        <Button
          onClick={() => {
            router.push("/proyectos");
          }}
          variant={"outline"}
        >
          Otros Proyectos
        </Button>
      </div>

      <ProyectoHeader proyecto={proyecto} showSeeDetailsBtn={true} />

      <div className="flex flex-col items-center gap-5 md:grid md:grid-cols-2 md:gap-5 w-full">
        <div className="w-full">
          <ProjectFlow etapa={Number(proyecto.idEtapaActual) - 1} />
        </div>

        <div className="w-full h-full flex flex-col border-2 rounded-lg px-3 pb-3 pt-4 bg-white/35 relative">
          <div className="content-form-group-label">
            <label className="form-group-label">
              {stageLabels[Number(proyecto.idEtapaActual) - 1]}
            </label>
          </div>
          <div className="h-full flex items-center justify-center p-3">
            {session?.user.rol == "jefe" ? (
              proyecto.idEtapaActual == 1 ? (
                <InterfazAsignacionRepuestos proyecto={proyecto} />
              ) : proyecto.idEtapaActual == 2 ? (
                <InterfazAsignacionTareas
                  etapaLabel="Reparación"
                  proyecto={proyecto}
                />
              ) : proyecto.idEtapaActual == 6 ? (
                <InterfazAsignacionTareas
                  etapaLabel="Pintado y Embalado"
                  proyecto={proyecto}
                />
              ) : proyecto.idEtapaActual == 8 ? (
                <InterfazGenerarVentas proyecto={proyecto} />
              ) : proyecto.idEtapaActual == 9 ? (
                <InterfazTerminado proyecto={proyecto} />
              ) : null
            ) : (
              session?.user.rol === "supervisor" &&
              (proyecto.idEtapaActual == 4 ? (
                <InterfazVerificacionReparacion
                  proyecto={proyecto}
                  idEmpleado={1}
                />
              ) : proyecto.idEtapaActual == 5 ? (
                <InterfazGenerarCC proyecto={proyecto} />
              ) : null)
            )}
            {proyecto.idEtapaActual == 3 ? (
              <InterfazReparando proyecto={proyecto} />
            ) : proyecto.idEtapaActual == 7 ? (
              <InterfazPintadoYEmbalado proyecto={proyecto} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
