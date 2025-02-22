"use client";
import React, { useEffect, useRef, useState } from "react";
import { Proyecto } from "@/models/proyecto";
import { ProyectosList } from "@/components/ProyectosList";
import { Noice } from "@/components/Noice";
import { NoiceType } from "@/models/noice";
import { useSession } from "next-auth/react";
import { Circle, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function InterfazListaProyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [filteredProyectos, setFilteredProyectos] = useState<Proyecto[]>([]);
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando proyectos...",
  });

  const [etapasSeleccionadas, setEtapasSeleccionadas] = useState<number[]>([]);
  const [clientesSeleccionados, setClientesSeleccionados] = useState<number[]>(
    []
  );
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    const APIEndPoint =
      session!.user.rol === "jefe"
        ? `/api/proyecto/por-jefe/${session!.user.id}`
        : session!.user.rol === "supervisor"
        ? `/api/proyecto/por-supervisor/${session!.user.id}`
        : "";
    const fetchProyectos = async () => {
      try {
        const response = await fetch(APIEndPoint);
        if (!response.ok) throw new Error("Error al cargar proyectos");
        console.log(response);
        const data = await response.json();

        console.log("Data: ", data);
        setProyectos(data ? data : []);
        setFilteredProyectos(data ? data : []);
        setNoice(null);
      } catch (error) {
        console.error("Error al cargar proyectos:", error);
        setNoice({ type: "error", message: "Error al cargar sus proyectos" });
      }
    };

    fetchProyectos();
  }, [status, session]);

  useEffect(() => {
    const filtrarProyectos = () => {
      let filtrados = proyectos;

      if (etapasSeleccionadas.length > 0) {
        filtrados = filtrados.filter((p) =>
          etapasSeleccionadas.includes(p.idEtapaActual!)
        );
      }

      if (clientesSeleccionados.length > 0) {
        filtrados = filtrados.filter((p) =>
          clientesSeleccionados.includes(p.cliente!.idCliente)
        );
      }

      setFilteredProyectos(filtrados);
    };

    filtrarProyectos();
  }, [etapasSeleccionadas, clientesSeleccionados, proyectos]);

  const manejarCambioEtapa = (idEtapa: number) => {
    setEtapasSeleccionadas((prev) =>
      prev.includes(idEtapa)
        ? prev.filter((id) => id !== idEtapa)
        : [...prev, idEtapa]
    );
  };

  const manejarCambioCliente = (clienteId: number) => {
    setClientesSeleccionados((prev) =>
      prev.includes(clienteId)
        ? prev.filter((c) => c !== clienteId)
        : [...prev, clienteId]
    );
  };

  const etapasDisponibles = Array.from(
    new Map(
      proyectos.map((p) => [
        p.idEtapaActual!,
        { id: p.idEtapaActual!, nombre: p.etapaActual },
      ])
    ).values()
  ).sort((a, b) => a.id - b.id);

  const clientesDisponibles = Array.from(
    new Map(
      proyectos.map((p) => [
        p.cliente?.idCliente,
        { id: p.cliente?.idCliente, nombre: p.cliente?.nombre },
      ])
    ).values()
  );

  return (
    <div className="p-10 max-w-screen-xl min-h-screen gap-4 grid grid-rows-[auto_1fr] mx-auto">
      {noice && <Noice noice={noice} />}
      <div className="flex flex-col gap-2 h-[8%]">
        <h1 className="w-full text-center">Proyectos</h1>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Selector
              title="Etapas"
              items={etapasDisponibles}
              selectedItems={etapasSeleccionadas}
              controlChange={manejarCambioEtapa}
            />
            <Selector
              title="Clientes"
              items={clientesDisponibles}
              selectedItems={clientesSeleccionados}
              controlChange={manejarCambioCliente}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {etapasSeleccionadas.map((id) => {
              const etapa = etapasDisponibles.find((e) => e.id === id);
              return (
                <span
                  key={id}
                  className="px-4 py-1 bg-white/40 border-primary-foreground border-2 text-primary-foreground font-medium text-sm rounded-full cursor-pointer"
                  onClick={() => manejarCambioEtapa(id)}
                >
                  {etapa?.nombre} ✕
                </span>
              );
            })}
            {clientesSeleccionados.map((id) => {
              const cliente = clientesDisponibles.find((c) => c.id === id);
              return (
                <span
                  key={id}
                  className="px-4 py-1 bg-white/40 border-primary-foreground border-2 text-primary-foreground font-medium text-sm rounded-full cursor-pointer"
                  onClick={() => manejarCambioCliente(id)}
                >
                  {cliente?.nombre} ✕
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-full overflow-y-scroll">
        <ProyectosList proyectos={filteredProyectos} />
      </div>
    </div>
  );
}

const Selector = ({
  title,
  items,
  selectedItems,
  controlChange,
}: {
  title: string;
  items: { id: number | undefined; nombre: string | undefined }[];
  selectedItems: number[];
  controlChange: (id: number) => void;
}) => {
  const [show, setShow] = useState(false);
  const selectorRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(e.target as Node)
      ) {
        setShow(false);
      }
    };

    if (show) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = "unset";
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  return (
    <div className="relative" ref={selectorRef}>
      <button
        onClick={() => setShow((prev) => !prev)}
        className={cn(
          "px-4 py-2 bg-white/35 text-primary-foreground border-2 border-primary-foreground/35 rounded-md shadow hover:bg-secondary-foreground hover:text-white hover:border-transparent hover:font-medium transition-colors ease-in-out duration-300",
          show &&
            "bg-secondary-foreground text-white border-transparent font-medium"
        )}
      >
        {title}
      </button>
      {show && (
        <div className="absolute text-white top-full p-4 mt-2 bg-secondary-foreground border rounded-md shadow-lg z-50">
          <h3 className="text-md font-semibold mb-2 my-2 mx-2">{title}</h3>
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2 px-3 hover:font-semibold hover:bg-secondary/40 hover:py-3 transition-all ease-in-out duration-300 rounded-md cursor-pointer"
                onClick={() => controlChange(item.id as number)}
              >
                <div>
                  {selectedItems.includes(item.id as number) ? (
                    <CircleCheck size={24} />
                  ) : (
                    <Circle size={24} />
                  )}
                </div>
                {item.nombre}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
