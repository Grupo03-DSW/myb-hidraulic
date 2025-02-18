"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import bcrypt from "bcryptjs";
import { NoiceType } from "@/models/noice";
import { Noice } from "@/components/Noice";
import MyBError from "@/lib/mybError";
import { ImageLoader } from "@/components/ImageComponents/ImageLoader";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/InputField";
import { SingleSelect } from "@/components/SingleSelect";
import { cn } from "@/lib/utils";

// Definir el esquema de validación con zod
const empleadoSchema = z.object({
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  apellido: z.string().min(1, { message: "El apellido es requerido" }),
  correo: z.string().email({ message: "Correo electrónico inválido" }),
  telefono: z.string().min(9, { message: "El teléfono es requerido" }),
  direccion: z.string().min(1, { message: "La dirección es requerida" }),
  tipoDocumento: z
    .string()
    .min(1, { message: "El tipo de documento es requerido" }),
  documentoIdentidad: z
    .string()
    .min(1, { message: "El documento de identidad es requerido" }),
  imgBase64: z.preprocess(
    (val) => (typeof val !== "string" ? "" : val),
    z.string().min(1, { message: "Debe subir la foto del empleado." })
  ),
  rol: z.enum(["logistica", "tecnico", "supervisor", "jefe", "admin"], {
    errorMap: () => ({ message: "El rol es inválido" }),
  }),
});

// Tipos derivados del esquema
type EmpleadoFormData = z.infer<typeof empleadoSchema>;

export function InterfazRegistroEmpleado() {
  const [noice, setNoice] = useState<NoiceType | null>(null);
  const router = useRouter();
  // Configuración de react-hook-form con zod
  const {
    control,
    setValue,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EmpleadoFormData>({
    resolver: zodResolver(empleadoSchema),
    defaultValues: {
      password: "",
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      direccion: "",
      tipoDocumento: "",
      documentoIdentidad: "",
      imgBase64: "",
      rol: undefined,
    },
  });

  const handleImageUpload = (base64: string | null) => {
    if (!base64) return;
    setValue("imgBase64", base64 ? base64 : "");
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  // Función para manejar el envío del formulario
  const onSubmit = async (data: EmpleadoFormData) => {
    setNoice({
      type: "loading",
      message: "Registrando empleado...",
      styleType: "modal",
    });

    try {
      // Encriptar la contraseña antes de enviar los datos
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const payload = { ...data, password: hashedPassword };

      const response = await fetch("/api/empleado", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.message === "empleado_documento_identidad_key") {
          setError("documentoIdentidad", {
            type: "manual",
            message: "El documento de identidad ya está registrado",
          });
          setNoice(null);
          return;
        } else if (error.message === "empleado_correo_key") {
          setError("correo", {
            type: "manual",
            message: "El correo ya está registrado",
          });
          setNoice(null);
        } else {
          throw new MyBError("Error al registrar el empleado");
        }
      }

      setNoice({
        type: "success",
        message: "Empleado registrado con éxito",
        styleType: "modal",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          reset();
          resolve();
          router.replace("/");
        }, 2000);
      });
    } catch (error) {
      if (error instanceof MyBError)
        setNoice({ type: "error", message: error.message });
      else
        setNoice({ type: "error", message: "Error al registrar el empleado" });
      console.error(error);
    }
  };

  const hashP = async () => {
    const hashedPassword = await bcrypt.hash("123", 10);
    console.log(hashedPassword);
  };

  return (
    <div className="p-10 w-full mx-auto">
      {noice && <Noice noice={noice} />}
      <h1 className="mb-4">Registro de Empleado</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10"
      >
        <div className="w-full flex flex-col">
          <h3 className="text-base font-medium mb-2">Datos Personales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="mb-4">
              <Controller
                name="apellido"
                control={control}
                render={({ field }) => (
                  <>
                    <InputField
                      inputLabel="Apellido"
                      labelClassName={
                        errors.apellido &&
                        "text-destructive peer-focus:text-destructive"
                      }
                      {...field}
                    />
                    {errors.apellido && (
                      <p className="message-error">{errors.apellido.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <Controller
                name="telefono"
                control={control}
                render={({ field }) => (
                  <>
                    <InputField
                      inputLabel="Teléfono"
                      labelClassName={
                        errors.telefono &&
                        "text-destructive peer-focus:text-destructive"
                      }
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
                name="direccion"
                control={control}
                render={({ field }) => (
                  <>
                    <InputField
                      inputLabel="Dirección"
                      labelClassName={
                        errors.direccion &&
                        "text-destructive peer-focus:text-destructive"
                      }
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <Controller
                name="tipoDocumento"
                control={control}
                render={({ field }) => (
                  <>
                    <InputField
                      inputLabel="Tipo de Documento"
                      labelClassName={
                        errors.tipoDocumento &&
                        "text-destructive peer-focus:text-destructive"
                      }
                      {...field}
                    />
                    {errors.tipoDocumento && (
                      <p className="message-error">
                        {errors.tipoDocumento.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="documentoIdentidad"
                control={control}
                render={({ field }) => (
                  <>
                    <InputField
                      inputLabel="Documento de Identidad"
                      labelClassName={
                        errors.documentoIdentidad &&
                        "text-destructive peer-focus:text-destructive"
                      }
                      {...field}
                    />
                    {errors.documentoIdentidad && (
                      <p className="message-error">
                        {errors.documentoIdentidad.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col">
          <h3 className="text-base font-medium mb-2">Datos de Usuario</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="mb-4 lg:mb-1">
              <Controller
                name="correo"
                control={control}
                render={({ field }) => (
                  <>
                    <InputField
                      inputLabel="Correo"
                      labelClassName={
                        errors.correo &&
                        "text-destructive peer-focus:text-destructive"
                      }
                      {...field}
                    />
                    {errors.correo && (
                      <p className="message-error">{errors.correo.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="mb-4 lg:mb-1">
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <>
                    <InputField
                      inputLabel="Contraseña"
                      labelClassName={
                        errors.password &&
                        "text-destructive peer-focus:text-destructive"
                      }
                      type="password"
                      {...field}
                    />
                    {errors.password && (
                      <p className="message-error">{errors.password.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="mb-4">
              <Controller
                name="rol"
                control={control}
                render={({ field }) => (
                  <>
                    <label
                      className={cn(
                        "text-xs",
                        errors.rol && "text-destructive"
                      )}
                    >
                      Rol
                    </label>
                    <SingleSelect
                      options={[
                        { label: "Logística", value: "logistica" },
                        { label: "Técnico", value: "tecnico" },
                        { label: "Supervisor", value: "supervisor" },
                        { label: "Jefe", value: "jefe" },
                        { label: "Admin", value: "admin" },
                      ]}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      placeholder="Selecciona un rol"
                      className="h-10"
                    />
                    {errors.rol && (
                      <p className="message-error">{errors.rol.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col items-center justify-center">
          <div className="max-w-md">
            <div className="mb-4">
              <Label>Foto del Empleado</Label>
              <ImageLoader
                setBase64={(base64: string | null) => handleImageUpload(base64)}
              />
              {errors.imgBase64 && (
                <p className="text-red-500">{errors.imgBase64.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full mt-4">
              Registrar Empleado
            </Button>
            <Button type="button" onClick={hashP} className="w-full mt-4">
              Hash P
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
