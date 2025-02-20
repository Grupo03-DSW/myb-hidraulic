"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cliente } from "@/models/cliente";
import { Empleado } from "@/models/empleado";
import { z } from "zod";
import { Repuesto, RepuestoForm } from "@/models/repuesto";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Combobox } from "@/components/Combobox";
import { RepuestosList } from "@/components/RepuestosList";
import { Counter } from "@/components/Counter";
import { TipoPrueba, TipoPruebaForms } from "@/models/tipoprueba";
import { PruebasList } from "@/components/PruebasList";
import PruebasStock from "@/components/PruebasStock";
import { RepuestosStock } from "@/components/RepuestosStock";
import { Noice } from "@/components/Noice";
import { NoiceType } from "@/models/noice";
import MyBError from "@/lib/mybError";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/InputField";
import { cn } from "@/lib/utils";

const repuestoSchema = z
  .object({
    idRepuesto: z.number(),
    nombre: z.string(),
    precio: z.number(),
    descripcion: z.string(),
    linkImg: z.string().nullable().optional(),
    stockActual: z.number().min(0).optional(),
    stockSolicitado: z.number().optional(),
    checked: z.boolean(),
    quantity: z.union([z.number(), z.undefined(), z.string()]).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.checked && (val.quantity === undefined || val.quantity === "")) {
      ctx.addIssue({
        code: "custom",
        message: `Debe ingresar una cantidad para ${val.nombre}  si está marcado.`,
      });

      ctx.addIssue({
        code: "custom",
        message: `Debe ingresar un valor.`,
        path: ["quantity"],
      });
    }
  });

const parametroSchema = z
  .object({
    idParametro: z.number(),
    nombre: z.string(),
    unidades: z.string(),
    valorMaximo: z.union([z.number(), z.string(), z.undefined()]).optional(),
    valorMinimo: z.union([z.number(), z.string(), z.undefined()]).optional(),
  })
  .superRefine((val, ctx) => {
    if (
      (val.valorMaximo === undefined || val.valorMaximo === "") &&
      (val.valorMinimo === undefined || val.valorMinimo === "")
    ) {
      ["valorMaximo", "valorMinimo"].forEach((key) => {
        ctx.addIssue({
          code: "custom",
          message: "Debe ingresar un valor máximo o mínimo.",
          path: [key],
        });
      });

      return z.NEVER;
    }
  });
const pruebaSchema = z.object({
  idTipoPrueba: z.number(),
  nombre: z.string(),
  checked: z.boolean(),
  parametros: z.array(parametroSchema).superRefine((val, ctx) => {
    const minBiggerMax = val.filter(
      (param) => Number(param.valorMaximo) < Number(param.valorMinimo)
    );
    if (minBiggerMax.length > 0) {
      minBiggerMax.forEach((param) => {
        ctx.addIssue({
          code: "custom",
          message: `El valor máximo de ${param.nombre} debe ser mayor o igual al valor mínimo.`,
          path: ["root"],
        });

        ctx.addIssue({
          code: "custom",
          message: "El valor máximo debe ser mayor o igual al valor mínimo.",
          path: [val.indexOf(param), "valorMaximo"],
        });

        ctx.addIssue({
          code: "custom",
          message: "El valor minimo debe ser menor o igual al valor maximo.",
          path: [val.indexOf(param), "valorMinimo"],
        });
      });

      return z.NEVER;
    }
  }),
});

const proyectoSchema = z
  .object({
    titulo: z.string().min(1, { message: "Debe ingresar un título." }),
    descripcion: z
      .string()
      .min(1, { message: "Debe ingresar una descripción." }),
    fechaInicio: z.date().refine(
      (val) => val instanceof Date && !isNaN(val.getTime()), // Validación adicional si es necesario
      {
        message: "La fecha es inválida o no está en el formato esperado.",
      }
    ),
    fechaFin: z.date().refine(
      (val) => val instanceof Date && !isNaN(val.getTime()), // Validación adicional si es necesario
      {
        message: "La fecha es inválida o no está en el formato esperado.",
      }
    ),
    idCliente: z.number({ message: "Debe seleccionar un cliente." }).min(1, {
      message: "Debe seleccionar un cliente valido.",
    }),
    idSupervisor: z
      .number({ message: "Debe seleccionar un supervisor." })
      .min(1, {
        message: "Debe seleccionar un supervisor valido.",
      }),
    idEtapaActual: z.number({ message: "Debe seleccionar una etapa." }),
    costoManoObra: z
      .union([z.string(), z.number()])
      .refine((val) => val !== "" && val !== undefined, {
        message: "Debe ingresar un costo de mano de obra.",
      }),
    repuestos: z.array(repuestoSchema).optional(),
    pruebas: z
      .array(pruebaSchema)
      .min(1, { message: "Debe seleccionar al menos una prueba." }),
  })
  .superRefine((val, ctx) => {
    if (val.fechaFin < val.fechaInicio) {
      ctx.addIssue({
        code: "custom",
        message: "La fecha de fin debe ser mayor a la fecha de inicio.",
        path: ["fechaFin"],
      });

      return z.NEVER;
    }
  });

export type RegistroProyecto = z.infer<typeof proyectoSchema>;

export function InterfazRegistroProyecto() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistroProyecto>({
    resolver: zodResolver(proyectoSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      fechaInicio: new Date(),
      fechaFin: new Date(),
      idCliente: -1,
      idSupervisor: -1,
      idEtapaActual: 1,
      costoManoObra: 0,
      repuestos: [],
      pruebas: [],
    },
  });

  const repuestoField = useFieldArray({
    control: control,
    name: "repuestos",
  });

  const pruebaField = useFieldArray({
    control: control,
    name: "pruebas",
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [supervisores, setSupervisores] = useState<Empleado[]>([]);
  //const [jefes, setJefes] = useState<Empleado[]>([]);
  const [repuestos, setRepuestos] = useState<RepuestoForm[]>([]);
  const [pruebas, setPruebas] = useState<TipoPruebaForms[]>([]);
  const [openRepuestos, setOpenRepuestos] = useState(false);
  const [openPruebas, setOpenPruebas] = useState(false);

  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando datos del proyecto...",
  });

  const { data: session, status } = useSession();

  const fetchClientes = async () => {
    setNoice({
      type: "loading",
      message: "Cargando datos de clientes...",
    });
    const res = await fetch("/api/cliente");

    if (!res.ok) throw new MyBError("Error en la carga de datos de clientes");

    const data = await res.json();
    setClientes(data);
  };

  const fetchSupervisores = async () => {
    setNoice({
      type: "loading",
      message: "Cargando datos de supervisores...",
    });

    const res = await fetch("/api/empleado/por-rol/supervisor");

    if (!res.ok)
      throw new MyBError("Error en la carga de datos de supervisores");

    const data = await res.json();
    setSupervisores(data);
  };

  const fetchRepuestos = async () => {
    setNoice({
      type: "loading",
      message: "Cargando datos de repuestos...",
    });

    const res = await fetch("/api/repuesto");

    if (!res.ok) throw new MyBError("Error en la carga de datos de repuestos");

    const data = await res.json();

    const formattedData = data.map((repuesto: Repuesto) => ({
      ...repuesto,
      precio: Number(repuesto.precio),
      checked: false,
      quantity: 0,
    }));

    const parsedData = z.array(repuestoSchema).safeParse(formattedData);
    if (parsedData.success) {
      setRepuestos(parsedData.data);
    } else {
      throw new MyBError("Error en la validación de los datos de repuestos");
    }
  };

  const fetchPruebas = async () => {
    setNoice({
      type: "loading",
      message: "Cargando datos de pruebas...",
    });

    const res = await fetch("/api/pruebaconparametro");

    if (!res.ok) throw new MyBError("Error en la carga de datos de pruebas");

    const data = (await res.json()) as TipoPrueba[];

    const formatedData = data.map((prueba) => ({
      ...prueba,
      checked: false,
      parametros: prueba.parametros?.map((parametro) => ({
        ...parametro,
        valorMaximo: 0,
        valorMinimo: 0,
      })),
    }));

    const parsedData = z.array(pruebaSchema).safeParse(formatedData);

    if (parsedData.success) {
      setPruebas(parsedData.data);
    } else {
      throw new Error("Error en la validación de los datos de pruebas");
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchClientes(),
          fetchSupervisores(),
          fetchRepuestos(),
          fetchPruebas(),
        ]);
        setNoice(null);
      } catch (error) {
        if (error instanceof MyBError)
          setNoice({ type: "error", message: error.message });
        else setNoice({ type: "error", message: "Error en la carga de datos" });
        console.error("Error en la carga de datos:", error);
      }
    };
    fetchData();
  }, [status]);

  const handleSelectRepuesto = (repuesto: RepuestoForm) => {
    setRepuestos((prev) =>
      prev.map((r) =>
        r.idRepuesto === repuesto.idRepuesto ? { ...r, checked: true } : r
      )
    );
    repuestoField.append({ ...repuesto, checked: true, quantity: 1 });
  };

  const handleUnselectRepuesto = (repuesto: RepuestoForm) => {
    setRepuestos((prev) =>
      prev.map((r) =>
        r.idRepuesto === repuesto.idRepuesto ? { ...r, checked: false } : r
      )
    );

    const repuesto_to_remove = repuestoField.fields.findIndex(
      (r) => r.idRepuesto === repuesto.idRepuesto
    );

    repuestoField.remove(repuesto_to_remove);
  };

  const handleSelectPrueba = (prueba: TipoPruebaForms) => {
    setPruebas((prev) =>
      prev.map((p) =>
        p.idTipoPrueba === prueba.idTipoPrueba ? { ...p, checked: true } : p
      )
    );

    pruebaField.append({
      ...prueba,
      checked: true,
      parametros: prueba.parametros.map((p) => ({
        ...p,
        valorMaximo: 0,
        valorMinimo: 0,
      })),
    });
  };

  const handleUnselectPrueba = (prueba: TipoPruebaForms, index: number) => {
    setPruebas((prev) =>
      prev.map((p) =>
        p.idTipoPrueba === prueba.idTipoPrueba ? { ...p, checked: false } : p
      )
    );

    pruebaField.remove(index);
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const onSubmit = async (proy: RegistroProyecto) => {
    setNoice({
      type: "loading",
      message: "Registrando proyecto...",
      styleType: "modal",
    });

    try {
      if (status === "loading") throw new MyBError("No se ha iniciado sesión");

      const parametros = proy.pruebas.flatMap((prueba) => {
        if (prueba.checked) {
          return prueba.parametros.map((parametro) => parametro);
        }
        return [];
      });

      const formatedData = {
        titulo: proy.titulo,
        descripcion: proy.descripcion,
        fechaInicio: proy.fechaInicio,
        fechaFin: proy.fechaFin,
        idCliente: proy.idCliente,
        idSupervisor: proy.idSupervisor,
        idJefe: session?.user.id,
        idEtapaActual: proy.idEtapaActual,
        costoManoObra: Number(proy.costoManoObra),
        idRepuestos: proy.repuestos
          ? proy.repuestos?.map((repuesto) => repuesto.idRepuesto)
          : [],
        cantidadesRepuestos: proy.repuestos?.map(
          (repuesto) => repuesto.quantity
        ),
        idParametros: parametros.map((parametro) => parametro.idParametro),
        valoresMaximos: parametros.map((parametro) =>
          parametro.valorMaximo ? Number(parametro.valorMaximo) : 0
        ),
        valoresMinimos: parametros.map((parametro) =>
          parametro.valorMinimo ? Number(parametro.valorMinimo) : 0
        ),
      };

      console.log(formatedData);

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
        }, 2000);
      });

      const res = await fetch("/api/proyecto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formatedData),
      });

      if (!res.ok) {
        throw new Error("Error al registrar el proyecto");
      }

      reset();

      setNoice({
        type: "success",
        message: "Proyecto registrado con éxito",
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
        setNoice({ type: "error", message: "Error al registrar el proyecto" });
      console.error("Error al registrar el proyecto:", error);
    }
  };

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      {noice && <Noice noice={noice} />}
      <h1 className="mb-4">Registro de Proyecto</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 lg:space-y-0 grid lg:grid-cols-2 gap-4"
      >
        {/* Campos de entrada */}
        <div className="content-form-group">
          <div className="content-form-group-label">
            <h3 className="form-group-label">Datos del Proyecto</h3>
          </div>
          <div className="w-full grid md:grid-cols-2 md:gap-x-6 mt-1">
            <div className="mb-4">
              <Controller
                name="titulo"
                control={control}
                render={({ field }) => (
                  <>
                    <InputField
                      inputLabel="Titulo"
                      labelClassName={
                        errors.titulo &&
                        "text-destructive peer-focus:text-destructive"
                      }
                      {...field}
                    />
                    {errors.titulo && (
                      <p className="message-error">{errors.titulo.message}</p>
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
                    <InputField
                      inputLabel="Descripción"
                      labelClassName={
                        errors.descripcion &&
                        "text-destructive peer-focus:text-destructive"
                      }
                      {...field}
                    />
                    {errors.descripcion && (
                      <p className="message-error">
                        {errors.descripcion.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <div className="w-full grid md:grid-cols-2 md:gap-x-6">
            <div className="mb-4 w-full">
              <Controller
                name="fechaInicio"
                control={control}
                render={({ field }) => (
                  <>
                    <label
                      htmlFor="fechaInicio"
                      className={cn(
                        "text-sm text-primary",
                        errors.fechaInicio && "text-destructive"
                      )}
                    >
                      Fecha de Inicio
                    </label>
                    <InputField
                      type="date"
                      id="fechaInicio"
                      min={new Date().toISOString().split("T")[0]}
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        const date = e.target.value
                          ? new Date(e.target.value)
                          : new Date();
                        field.onChange(e.target.value ? date : new Date());
                        if (watch("fechaFin") < date) {
                          setValue("fechaFin", date);
                        }
                      }}
                    />
                    {errors.fechaInicio && (
                      <p className="message-error">
                        {errors.fechaInicio.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="mb-4 w-full">
              <Controller
                name="fechaFin"
                control={control}
                render={({ field }) => (
                  <>
                    <label
                      htmlFor="fechaFin"
                      className={cn(
                        "text-sm text-primary",
                        errors.fechaFin && "text-destructive"
                      )}
                    >
                      Fecha de Fin
                    </label>
                    <InputField
                      type="date"
                      id="fechaFin"
                      min={watch("fechaInicio").toISOString().split("T")[0]}
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : new Date()
                        );
                      }}
                    />
                    {errors.fechaFin && (
                      <p className="message-error">{errors.fechaFin.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          {/* Costo de Mano de Obra */}
          <div className="w-full grid md:grid-cols-2 md:gap-x-6">
            <div className="mb-4 w-full">
              <Controller
                name="costoManoObra"
                control={control}
                render={({ field }) => (
                  <>
                    <InputField
                      inputLabel="Costo de Mano de Obra"
                      type="number"
                      labelClassName={
                        errors.costoManoObra &&
                        "text-destructive peer-focus:text-destructive"
                      }
                      {...field}
                    />
                    {errors?.costoManoObra && (
                      <p className="message-error">
                        {errors.costoManoObra.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        <div className="content-form-group">
          <div className="content-form-group-label">
            <h3 className="form-group-label">Personal Asignado</h3>
          </div>

          <div className="grid md:grid-cols-2 md:gap-x-10 gap-y-3 mb-2">
            {/* Select para Cliente */}
            <Controller
              name="idCliente"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="idCliente"
                    className={cn(
                      "text-sm text-primary",
                      errors.idCliente && "text-destructive"
                    )}
                  >
                    Descripción
                  </label>
                  <Combobox<Cliente>
                    items={clientes}
                    getValue={(r) => {
                      if (r && typeof r !== "string" && "idCliente" in r) {
                        return r.idCliente.toString();
                      }
                    }}
                    getLabel={(r) => r.nombre}
                    getRealValue={(r) => r}
                    onSelection={(r) => {
                      field.onChange(r.idCliente);
                    }}
                    itemName={"Cliente"}
                  />
                  {errors?.idCliente && (
                    <span className="message-error">
                      {errors.idCliente.message}
                    </span>
                  )}
                </div>
              )}
            />

            {/* Select para Supervisor */}
            <Controller
              name="idSupervisor"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="idSupervisor"
                    className={cn(
                      "text-sm text-primary",
                      errors.idSupervisor && "text-destructive"
                    )}
                  >
                    Supervisor
                  </label>
                  <Combobox<Empleado>
                    items={supervisores}
                    getValue={(r) => {
                      if (r && typeof r !== "string" && "idEmpleado" in r) {
                        return r.idEmpleado!.toString();
                      }
                    }}
                    getLabel={(r) => r.nombre + " " + r.apellido}
                    getRealValue={(r) => r}
                    onSelection={(r) => {
                      field.onChange(r.idEmpleado);
                    }}
                    itemName={"Supervisor"}
                  />
                  {errors?.idSupervisor && (
                    <span className="message-error">
                      {errors.idSupervisor.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        {/* Repuestos */}
        <Controller
          name="repuestos"
          control={control}
          render={({ field }) => (
            <div className="content-form-group">
              <div className="content-form-group-label">
                <label
                  htmlFor="repuestos"
                  className={cn(
                    "form-group-label text-sm text-primary",
                    errors.repuestos && "text-destructive"
                  )}
                >
                  Repuestos
                </label>
              </div>

              <div className="flex flex-col items-center my-4 lg:w-5/6 lg:mx-auto">
                <RepuestosList
                  repuestos={field.value || []}
                  className="w-full"
                  messageNothingAdded="No hay repuestos seleccionados"
                  counter={(index) => (
                    <Controller
                      name={`repuestos.${index}.quantity`}
                      control={control}
                      render={({ field }) => (
                        <div className="flex h-full items-center gap-2">
                          <Counter
                            {...field}
                            className={`w-16 ${
                              errors.repuestos?.[index]?.quantity
                                ? "border-red-500"
                                : ""
                            }`}
                            min={1}
                            disabled={!watch(`repuestos.${index}.checked`)}
                          />
                        </div>
                      )}
                    />
                  )}
                  remover={(index, item) => (
                    <Button
                      className="absolute right-0 top-0 z-50"
                      onClick={() => {
                        handleUnselectRepuesto(item);
                      }}
                      type="button"
                    >
                      &times;
                    </Button>
                  )}
                  error={(index) =>
                    errors.repuestos?.[index]?.root && (
                      <span className="text-red-500 font-sans text-sm">
                        {errors.repuestos?.[index]?.root?.message}
                      </span>
                    )
                  }
                />
                <Button type="button" onClick={() => setOpenRepuestos(true)}>
                  Añadir repuestos
                </Button>
                {errors.repuestos?.root && (
                  <span className="text-red-500 font-sans text-sm">
                    {errors.repuestos?.root?.message}
                  </span>
                )}
              </div>
            </div>
          )}
        />

        <RepuestosStock
          open={openRepuestos}
          setOpen={setOpenRepuestos}
          repuestos={repuestos}
          handleSelectRepuesto={handleSelectRepuesto}
          handleUnselectRepuesto={handleUnselectRepuesto}
        />

        {/* Pruebas */}
        <Controller
          control={control}
          name="pruebas"
          render={({ field }) => (
            <div className="content-form-group">
              <div className="content-form-group-label">
                <label
                  htmlFor="pruebas"
                  className={cn(
                    "form-group-label text-sm text-primary",
                    errors.pruebas && "text-destructive"
                  )}
                >
                  Pruebas
                </label>
              </div>
              <div className="flex flex-col items-center my-2 lg:w-5/6 lg:mx-auto">
                <PruebasList
                  className="w-full"
                  pruebas={field.value}
                  messageNothingAdded="No hay pruebas seleccionadas"
                  counterMin={(prueba_index, param_index) => (
                    <Controller
                      name={`pruebas.${prueba_index}.parametros.${param_index}.valorMinimo`}
                      control={control}
                      render={({ field }) => (
                        <Counter
                          {...field}
                          className={`w-20 ${
                            errors.pruebas?.[prueba_index]?.parametros?.[
                              param_index
                            ]?.valorMinimo
                              ? "border-red-500"
                              : ""
                          }`}
                          disabled={!watch(`pruebas.${prueba_index}.checked`)}
                        />
                      )}
                    />
                  )}
                  counterMax={(prueba_index, param_index) => (
                    <Controller
                      name={`pruebas.${prueba_index}.parametros.${param_index}.valorMaximo`}
                      control={control}
                      render={({ field }) => (
                        <Counter
                          {...field}
                          className={`w-20 ${
                            errors.pruebas?.[prueba_index]?.parametros?.[
                              param_index
                            ]?.valorMaximo
                              ? "border-red-500"
                              : ""
                          }`}
                          disabled={!watch(`pruebas.${prueba_index}.checked`)}
                        />
                      )}
                    />
                  )}
                  remover={(index, item) => (
                    <Button
                      className="absolute right-0 top-0 z-10"
                      onClick={() => {
                        handleUnselectPrueba(item, index);
                      }}
                      type="button"
                    >
                      &times;
                    </Button>
                  )}
                  error={(index) =>
                    errors.pruebas?.[index]?.parametros?.root && (
                      <span className="text-red-500 font-sans text-sm">
                        {errors.pruebas?.[index]?.parametros?.root?.message}
                      </span>
                    )
                  }
                />
                <Button type="button" onClick={() => setOpenPruebas(true)}>
                  Añadir pruebas
                </Button>
                {errors.pruebas && (
                  <span className="text-red-500 font-sans text-sm">
                    {errors.pruebas?.message}
                  </span>
                )}
              </div>
            </div>
          )}
        />

        <PruebasStock
          open={openPruebas}
          setOpen={setOpenPruebas}
          pruebas={pruebas}
          handleSelectPrueba={handleSelectPrueba}
          handleUnselectPrueba={handleUnselectPrueba}
        />
        <div className="lg:col-span-2 flex justify-center">
          <Button type="submit" className="w-full md:w-1/2 lg:w-1/3 mt-4">
            Registrar Proyecto
          </Button>
        </div>
      </form>
    </div>
  );
}
