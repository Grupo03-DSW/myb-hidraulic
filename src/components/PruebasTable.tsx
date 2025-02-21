import { EspecificacionPrueba, ParametroPrueba } from "@/models/especificacion";

type EspecificacionTable = {
  idParametro: number;
  resultado: number;
};

interface TipoPruebaTable {
  idTipoPrueba: number;
  especificaciones?: EspecificacionTable[];
}

interface PruebasTableProps {
  pruebas: TipoPruebaTable[];
  pruebasOriginales: EspecificacionPrueba[];
  className?: string;
  messageNothingAdded: string;
  columnas: React.ReactNode;
  filas: (
    prueba_index: number,
    espec_index: number,
    parametro: ParametroPrueba
  ) => React.ReactNode;
  error?: (index: number) => React.ReactNode;
}

export function PruebasTable({
  pruebas,
  pruebasOriginales,
  columnas,
  filas,
  className,
  messageNothingAdded,
  error,
}: PruebasTableProps) {
  return (
    <div className="mx-0 md:mx-3 overflow-y-auto" style={{ height: "40h" }}>
      {pruebas.length === 0 ? (
        <p className="w-full text-center">{messageNothingAdded}</p>
      ) : (
        <div className={`${className && className} mb-2`}>
          {pruebas.map((prueba, prueba_index) => {
            const especificacionOriginal = pruebasOriginales.find(
              (spec) => spec.idTipoPrueba === prueba.idTipoPrueba
            );

            return (
              <div
                key={prueba.idTipoPrueba}
                className="relative md:mx-6 2xl:mx-0 rounded-lg shadow-lg overflow-hidden bg-secondary/50"
              >
                <div
                  className={`flex flex-row items-center w-full text-white rounded-t-lg p-4  ${
                    error && error(prueba_index) ? "bg-red-500" : "bg-primary-foreground"
                  }`}
                >
                  <span
                    className={`text-xl text-left font-medium leading-none`}
                  >
                    {especificacionOriginal?.nombre}
                  </span>
                </div>
                <div className="col-span-6 flex mt-2 p-3">
                  <div className="overflow-x-auto w-full border-[1px] border-secondary-foreground/30 rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right bg-white/85">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-medium"
                          >
                            Parametro
                          </th>
                          {columnas}
                        </tr>
                      </thead>
                      <tbody>
                        {prueba.especificaciones?.map(
                          (especificacion, index_espec) => {
                            const parametroOriginal =
                              especificacionOriginal?.parametros.find(
                                (param) =>
                                  param.idParametro ===
                                  especificacion?.idParametro
                              );

                            return (
                              <tr
                                key={especificacion?.idParametro}
                                className="bg-secondary/30"
                              >
                                <th
                                  scope="row"
                                  className="px-6 py-4 font-medium whitespace-nowrap"
                                >
                                  {`${parametroOriginal?.nombre} (${parametroOriginal?.unidades})`}
                                </th>
                                {filas(
                                  prueba_index,
                                  index_espec,
                                  parametroOriginal!
                                )}
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {error && error(prueba_index)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
