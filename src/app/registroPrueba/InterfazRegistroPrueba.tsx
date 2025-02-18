"use client";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NoiceType } from "@/models/noice";
import { useState } from "react";
import { Noice } from "@/components/Noice";
import MyBError from "@/lib/mybError";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/InputField";

// Definir el esquema de validación con zod
const tipoPruebaSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El nombre del tipo de prueba es requerido" }),
  parametros: z
    .array(
      z.object({
        nombre: z
          .string()
          .min(1, { message: "El nombre del parámetro es requerido" }),
        unidades: z
          .string()
          .min(1, { message: "Las unidades del parámetro son requeridas" }),
      })
    )
    .min(1, { message: "Se requiere al menos un parámetro" }),
});

// Tipos derivados del esquema
type TipoPruebaForm = z.infer<typeof tipoPruebaSchema>;

export function InterfazRegistroPrueba() {
  // Configuración de react-hook-form con zod
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TipoPruebaForm>({
    resolver: zodResolver(tipoPruebaSchema),
    defaultValues: { nombre: "", parametros: [] },
  });
  const router = useRouter();
  const [noice, setNoice] = useState<NoiceType | null>(null);

  // useFieldArray para manejar dinámicamente los parámetros
  const {
    fields: parametros,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "parametros",
  });

  // Función para manejar el envío del formulario
  const onSubmit = async (data: TipoPruebaForm) => {
    setNoice({
      type: "loading",
      message: "Registrando tipo de prueba...",
      styleType: "modal",
    });

    try {
      console.log(data);
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
      const response = await fetch("/api/pruebaconparametro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreTipoPrueba: data.nombre,
          parametros: data.parametros,
        }),
      });

      if (!response.ok)
        throw new MyBError("Error al registrar el tipo de prueba y parámetros");
      reset();
      setNoice({
        type: "success",
        message: "Tipo de prueba registrado con éxito",
        styleType: "modal",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
          router.replace("/");
        }, 2000);
      });
    } catch (error) {
      if (error instanceof MyBError)
        setNoice({
          type: "error",
          message: error.message,
        });
      else
        setNoice({
          type: "error",
          message: "Error desconocido",
        });
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      {noice && <Noice noice={noice} />}
      <h1 className="mb-4">Registro de Tipo de Prueba</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="mb-4">
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <>
                <InputField
                  inputLabel="Nombre"
                  labelClassName={
                    errors.nombre &&
                    "text-destructive peer-focus:text-destructive"
                  }
                  {...field}
                />
                {errors.nombre && (
                  <p className="message-error">{errors.nombre.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="flex flex-row justify-between  mt-6 mb-4">
          <h3 className="text-md font-semibold">Agregar Parámetros</h3>
          <Button
            variant={"outline"}
            type="button"
            className="w-16 font-bold text-xl scale-75 border-primary border-2 hover:bg-background hover:border-primary-foreground text-primary hover:text-primary-foreground hover:scale-90 transition-transform ease-in-out duration-200"
            onClick={() => append({ nombre: "", unidades: "" })}
          >
            +
          </Button>
        </div>

        {parametros.map((param, index) => (
          <div key={param.id} className="mb-4 w-full">
            <div className="flex flex-row items-start justify-between md:items-start md:justify-center space-x-2">
              <div className="w-full flex flex-col items-start justify-start md:flex-row md:items-start md:justify-center md:space-x-2">
                <div className="w-full">
                  <Controller
                    name={`parametros.${index}.nombre` as const}
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputField
                          inputLabel="Nombre del parámetro"
                          labelClassName={
                            errors.parametros?.[index]?.nombre &&
                            "text-destructive peer-focus:text-destructive"
                          }
                          {...field}
                        />
                        {errors.parametros?.[index]?.nombre && (
                          <span className="message-error">
                            {errors.parametros[index]?.nombre?.message}
                          </span>
                        )}
                      </>
                    )}
                  />
                </div>

                <div className="w-full">
                  <Controller
                    name={`parametros.${index}.unidades` as const}
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputField
                          inputLabel="Unidades"
                          labelClassName={
                            errors.parametros?.[index]?.unidades &&
                            "text-destructive peer-focus:text-destructive"
                          }
                          {...field}
                        />
                        {errors.parametros?.[index]?.unidades && (
                          <span className="message-error">
                            {errors.parametros[index]?.unidades?.message}
                          </span>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>

              <Button
                variant={"outline"}
                type="button"
                onClick={() => remove(index)}
                className="font-bold text-lg scale-75 border-red-800 border-2 hover:bg-background hover:border-red-950 text-red-800 hover:text-red-950 hover:scale-100 transition-transform ease-in-out duration-200"
              >
                &times;
              </Button>
            </div>
          </div>
        ))}
        {errors.parametros && (
          <span className="message-error">
            {errors.parametros.message || errors.parametros.root?.message}
          </span>
        )}

        <Button type="submit" className="w-full mt-4">
          Registrar Tipo de Prueba con Parámetros
        </Button>
      </form>
    </div>
  );
}
