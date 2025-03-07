"use client";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Noice } from "@/components/Noice";
import { Proyecto } from "@/models/proyecto";
import { ResultadosModal } from "@/components/ResultadosModal";
import { EspecificacionesList } from "@/components/EspecificacionesList";
import { Counter } from "@/components/Counter";

const especificacionSchema = z
  .object({
    idParametro: z.number(),
    resultado: z
      .preprocess((value) => {
        if (value === "") {
          return undefined;
        }
        return Number(value);
      }, z.union([z.number(), z.undefined()]))
      .refine((value) => typeof value !== "undefined", {
        message: "No se puede dejar un resultado vacío",
      }),
    valorMaximo: z.number(),
    valorMinimo: z.number(),
    nombre: z.string(),
  })
  .superRefine((val, ctx) => {
    if (val.resultado > val.valorMaximo || val.resultado < val.valorMinimo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El valor de un parametro no está dentro del rango",
        path: ["root"],
      });
      return z.NEVER;
    }
  });

const pruebaSchema = z.object({
  idTipoPrueba: z.number(),
  especificaciones: z.array(especificacionSchema).superRefine((value, ctx) => {
    const noResult = value.some(
      (especificacion) => typeof especificacion.resultado === "undefined"
    );
    if (noResult) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No se puede dejar un resultado vacío",
        path: ["root"],
      });
      return z.NEVER;
    }

    const outOfRange = value.filter(
      (especificacion) =>
        especificacion.resultado > especificacion.valorMaximo ||
        especificacion.resultado < especificacion.valorMinimo
    );

    if (outOfRange.length > 0) {
      outOfRange.forEach((espc) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `El valor de ${espc.nombre} no está dentro del rango`,
          path: ["root"],
        });
      });

      return z.NEVER;
    }

    return z.NEVER;
  }),
});

const resultadosSchema = z.object({
  idProyecto: z.number(),
  idEmpleado: z.number(),
  fecha: z.date(),
  resultados: z.array(pruebaSchema),
});

type ResultadosPruebaForm = {
  idTipoPrueba: number;
  especificaciones: {
    idParametro: number;
    resultado: number;
  }[];
};

type FormValues = {
  idProyecto: number;
  idEmpleado: number;
  fecha: Date;
  resultados: ResultadosPruebaForm[];
};

interface SeguimientoTareasProps {
  proyecto: Proyecto;
  idEmpleado: number;
}

export function InterfazSeguimientoTareasReparacion({
  proyecto,
  idEmpleado,
}: SeguimientoTareasProps) {
  const [noice, setNoice] = useState<{
    type: "loading" | "success" | "error";
    message: string;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(resultadosSchema),
    defaultValues: {
      idProyecto: proyecto?.idProyecto,
      idEmpleado,
      fecha: new Date(),
      resultados: [],
    },
  });

  useEffect(() => {
    if (proyecto?.especificaciones) {
      const formattedPruebas: ResultadosPruebaForm[] =
        proyecto.especificaciones.map((prueba) => ({
          idTipoPrueba: prueba.idTipoPrueba,
          especificaciones: prueba.parametros.map((parametro) => ({
            idParametro: parametro.idParametro,
            nombre: parametro.nombre,
            resultado: 0,
            valorMaximo: parametro.valorMaximo,
            valorMinimo: parametro.valorMinimo,
          })),
        }));

      form.setValue("resultados", formattedPruebas);
    }
  }, [proyecto, form]);

  const onSubmit = async (data: FormValues) => {
    setNoice({ type: "loading", message: "Registrando resultados..." });

    try {
      const res = await fetch("/api/proyecto/reparando", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      await res.json();

      setNoice({
        type: "success",
        message: "Resultados registrados con éxito",
      });

      form.reset();

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
          window.location.reload();
        }, 2000);
      });
    } catch (error) {
      setNoice({
        type: "error",
        message: "Hubo un error al registrar los resultados.",
      });
      console.error(error);
    }
  };

  return (
    <div className="w-full h-full grid grid-rows-[auto,1fr] gap-4">
      {noice && <Noice noice={noice} />}

      <div className="w-full flex items-center justify-end">
        <Button
          onClick={() => setDialogOpen(true)}
          className="mb-4 w-full md:w-1/2"
        >
          <span className="text-wrap">Ver Resultados Anteriores</span>
        </Button>
      </div>

      <ResultadosModal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        proyecto={proyecto}
      />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center justify-center"
      >
        <Controller
          control={form.control}
          name="resultados"
          render={({ field }) => (
            <EspecificacionesList
              especificaciones={field.value}
              especificacionesOriginales={proyecto.especificaciones || []}
              className="grid grid-cols-1 2xl:grid-cols-2 gap-2"
              messageNothingAdded="No hay pruebas"
              counterResult={(prueba_index, espec_index) => (
                <Controller
                  name={`resultados.${prueba_index}.especificaciones.${espec_index}.resultado`}
                  control={form.control}
                  render={({ field }) => (
                    <Counter
                      {...field}
                      className={`w-20 ${
                        form.formState.errors.resultados?.[prueba_index]
                          ?.especificaciones?.[espec_index]
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                  )}
                />
              )}
              error={(index) =>
                form.formState.errors.resultados?.[index]?.especificaciones
                  ?.root && (
                  <div className="w-full flex items-center justify-center py-2">
                    <div className="border-r-2 border-l-2 bg-white/60 border-red-600 px-3 py-1 w-11/12 mx-auto flex items-center justify-center">
                      <span className="message-error">
                        {
                          form.formState.errors.resultados[index]
                            ?.especificaciones?.root.message
                        }
                      </span>
                    </div>
                  </div>
                )
              }
            />
          )}
        />

        <Button type="submit" className="mt-4 w-full">
          Registrar Resultados
        </Button>
      </form>
    </div>
  );
}
