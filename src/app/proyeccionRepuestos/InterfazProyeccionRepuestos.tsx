"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { RepuestosList } from "@/components/RepuestosList";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/Counter";
import { Switch } from "@/components/ui/switch";
import { Repuesto } from "@/models/repuesto";
import { NoiceType } from "@/models/noice";
import { Noice } from "@/components/Noice";
import { useSession } from "next-auth/react";

// Define la estructura de un repuesto usando Zod
const repuestoSchema = z
  .object({
    idRepuesto: z.number(),
    nombre: z.string(),
    precio: z.number(),
    descripcion: z.string(),
    linkImg: z.string().optional(),
    checked: z.boolean(),
    stockRequerido: z.number().optional(),
    quantity: z.union([z.number(), z.undefined(), z.string()]).optional(),
  })
  .refine(
    (val) =>
      !val.checked || (val.quantity !== "" && val.quantity !== undefined),
    {
      message: "Debe ingresar un valor si está marcado.",
      path: ["cantidadProyectada"],
    }
  );

const proyeccionSchema = z.object({
  repuestos: z.array(repuestoSchema),
});

export type ProyeccionData = z.infer<typeof proyeccionSchema>;

export function InterfazProyeccionRepuestos() {
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando repuestos asignados a sus proyectos...",
  });
  const form = useForm<z.infer<typeof proyeccionSchema>>({
    resolver: zodResolver(proyeccionSchema),
    defaultValues: {
      repuestos: [],
    },
  });

  const repuestosField = useFieldArray({
    control: form.control,
    name: "repuestos",
  });

  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchRepuestos() {
      if (status === "loading") return;
      try {
        const response = await fetch(
          `/api/repuesto/faltantes/por-jefe/${session?.user?.id}`,
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error("Error al obtener los repuestos requeridos");
        }

        const data: { repuesto: Repuesto; cantidadFaltante: number }[] =
          await response.json();
        const repuestosFaltantes = data.map((repuestoFaltante) => ({
          idRepuesto: repuestoFaltante.repuesto.idRepuesto!,
          nombre: repuestoFaltante.repuesto.nombre,
          precio: Number(repuestoFaltante.repuesto.precio),
          descripcion: repuestoFaltante.repuesto.descripcion,
          linkImg: repuestoFaltante.repuesto.linkImg || "",
          checked: false,
          stockRequerido: repuestoFaltante.cantidadFaltante,
          quantity: repuestoFaltante.cantidadFaltante,
        }));

        form.setValue("repuestos", repuestosFaltantes);
        setNoice(null);
      } catch (error) {
        console.error("Error fetching repuestos:", error);
        setNoice({
          type: "error",
          message: "Error al obtener los repuestos requeridos",
        });
      }
    }
    fetchRepuestos();
  }, [form, status, session]);

  const onSubmit = async (data: ProyeccionData) => {
    setNoice({
      type: "loading",
      message: "Solicitando repuestos...",
      styleType: "modal",
    });

    try {
      const selectedRepuestos = data.repuestos.filter(
        (repuesto) => repuesto.checked
      );

      const respuestosSolicitados = selectedRepuestos.map((repuesto) => ({
        idRepuesto: repuesto.idRepuesto,
        cantidadSolicitada: repuesto.quantity,
      }));

      const response = await fetch("/api/repuesto/solicitados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(respuestosSolicitados),
      });

      if (!response.ok) throw new Error("Error al cambiar de etapa");

      setNoice({
        type: "success",
        message: "Repuestos solicitados exitosamente",
        styleType: "modal",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
          setNoice(null);
          window.location.reload();
        }, 3000);
      });
    } catch (e) {
      console.error("Error al solicitar repuestos:", e);
      setNoice({
        type: "error",
        message: "Error al actualizar la etapa",
      });
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="p-4 h-screen max-w-screen-lg grid grid-rows-[auto_1fr_auto] mx-auto"
    >
      {noice && <Noice noice={noice} />}
      <div className="w-full flex justify-center mb-2">
        <h1>Proyeccion de Repuestos</h1>
      </div>
      <RepuestosList
        repuestos={repuestosField.fields}
        className="flex flex-col lg:grid lg:grid-cols-2 gap-4 p-2 overflow-scroll"
        messageNothingAdded="No hay repuestos faltantes en sus proyectos"
        counter={(index, item) => (
          <Controller
            name={`repuestos.${index}.quantity`}
            control={form.control}
            render={({ field }) => (
              <Counter
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                }}
                className={`${
                  form.formState.errors.repuestos?.[index]?.quantity
                    ? "border-red-500"
                    : ""
                }`}
                max={item.quantity}
                min={1}
                disabled={!form.watch(`repuestos.${index}.checked`)}
              />
            )}
          />
        )}
        selector={(index, item) => (
          <Controller
            name={`repuestos.${index}.checked`}
            control={form.control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                id={item.idRepuesto.toString()}
                onClick={() => {
                  field.onChange(!field.value);
                }}
              />
            )}
          />
        )}
      />
      <div className="w-full flex justify-center my-4">
        <Button type="submit" className="w-1/2 lg:w-1/4">
          Pedir
        </Button>
      </div>
    </form>
  );
}
