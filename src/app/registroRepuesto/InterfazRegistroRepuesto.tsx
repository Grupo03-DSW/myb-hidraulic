"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageLoader } from "@/components/ImageComponents/ImageLoader";
import { z } from "zod";
import { NoiceType } from "@/models/noice";
import MyBError from "@/lib/mybError";
import { Noice } from "@/components/Noice";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { InputField } from "@/components/InputField";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

// Esquema de validación con Zod
const repuestoSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es obligatorio" }),
  precio: z
    .number({ message: "El valor de precio es obligatorio" })
    .min(0, { message: "El precio debe ser positivo" }),
  descripcion: z.string().min(1, { message: "La descripción es obligatoria" }),
  imgBase64: z.string().min(1, { message: "La imagen es obligatoria" }),
  stockActual: z
    .number({ message: "El valor de stock es obligatorio" })
    .min(0, { message: "El stock debe ser positivo" }),
});

type RepuestoValues = z.infer<typeof repuestoSchema>;

export function InterfazRegistroRepuesto() {
  const router = useRouter();
  const [noice, setNoice] = useState<NoiceType | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RepuestoValues>({
    resolver: zodResolver(repuestoSchema),
    defaultValues: {
      nombre: "",
      precio: 0,
      descripcion: "",
      imgBase64: "",
      stockActual: 0,
    },
  });

  const onSubmit = async (data: RepuestoValues) => {
    setNoice({
      type: "loading",
      message: "Registrando repuesto...",
      styleType: "modal",
    });

    try {
      console.log(data);
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
      const response = await fetch("/api/repuesto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new MyBError("Error al registrar el repuesto");

      setNoice({
        type: "success",
        message: "Repuesto registrado con éxito",
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
        setNoice({ type: "error", message: error.message });
      else
        setNoice({
          type: "error",
          message: "Error en el registro del repuesto",
        });
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-screen-lg min-h-screen gap-4 grid grid-rows-[auto_1fr_auto] mx-auto">
      {noice && <Noice noice={noice} />}
      <h1 className="mb-4 w-full text-center">Registro de Repuesto</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-full flex flex-col lg:grid lg:grid-cols-2 lg:space-x-7 items-center justify-center space-y-12 lg:space-y-0"
      >
        <div className="w-full flex flex-col space-y-11">
          <div className="content-form-group">
            <div className="content-form-group-label">
              <h3 className="form-group-label">Datos del Repuesto</h3>
            </div>
            <div className="mb-4">
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <>
                    <InputField
                      id="nombre"
                      inputLabel="Nombre"
                      type="text"
                      labelClassName={
                        errors.nombre &&
                        "text-destructive peer-focus:text-destructive"
                      }
                      {...field}
                    />
                    {errors?.nombre && (
                      <span className="message-error">
                        {errors.nombre.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="descripcion"
                control={control}
                render={({ field }) => (
                  <>
                    <label
                      htmlFor="descripcion"
                      className={cn(
                        "text-sm text-primary",
                        errors.descripcion && "text-destructive"
                      )}
                    >
                      Descripción
                    </label>
                    <Textarea
                      id="descripcion"
                      name="descripcion"
                      placeholder="Descripción del repuesto"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    {errors?.descripcion && (
                      <span className="message-error">
                        {errors.descripcion.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <div className="content-form-group">
            <div className="content-form-group-label">
              <h3 className="form-group-label">Datos de Stock</h3>
            </div>
            <div className="w-full grid md:grid-cols-2 gap-x-4">
              <div className="mb-4">
                <Controller
                  name="precio"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputField
                        id="precio"
                        inputLabel="Precio"
                        type="number"
                        labelClassName={
                          errors.precio &&
                          "text-destructive peer-focus:text-destructive"
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? ""
                              : parseFloat(e.target.value)
                          )
                        }
                        value={field.value}
                      />
                      {errors?.precio && (
                        <span className="message-error">
                          {errors.precio.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="mb-4">
                <Controller
                  name="stockActual"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputField
                        id="stockActual"
                        inputLabel="Stock Actual"
                        type="number"
                        labelClassName={
                          errors.stockActual &&
                          "text-destructive peer-focus:text-destructive"
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? ""
                              : parseFloat(e.target.value)
                          )
                        }
                        value={field.value}
                      />
                      {errors?.stockActual && (
                        <span className="message-error">
                          {errors.stockActual.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <Controller
              name="imgBase64"
              control={control}
              render={({ field }) => (
                <>
                  <label
                    htmlFor="imgBase64"
                    className={cn(
                      "text-sm text-primary",
                      errors.imgBase64 && "text-destructive"
                    )}
                  >
                    Imagen del Repuesto
                  </label>
                  <ImageLoader
                    setBase64={(base64: string | null) =>
                      field.onChange(base64 ? base64 : "")
                    }
                  />
                  {errors?.imgBase64 && (
                    <span className="message-error">
                      {errors.imgBase64.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>

          <Button type="submit" className="w-full mt-4">
            Registrar Repuesto
          </Button>
        </div>
      </form>
    </div>
  );
}
