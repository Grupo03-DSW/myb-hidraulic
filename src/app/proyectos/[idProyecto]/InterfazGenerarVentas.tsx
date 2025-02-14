import { GeneratePDF } from "@/components/GeneratePDF";
import { InformeSection } from "@/components/InformeSection";
import { InformeVentas } from "@/components/InformeVentas";
import { Noice } from "@/components/Noice";
import MyBError from "@/lib/mybError";
import { NoiceType } from "@/models/noice";
import { Proyecto, HistorialProyecto } from "@/models/proyecto";
import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";

export function InterfazGenerarVentas({ proyecto }: { proyecto: Proyecto }) {
  const [noice, setNoice] = useState<NoiceType | null>(null);
  const [ historial, setHistorial ] = useState<HistorialProyecto | null>(null);

  const handleActualizarEtapa = async () => {
    setNoice({
      type: "loading",
      message: "Cerrando Proyecto",
      styleType: "modal",
    });

    try {
      const response = await fetch(`/api/proyecto/etapa`, {
        method: "PUT",
        body: JSON.stringify({
          idProyecto: proyecto.idProyecto,
          idEtapa: 9,
          fechaInicio: new Date(),
        }),
      });
      if (!response.ok) throw new MyBError("Error al cambiar de etapa");

      setNoice({
        type: "success",
        message: "Etapa actualizada exitosamente",
        styleType: "modal",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          resolve();
          window.location.reload();
        }, 2000);
      });
    } catch (error) {
      if (error instanceof MyBError)
        setNoice({ type: "error", message: error.message });
      else
        setNoice({
          type: "error",
          message: "Error al actualizar la etapa",
        });
    }
  };

  useEffect(() => {
    const fetchProjectHistory = async () => {
      try {
        const response = await fetch(`/api/proyecto/historial/${proyecto.idProyecto}`);
        if (!response.ok) throw new MyBError("Error al obtener historial del proyecto");
  
        const historial = await response.json();
        setHistorial(historial);
        setNoice(null);
      } catch (error) {
        if (error instanceof MyBError)
          setNoice({ type: "error", message: error.message });
        else
          setNoice({
            type: "error",
            message: "Error al obtener historial del proyecto",
          });
      }
    }

    fetchProjectHistory();
  }, [proyecto]);

  if (!historial) return null;

  return (
    <div className="w-full flex flex-row justify-center">
      {noice && <Noice noice={noice} />}
      <InformeSection
        informeLabel="Informe de Ventas"
        actualizarEtapa={handleActualizarEtapa}
        canUpdateStage={true}
      >
        <>
          <PDFViewer width="100%" height="100%" showToolbar>
            <InformeVentas proyecto={proyecto} historial={historial!} />
          </PDFViewer>
          <GeneratePDF
            Documento={() => <InformeVentas proyecto={proyecto} historial={historial!} />}
            pdfName={`Informe de Ventas - ${proyecto.titulo}.pdf`}
          />
        </>
      </InformeSection>
    </div>
  );
}
