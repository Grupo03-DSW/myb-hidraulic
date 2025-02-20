"use client";
import React, { useState } from "react";
import { Noice } from "@/components/Noice";
import { Button } from "@/components/ui/button";
import MyBError from "@/lib/mybError";
import { NoiceType } from "@/models/noice";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Droplets } from "lucide-react";
import { InputField } from "@/components/InputField";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  correo: z
    .string()
    .email({ message: "Debe ser un correo válido" })
    .min(1, { message: "El correo es requerido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .min(1, { message: "La contraseña es requerida" }),
});

type LoginData = z.infer<typeof loginSchema>;

export default function Page() {
  const [noice, setNoice] = useState<NoiceType | null>(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      correo: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    try {
      const { correo, password } = data;

      // Intentar iniciar sesión con credenciales
      const res = await signIn("credentials", {
        correo,
        password,
        redirect: false,
        callbackUrl: `${window.location.origin}`,
      });

      console.log("res - ", res);
      if (res?.error) {
        if (res.error === "invalid_credentials") {
          setError("root", {
            type: "manual",
            message: "Correo o contraseña incorrectos",
          });
        } else {
          throw new MyBError("Ocurrió un error inesperado. Intenta de nuevo.");
        }
      }
      router.replace("/");
    } catch (error) {
      console.error("Error in login page:", error);
      if (error instanceof MyBError) {
        setNoice({
          type: "error",
          message: error.message,
        });
      } else {
        setNoice({
          type: "error",
          message: "Ocurrió un error inesperado. Intenta de nuevo.",
        });
      }
    }
  };

  return (
    <div className="w-full h-lvh flex flex-1 items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-4 md:w-1/2 bg-white rounded-lg shadow-lg"
      >
        {noice && <Noice noice={noice} />}
        <div className="w-full flex flex-col items-center gap-y-4 mx-auto p-10">
          <h1 className="flex flex-row h-20 justify-end items-end font-bold text-2xl md:text-4xl lg:text-5xl">
            <Droplets className="w-full h-10 md:h-14 lg:h-16 text-primary-foreground" />
            <span className="font-extrabold text-primary-foreground text-3xl md:text-5xl lg:text-6xl">
              MyB
            </span>
            Hidraulic
          </h1>

          <div className="w-full flex flex-col items-center gap-2">
            <h2 className="font-medium text-lg">Iniciar Sesión</h2>
            <Controller
              name="correo"
              control={control}
              render={({ field }) => (
                <div className="w-full md:w-1/2">
                  <InputField
                    id="correo"
                    inputLabel="Correo"
                    labelClassName={
                      errors.correo &&
                      "text-destructive peer-focus:text-destructive"
                    }
                    {...field}
                  />
                  {errors.correo && (
                    <span className="message-error">
                      {errors.correo.message}
                    </span>
                  )}
                </div>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <div className="w-full md:w-1/2 mt-2">
                  <InputField
                    id="password"
                    inputLabel="Contraseña"
                    type="password"
                    labelClassName={
                      errors.password &&
                      "text-destructive peer-focus:text-destructive"
                    }
                    {...field}
                  />
                  {errors.password && (
                    <span className="message-error">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>
          {errors.root && (
            <span className="message-error">{errors.root.message}</span>
          )}
          <Button type="submit" className="w-full md:w-1/3 mt-4">
            Login
          </Button>
        </div>
      </form>
    </div>
  );
}
