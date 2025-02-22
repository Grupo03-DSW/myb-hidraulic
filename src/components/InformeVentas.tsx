"use client";
import { Proyecto, HistorialProyecto } from "@/models/proyecto";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

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
    marginBottom: 5,
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
    marginBottom: 5,
    marginLeft: 30,
  },
  subsectionContent: {
    marginLeft: 30,
  },
  contentImage: {
    flexDirection: "row",
  },
  feedback: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginVertical: 4,
  },
  table: {
    width: "100%",
    marginBottom: 5,
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
  image: {
    width: 100,
    backgroundColor: "#f8fafc",
    height: 100,
    marginRight: 10,
  },
});

export const InformeVentas = ({
  proyecto,
  historial,
}: {
  proyecto: Proyecto;
  historial: HistorialProyecto;
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado del informe */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>INFORME DEL {"\n"}PROYECTO</Text>
            <Image src={"/images/logo-MYB.png"} style={{ height: 40 }} />
          </View>
          <Text style={styles.headerSubTitle}>Proyecto: {proyecto.titulo}</Text>
        </View>

        {/* Sección de información general */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.fontText, styles.index, styles.sectionTitle]}>
              1.
            </Text>
            <Text style={[styles.fontText, styles.sectionTitle]}>
              Información General
            </Text>
          </View>

          <View style={styles.sectionContent}>
            <Text style={[styles.fontText, styles.defaultText]}>
              Título: {proyecto.titulo}
            </Text>
            <Text style={[styles.fontText, styles.defaultText]}>
              Descripción: {proyecto.descripcion}
            </Text>
            <Text style={[styles.fontText, styles.defaultText]}>
              Fecha de inicio:{" "}
              {proyecto.fechaInicio?.toLocaleDateString("es-PE")}
            </Text>
            <Text style={[styles.fontText, styles.defaultText]}>
              Fecha de fin:{" "}
              {proyecto.fechaFin
                ? proyecto.fechaFin.toLocaleDateString("es-PE")
                : "No especificada"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.fontText, styles.index, styles.sectionTitle]}>
              2.
            </Text>
            <Text style={[styles.fontText, styles.sectionTitle]}>
              Jefe del Proyecto
            </Text>
          </View>

          <View style={styles.sectionContent}>
            <Text style={[styles.fontText, styles.defaultText]}>
              Nombre: {proyecto.jefe?.nombre} {proyecto.jefe?.apellido}
            </Text>
            <Text style={[styles.fontText, styles.defaultText]}>
              Correo: {proyecto.jefe?.correo}
            </Text>
            <Text style={[styles.fontText, styles.defaultText]}>
              Teléfono: {proyecto.jefe?.telefono}
            </Text>
            <Text style={[styles.fontText, styles.defaultText]}>
              Dirección: {proyecto.jefe?.direccion}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.fontText, styles.index, styles.sectionTitle]}>
              3.
            </Text>
            <Text style={[styles.fontText, styles.sectionTitle]}>
              Supervisor del Proyecto
            </Text>
          </View>

          <View style={styles.sectionContent}>
            <Text style={[styles.fontText, styles.defaultText]}>
              Nombre: {proyecto.supervisor?.nombre}{" "}
              {proyecto.supervisor?.apellido}
            </Text>
            <Text style={[styles.fontText, styles.defaultText]}>
              Correo: {proyecto.supervisor?.correo}
            </Text>
            <Text style={[styles.fontText, styles.defaultText]}>
              Teléfono: {proyecto.supervisor?.telefono}
            </Text>
            <Text style={[styles.fontText, styles.defaultText]}>
              Dirección: {proyecto.supervisor?.direccion}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.fontText, styles.index, styles.sectionTitle]}>
              4.
            </Text>
            <Text style={[styles.fontText, styles.sectionTitle]}>Costos</Text>
          </View>

          <View style={styles.sectionContent}>
            <Text style={[styles.fontText, styles.defaultText]}>
              Costo de mano de obra: S/. {proyecto.costoManoObra ?? "0.00"}
            </Text>
            <Text style={[styles.fontText, styles.defaultText]}>
              Costo de repuestos: S/. {proyecto.costoRepuestos ?? "0.00"}
            </Text>
            <Text style={[styles.fontText, styles.defaultText]}>
              Costo total: S/. {proyecto.costoTotal ?? "0.00"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.fontText, styles.index, styles.sectionTitle]}>
              5.
            </Text>
            <Text style={[styles.fontText, styles.sectionTitle]}>Cliente</Text>
          </View>

          <View style={styles.sectionContent}>
            <Text style={[styles.fontText, styles.defaultText]}>
              Nombre: {proyecto.cliente?.nombre}
            </Text>
            <Text style={[styles.fontText, styles.defaultText]}>
              RUC: {proyecto.cliente?.ruc}
            </Text>
            <Text style={[styles.fontText, styles.defaultText]}>
              Teléfono: {proyecto.cliente?.telefono}
            </Text>
            <Text style={[styles.fontText, styles.defaultText]}>
              Correo: {proyecto.cliente?.correo}
            </Text>
            <Text style={[styles.fontText, styles.defaultText]}>
              Dirección: {proyecto.cliente?.direccion}
            </Text>
          </View>
        </View>

        {/* Seccion de repuestos */}

        <View style={styles.section} wrap={false}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.fontText, styles.index, styles.sectionTitle]}>
              6.
            </Text>
            <Text style={[styles.fontText, styles.sectionTitle]}>
              Repuestos
            </Text>
          </View>

          <View style={styles.sectionContent}>
            {proyecto.repuestos && proyecto.repuestos.length > 0 ? (
              proyecto.repuestos.map((repuesto, index) => (
                <View key={index} style={styles.subsection} wrap={false}>
                  <View style={styles.sectionHeader}>
                    <Text
                      style={[
                        styles.fontText,
                        styles.index,
                        styles.subsectionTile,
                      ]}
                    >
                      6.{index + 1}.
                    </Text>
                    <Text style={[styles.fontText, styles.subsectionTile]}>
                      {repuesto.nombre}
                    </Text>
                  </View>

                  <View style={[styles.subsectionContent, styles.contentImage]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fontText, styles.defaultText]}>
                        Precio: S/. {repuesto.precio}
                      </Text>
                      <Text style={[styles.fontText, styles.defaultText]}>
                        Cantidad: {repuesto.cantidad}
                      </Text>
                      <Text style={[styles.fontText, styles.defaultText]}>
                        Descripción: {repuesto.descripcion}
                      </Text>
                    </View>
                    {repuesto.linkImg && (
                      <Image src={repuesto.linkImg} style={styles.image} />
                    )}
                  </View>
                </View>
              ))
            ) : (
              <Text style={[styles.fontText, styles.defaultText]}>
                No se han asignado repuestos.
              </Text>
            )}
          </View>
        </View>

        {/* Sección de especificaciones de pruebas */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.fontText, styles.index, styles.sectionTitle]}>
              7.
            </Text>
            <Text style={[styles.fontText, styles.sectionTitle]}>
              Especificaciones de Pruebas
            </Text>
          </View>

          <View style={styles.sectionContent}>
            {proyecto.especificaciones &&
            proyecto.especificaciones.length > 0 ? (
              proyecto.especificaciones?.map((especificacion, index) => (
                <View key={index} style={styles.subsection}>
                  <View style={styles.sectionHeader}>
                    <Text
                      style={[
                        styles.fontText,
                        styles.index,
                        styles.subsectionTile,
                      ]}
                    >
                      7.{index + 1}.
                    </Text>
                    <Text style={[styles.fontText, styles.subsectionTile]}>
                      {especificacion.nombre}
                    </Text>
                  </View>

                  <View style={styles.subsectionContent}>
                    <View style={styles.table}>
                      <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.tableCell}>Parámetro</Text>
                        <Text style={styles.tableCell}>Rango Aceptable</Text>
                      </View>
                      {especificacion.parametros.map((parametro) => (
                        <View
                          key={parametro.idParametro}
                          style={styles.tableRow}
                        >
                          <Text style={styles.tableCell}>
                            {parametro.nombre}
                          </Text>
                          <Text style={styles.tableCell}>
                            {parametro.valorMinimo}
                            {parametro.unidades} - {parametro.valorMaximo}
                            {parametro.unidades}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[styles.fontText, styles.defaultText]}>
                No se han registrado especificaciones de pruebas.
              </Text>
            )}
          </View>
        </View>

        {/* Sección de historial del proyecto */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.fontText, styles.index, styles.sectionTitle]}>
              8.
            </Text>
            <Text style={[styles.fontText, styles.sectionTitle]}>
              Historial del Proyecto
            </Text>
          </View>

          {/* Etapas y empleados */}
          <View style={styles.subsection}>
            <View style={styles.sectionHeader}>
              <Text
                style={[styles.fontText, styles.index, styles.subsectionTile]}
              >
                8.1.
              </Text>
              <Text style={[styles.fontText, styles.subsectionTile]}>
                Etapas y Empleados
              </Text>
            </View>
            <View style={styles.subsectionContent}>
              {historial.etapasEmpleados.length > 0 ? (
                historial.etapasEmpleados.map((etapa, index) => (
                  <View key={index}>
                    <Text style={[styles.fontText, styles.defaultText]}>
                      {index + 1}. {etapa.nombreEtapa}
                    </Text>
                    {etapa.empleados.map((empleado, empIndex) => (
                      <View key={empIndex} style={styles.subsectionContent}>
                        <Text style={[styles.fontText, styles.defaultText]}>
                          Nombre: {empleado.nombre} {empleado.apellido}
                        </Text>
                        <Text style={[styles.fontText, styles.defaultText]}>
                          Correo: {empleado.correo}
                        </Text>
                        <Text style={[styles.fontText, styles.defaultText]}>
                          Teléfono: {empleado.telefono}
                        </Text>
                        <Text style={[styles.fontText, styles.defaultText]}>
                          Rol: {empleado.rol}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))
              ) : (
                <Text style={[styles.fontText, styles.defaultText]}>
                  No hay empleados asignados a etapas.
                </Text>
              )}
            </View>
          </View>

          {/* Cambios de etapas */}
          <View style={styles.subsection} wrap={false}>
            <View style={styles.sectionHeader}>
              <Text
                style={[styles.fontText, styles.index, styles.subsectionTile]}
              >
                8.2.
              </Text>
              <Text style={[styles.fontText, styles.subsectionTile]}>
                Cambio de Etapas
              </Text>
            </View>

            <View style={styles.subsectionContent}>
              {historial.etapasCambios && historial.etapasCambios.length > 0 ? (
                <View style={styles.table}>
                  {/* Encabezado */}
                  <View style={styles.tableRow}>
                    <Text style={[styles.fontText, styles.tableTitle]}>
                      <Text style={styles.textTableTitle}>#</Text>
                    </Text>
                    <Text style={[styles.fontText, styles.tableTitle]}>
                      <Text style={styles.textTableTitle}>Etapa</Text>
                    </Text>
                    <Text style={[styles.fontText, styles.tableTitle]}>
                      <Text style={styles.textTableTitle}>Inicio</Text>
                    </Text>
                    <Text style={[styles.fontText, styles.tableTitle]}>
                      <Text style={styles.textTableTitle}>Fin</Text>
                    </Text>
                  </View>
                  {/* Filas */}
                  {historial.etapasCambios
                    .filter((cambio) => cambio.fechaFin)
                    .map((cambio, index) => (
                      <View key={cambio.idEtapaCambio} style={styles.tableRow}>
                        <Text style={[styles.fontText, styles.tableCell]}>
                          {index + 1}
                        </Text>
                        <Text style={[styles.fontText, styles.tableCell]}>
                          {cambio.nombreEtapa}
                        </Text>
                        <Text style={[styles.fontText, styles.tableCell]}>
                          {new Date(cambio.fechaInicio).toLocaleDateString(
                            "es-PE"
                          )}
                        </Text>
                        <Text style={[styles.fontText, styles.tableCell]}>
                          {new Date(cambio.fechaFin!).toLocaleDateString(
                            "es-PE"
                          )}
                        </Text>
                      </View>
                    ))}
                </View>
              ) : (
                <Text style={[styles.fontText, styles.defaultText]}>
                  No se registraron cambios en las etapas.
                </Text>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
