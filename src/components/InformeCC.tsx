"use client";
import { useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { Proyecto } from "@/models/proyecto";
import { ResultadoPrueba } from "@/models/resultado";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "/fonts/roboto/Roboto-Thin.ttf",
      fontWeight: "thin",
      fontStyle: "normal",
    },
    {
      src: "/fonts/roboto/Roboto-ThinItalic.ttf",
      fontWeight: "thin",
      fontStyle: "italic",
    },
    {
      src: "/fonts/roboto/Roboto-ExtraLight.ttf",
      fontWeight: "ultralight",
      fontStyle: "normal",
    },
    {
      src: "/fonts/roboto/Roboto-ExtraLightItalic.ttf",
      fontWeight: "ultralight",
      fontStyle: "italic",
    },
    {
      src: "/fonts/roboto/Roboto-Light.ttf",
      fontWeight: "light",
      fontStyle: "normal",
    },
    {
      src: "/fonts/roboto/Roboto-LightItalic.ttf",
      fontWeight: "light",
      fontStyle: "italic",
    },
    {
      src: "/fonts/roboto/Roboto-Regular.ttf",
      fontWeight: "normal",
      fontStyle: "normal",
    },
    {
      src: "/fonts/roboto/Roboto-Italic.ttf",
      fontWeight: "normal",
      fontStyle: "italic",
    },
    {
      src: "/fonts/roboto/Roboto-Medium.ttf",
      fontWeight: "medium",
      fontStyle: "normal",
    },
    {
      src: "/fonts/roboto/Roboto-MediumItalic.ttf",
      fontWeight: "medium",
      fontStyle: "italic",
    },
    {
      src: "/fonts/roboto/Roboto-SemiBold.ttf",
      fontWeight: "semibold",
      fontStyle: "normal",
    },
    {
      src: "/fonts/roboto/Roboto-SemiBoldItalic.ttf",
      fontWeight: "semibold",
      fontStyle: "italic",
    },
    {
      src: "/fonts/roboto/Roboto-Bold.ttf",
      fontWeight: "bold",
      fontStyle: "normal",
    },
    {
      src: "/fonts/roboto/Roboto-BoldItalic.ttf",
      fontWeight: "bold",
      fontStyle: "italic",
    },
    {
      src: "/fonts/roboto/Roboto-ExtraBold.ttf",
      fontWeight: "ultrabold",
      fontStyle: "normal",
    },
    {
      src: "/fonts/roboto/Roboto-ExtraBoldItalic.ttf",
      fontWeight: "ultrabold",
      fontStyle: "italic",
    },
    {
      src: "/fonts/roboto/Roboto-Black.ttf",
      fontWeight: "heavy",
      fontStyle: "normal",
    },
    {
      src: "/fonts/roboto/Roboto-BlackItalic.ttf",
      fontWeight: "heavy",
      fontStyle: "italic",
    },
  ],
});

const styles = StyleSheet.create({
  fontText: {
    fontFamily: "Roboto",
  },
  defaultText: {
    fontSize: 12,
    fontWeight: "normal",
  },
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  headerSubTitle: {
    fontSize: 16,
    fontFamily: "Roboto",
    fontWeight: "normal",
  },
  section: {
    paddingLeft: 10,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  index: {
    paddingRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subsectionTile: {
    fontSize: 14,
    fontWeight: "medium",
  },
  subsection: {
    paddingHorizontal: 15,
    marginBottom: 10,
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  text: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 1.5,
  },
  highlight: {
    fontWeight: "bold",
    fontSize: 12,
  },
  sectionContent: {
    marginBottom: 16,
    marginLeft: 30,
  },
  feedback: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  table: {
    width: "100%",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    minHeight: 25,
    alignItems: "center",
  },
  tableTitle: {
    backgroundColor: "#d5d7d8",
    display: "flex",
    flexDirection: "row",
    width: "100%",
    padding: 4,
    marginBottom: 0,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  textTableTitle: {
    fontFamily: "Roboto",
    fontWeight: "medium",
    fontSize: 12,
  },
  tableHeader: {
    backgroundColor: "#f8fafc",
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    padding: 6,
    fontSize: 10,
  },
});

export const InformeCC = ({ proyecto }: { proyecto: Proyecto }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>
              INFORME DE {"\n"}CONTROL DE CALIDAD
            </Text>
            <Image src={"/images/logo-MYB.png"} style={{ height: 40 }} />
          </View>
          <Text style={styles.headerSubTitle}>Proyecto: {proyecto.titulo}</Text>
        </View>
        <ContentCC proyecto={proyecto} />
      </Page>
    </Document>
  );
};

export const ContentCC = ({ proyecto }: { proyecto: Proyecto }) => {
  const [resultadosAnteriores] = useState<ResultadoPrueba[]>(
    proyecto?.resultados || []
  );

  const resultadosFiltrados = resultadosAnteriores.filter(
    (resultado) =>
      !proyecto.feedbacks?.some(
        (feedback) =>
          feedback.idResultadoPruebaSupervisor === resultado.idResultadoPrueba
      )
  );

  console.log("Resultados Filtrados - CC", resultadosFiltrados);

  return (
    <>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.fontText, styles.index, styles.sectionTitle]}>
            1.
          </Text>
          <Text style={[styles.fontText, styles.sectionTitle]}>
            Pruebas Realizadas
          </Text>
        </View>

        <View style={styles.sectionContent}>
          {proyecto.especificaciones?.map((especificacion, index) => (
            <View key={index} style={styles.subsection}>
              <View style={styles.sectionHeader}>
                <Text
                  style={[styles.fontText, styles.index, styles.subsectionTile]}
                >
                  1.{index + 1}.
                </Text>
                <Text style={[styles.fontText, styles.subsectionTile]}>
                  {especificacion.nombre}
                </Text>
              </View>

              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCell}>Parámetro</Text>
                  <Text style={styles.tableCell}>Rango Aceptable</Text>
                </View>
                {especificacion.parametros.map((parametro) => (
                  <View key={parametro.idParametro} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{parametro.nombre}</Text>
                    <Text style={styles.tableCell}>
                      {parametro.valorMinimo}
                      {parametro.unidades} - {parametro.valorMaximo}
                      {parametro.unidades}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.fontText, styles.index, styles.sectionTitle]}>
            2.
          </Text>
          <Text style={[styles.fontText, styles.sectionTitle]}>Resultados</Text>
        </View>

        <View style={styles.sectionContent}>
          {resultadosFiltrados.length > 0 ? (
            resultadosFiltrados
              .toSorted((a, b) => a.idResultadoPrueba - b.idResultadoPrueba)
              .map((resultado, index) => {
                const feedbackRelacionado = proyecto.feedbacks?.find(
                  (fb) =>
                    fb.idResultadoPruebaTecnico === resultado.idResultadoPrueba
                );

                const esRechazado =
                  feedbackRelacionado && !feedbackRelacionado.aprobado;
                const esAprobado =
                  feedbackRelacionado && feedbackRelacionado.aprobado;

                const resultadoSupervisor = feedbackRelacionado
                  ? resultadosAnteriores.find(
                      (res) =>
                        res.idResultadoPrueba ===
                        feedbackRelacionado.idResultadoPruebaSupervisor
                    )
                  : null;

                return (
                  <View key={index} style={styles.subsection} wrap={false}>
                    <View style={styles.sectionHeader}>
                      <Text
                        style={[
                          styles.fontText,
                          styles.index,
                          styles.subsectionTile,
                        ]}
                      >
                        2.{index + 1}.
                      </Text>
                      <Text style={[styles.fontText, styles.subsectionTile]}>
                        {index + 1}º Resultado de Pruebas (
                        {new Date(resultado.fecha).toLocaleDateString()})
                      </Text>
                    </View>

                    <Text style={[styles.fontText, styles.defaultText]}>
                      A cargo de:{" "}
                      {proyecto.empleadosActuales?.find(
                        (e) => e.idEmpleado === resultado.idEmpleado
                      )?.nombre || "Desconocido"}
                    </Text>

                    {resultado.resultados.map((prueba, index) => (
                      <View key={index} style={styles.table}>
                        <View style={[styles.tableTitle]}>
                          <Text
                            style={[styles.fontText, styles.textTableTitle]}
                          >
                            Resultado del Tecnico en{" "}
                            {proyecto.especificaciones?.find(
                              (e) => e.idTipoPrueba === prueba.idTipoPrueba
                            )?.nombre || "Desconocido"}
                          </Text>
                        </View>

                        <View style={[styles.tableRow, styles.tableHeader]}>
                          <Text style={styles.tableCell}>Parámetro</Text>
                          <Text style={styles.tableCell}>Resultado</Text>
                        </View>

                        {prueba.resultadosParametros.map((parametro) => (
                          <View
                            key={parametro.idParametro}
                            style={styles.tableRow}
                          >
                            <Text style={styles.tableCell}>
                              {parametro.nombre}
                            </Text>
                            <Text style={styles.tableCell}>
                              {parametro.resultado}
                              {parametro.unidades}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ))}

                    {resultadoSupervisor && (
                      <View>
                        <View style={styles.feedback}>
                          <Text style={[styles.fontText, styles.defaultText]}>
                            <Text style={[styles.fontText, styles.highlight]}>
                              Supervisión a cargo de:
                            </Text>{" "}
                            {proyecto.supervisor?.nombre || "Desconocido"}{" "}
                            {proyecto.supervisor?.apellido}
                          </Text>
                          <Text style={[styles.fontText, styles.defaultText]}>
                            <Text style={[styles.fontText, styles.highlight]}>
                              Verifación de reparación realizada el
                            </Text>{" "}
                            {new Date(
                              resultadoSupervisor.fecha
                            ).toLocaleDateString()}
                          </Text>
                        </View>

                        {resultadoSupervisor.resultados.map((prueba, index) => (
                          <View key={index} style={styles.table}>
                            <View style={[styles.tableTitle]}>
                              <Text
                                style={[styles.fontText, styles.textTableTitle]}
                              >
                                Resultados de Verificación de Reparación en{" "}
                                {proyecto.especificaciones?.find(
                                  (e) => e.idTipoPrueba === prueba.idTipoPrueba
                                )?.nombre || "Desconocido"}
                              </Text>
                            </View>

                            <View style={[styles.tableRow, styles.tableHeader]}>
                              <Text style={styles.tableCell}>Parámetro</Text>
                              <Text style={styles.tableCell}>Resultado</Text>
                            </View>

                            {prueba.resultadosParametros.map((parametro) => (
                              <View
                                key={parametro.idParametro}
                                style={styles.tableRow}
                              >
                                <Text style={styles.tableCell}>
                                  {parametro.nombre}
                                </Text>
                                <Text style={styles.tableCell}>
                                  {parametro.resultado}
                                  {parametro.unidades}
                                </Text>
                              </View>
                            ))}
                          </View>
                        ))}
                      </View>
                    )}

                    {feedbackRelacionado && (
                      <View style={styles.feedback}>
                        <Text style={[styles.fontText, styles.defaultText]}>
                          <Text style={[styles.fontText, styles.highlight]}>
                            Comentario:
                          </Text>{" "}
                          {feedbackRelacionado.comentario}
                        </Text>
                        <Text style={[styles.fontText, styles.defaultText]}>
                          <Text style={[styles.fontText, styles.highlight]}>
                            Aprobado:
                          </Text>{" "}
                          {feedbackRelacionado.aprobado ? "Sí" : "No"}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })
          ) : (
            <Text style={styles.text}>
              No hay resultados anteriores disponibles.
            </Text>
          )}
        </View>
      </View>
    </>
  );
};
