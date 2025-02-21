"use client";
import { useRouter } from "next/navigation";
import { ProyectoHeader } from "@/components/ProyectoHeader";
import { Proyecto } from "@/models/proyecto";

export function ProyectosList({ proyectos }: { proyectos: Proyecto[] }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {proyectos.map((proyecto) => (
        <div
          key={proyecto.idProyecto}
          className="w-full border-2 px-6 pb-3 pt-4 bg-white/35 relative max-h-min rounded-2xl border-primary-foreground/50 hover:shadow-md transition-shadow duration-200 hover:cursor-pointer flex flex-col justify-between h-full"
          onClick={() => {
            router.push(`/proyectos/${proyecto.idProyecto}`);
          }}
        >
          <div>
            <ProyectoHeader proyecto={proyecto} showSeeDetailsBtn={false} />
          </div>
          <div className="mt-auto">
            <div className="text-lg">{proyecto.descripcion}</div>
            <div className="flex justify-end">{proyecto.etapaActual}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
