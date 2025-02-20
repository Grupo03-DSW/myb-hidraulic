"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NoiceType } from "@/models/noice";
import { Noice } from "@/components/Noice";
import MyBError from "@/lib/mybError";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/InputField";

// Definir el esquema de validación con zod
const clienteSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  ruc: z
    .string()
    .min(10, { message: "El RUC debe tener al menos 10 caracteres" }),
  direccion: z.string().min(1, { message: "La dirección es requerida" }),
  telefono: z.string().min(7, { message: "El teléfono es requerido" }),
  correo: z.string().email({ message: "Correo electrónico inválido" }),
});

// Tipos derivados del esquema
type ClienteFormData = z.infer<typeof clienteSchema>;

export function InterfazRegistroCliente() {
  const [noice, setNoice] = useState<NoiceType | null>(null);
  const router = useRouter();

  // Configuración de react-hook-form con zod
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombre: "",
      ruc: "",
      direccion: "",
      telefono: "",
      correo: "",
    },
  });

  // Función para manejar el envío del formulario
  const onSubmit = async (data: ClienteFormData) => {
    setNoice({
      type: "loading",
      message: "Registrando cliente...",
      styleType: "modal",
    });

    try {
      const response = await fetch("/api/cliente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new MyBError("Error al registrar el cliente");
      reset();

      setNoice({
        type: "success",
        message: "Cliente registrado con exito",
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
      else setNoice({ type: "error", message: "Error al solicitar repuestos" });
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      {noice && <Noice noice={noice} />}
      <h1 className="mb-4">Registro de Cliente</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col space-y-5"
      >
        <div className="content-form-group">
          <div className="content-form-group-label">
            <h3 className="form-group-label">Datos Personales</h3>
          </div>
          <div className="w-full grid md:grid-cols-2 gap-4">
            <div className="mb-4">
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <>
                    <InputField
                      id="nombre"
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

            <div className="mb-4">
              <Controller
                name="ruc"
                control={control}
                render={({ field }) => (
                  <>
                    <InputField
                      id="ruc"
                      inputLabel="RUC"
                      labelClassName={
                        errors.ruc &&
                        "text-destructive peer-focus:text-destructive"
                      }
                      type="text"
                      {...field}
                    />
                    {errors.ruc && (
                      <p className="message-error">{errors.ruc.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        <div className="content-form-group">
          <div className="content-form-group-label">
            <h3 className="form-group-label">Datos de Contacto</h3>
          </div>
          <div className="w-full grid md:grid-cols-2 gap-x-4">
            <div className="mb-4">
              <Controller
                name="direccion"
                control={control}
                render={({ field }) => (
                  <>
                    <InputField
                      id="direccion"
                      inputLabel="Dirección"
                      labelClassName={
                        errors.direccion &&
                        "text-destructive peer-focus:text-destructive"
                      }
                      type="text"
                      {...field}
                    />
                    {errors.direccion && (
                      <p className="message-error">
                        {errors.direccion.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="telefono"
                control={control}
                render={({ field }) => (
                  <>
                    <InputField
                      id="telefono"
                      inputLabel="Teléfono"
                      labelClassName={
                        errors.telefono &&
                        "text-destructive peer-focus:text-destructive"
                      }
                      type="text"
                      {...field}
                    />
                    {errors.telefono && (
                      <p className="message-error">{errors.telefono.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="correo"
                control={control}
                render={({ field }) => (
                  <>
                    <InputField
                      id="correo"
                      inputLabel="Correo"
                      labelClassName={
                        errors.correo &&
                        "text-destructive peer-focus:text-destructive"
                      }
                      type="email"
                      {...field}
                    />
                    {errors.correo && (
                      <p className="message-error">{errors.correo.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full mt-4">
          Registrar Cliente
        </Button>
      </form>
    </div>
  );
}
