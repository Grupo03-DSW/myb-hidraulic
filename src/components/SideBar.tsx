"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Session } from "next-auth";
import { LogOut } from "lucide-react";

interface SideBarProps {
  session: Session;
}

export const SideBar = ({ session }: SideBarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant={"none"} className="h-10 rounded-full border-0 p-0 pl-3 mr-3 bg-white hover:bg-slate-100 hover:scale-105 ease-in-out transform transition">
          {session?.user?.nombre && (
            <span className="sm:block ml-2 text-survey-secondary hover:text-slate-800 font-semibold mr-2">
              {session?.user?.nombre}
            </span>
          )}
          <Avatar className="hover:scale-90 ease-in-out transform transition">
            {session?.user?.linkImg && session?.user?.nombre ? (
              <AvatarImage
                src={session?.user?.linkImg}
                alt={session?.user?.nombre}
              />
            ) : (
              <AvatarImage src={"images/avatar-default.svg"} alt={"user"} />
            )}
          </Avatar>
        </Button>
      </SheetTrigger>
      <VisuallyHidden>
        <SheetTitle>Menú de Usuario</SheetTitle>
      </VisuallyHidden>
      <SheetContent
        aria-describedby={undefined}
        side="right"
        className="w-[300px] sm:w-[400px]"
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Menú de Usuario</h2>
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-center">
                {session.user.nombre} {session.user.apellido}
              </h3>
              {session.user.correo && (
                <p className="text-sm text-gray-600">
                  Correo: {session.user.correo}
                </p>
              )}
              {session.user.telefono && (
                <p className="text-sm text-gray-600">
                  Teléfono: {session.user.telefono}
                </p>
              )}
              {session.user.direccion && (
                <p className="text-sm text-gray-600">
                  Dirección: {session.user.direccion}
                </p>
              )}
              {session.user.rol && (
                <p className="text-sm text-gray-600">Rol: {session.user.rol}</p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            className="bg-background border-red-800 hover:text-white hover:bg-red-900 hover:border-red-900 text-red-800 hover:scale-105 transition-transform duration-200 ease-in-out justify-start mt-auto"
            onClick={async () => {
              await signOut();
              setOpen(false);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
