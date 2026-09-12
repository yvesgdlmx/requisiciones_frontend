import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 40,
    objectFit: "contain",
  },
  companyInfo: {
    textAlign: "right",
    fontSize: 10,
    color: "#333",
    maxWidth: 220,
  },
  header: {
    backgroundColor: "#00a87e",
    color: "white",
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
  },
  headerTitle: { fontSize: 14, fontWeight: "bold" },
  headerSub: { fontSize: 10, marginTop: 2 },
  table: { display: "table", width: "auto", marginBottom: 12 },
  tableRow: { flexDirection: "row" },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
    padding: 5,
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "solid",
  },
  tableCell: {
    padding: 5,
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "solid",
  },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 6, marginTop: 12 },
  commentBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "solid",
    padding: 10,
    marginTop: 5,
    borderRadius: 3,
    fontSize: 10,
    fontStyle: "italic",
  },
  compradorBox: {
    marginBottom: 10,
    fontSize: 11,
    fontWeight: "bold",
  },
});

const RequisicionPDF = ({ requisicion }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Logo e información de empresa */}
      <View style={styles.topBar}>
        <Image src="/img/logo_real.png" style={styles.logo} />
        <View style={styles.companyInfo}>
          <Text>Laboratorio Optimex SA de CV ©</Text>
          <Text>Capulin #1986 col. el tigre</Text>
          <Text>CP 45134 Zapopan, Jal.</Text>
        </View>
      </View>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Detalle de la Requisición</Text>
        <Text style={styles.headerSub}>
          Folio {requisicion.folio || "-"} - {requisicion.fecha || "-"}
        </Text>
      </View>

      {/* Comprador */}
      <Text style={styles.compradorBox}>
        Comprador: {requisicion.comprador || "-"}
      </Text>

      {/* Info General */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Área</Text>
          <Text style={styles.tableHeader}>Objetivo</Text>
          <Text style={styles.tableHeader}>Solicitante</Text>
          <Text style={styles.tableHeader}>Status</Text>
          <Text style={styles.tableHeader}>Prioridad</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{requisicion.area || "-"}</Text>
          <Text style={styles.tableCell}>{requisicion.objetivo || "-"}</Text>
          <Text style={styles.tableCell}>{requisicion.solicitante || "-"}</Text>
          <Text style={styles.tableCell}>{requisicion.status || "-"}</Text>
          <Text style={styles.tableCell}>{requisicion.prioridad || "-"}</Text>
        </View>
      </View>

      {/* Artículos */}
      <Text style={styles.sectionTitle}>Artículos de la Requisición</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Cantidad</Text>
          <Text style={styles.tableHeader}>Unidad</Text>
          <Text style={styles.tableHeader}>Núm. Parte</Text>
          <Text style={styles.tableHeader}>Descripción</Text>
        </View>
        {requisicion.articulos?.length > 0 ? (
          requisicion.articulos.map((art, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.tableCell}>{art.cantidad || "-"}</Text>
              <Text style={styles.tableCell}>{art.unidadMedida || "-"}</Text>
              <Text style={styles.tableCell}>{art.numeroParte || "No asignado"}</Text>
              <Text style={styles.tableCell}>{art.descripcion || "-"}</Text>
            </View>
          ))
        ) : (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell} colSpan={4}>
              No hay artículos
            </Text>
          </View>
        )}
      </View>

      {/* Datos de compra */}
      <Text style={styles.sectionTitle}>Datos de compra</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Proveedor</Text>
          <Text style={styles.tableHeader}>Tipo de compra</Text>
          <Text style={styles.tableHeader}>Monto</Text>
          <Text style={styles.tableHeader}>ETA</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{requisicion.proveedor || "-"}</Text>
          <Text style={styles.tableCell}>{requisicion.tipoCompra || "-"}</Text>
          <Text style={styles.tableCell}>{requisicion.monto || "-"}</Text>
          <Text style={styles.tableCell}>{requisicion.eta || "-"}</Text>
        </View>
      </View>

      {/* Comentarios */}
      <Text style={styles.sectionTitle}>Comentario (comprador)</Text>
      <View style={styles.commentBox}>
        <Text>{requisicion.comentario || "No hay comentario."}</Text>
      </View>

      {/* Documentos */}
      {requisicion.documentos?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Documentos</Text>
          {requisicion.documentos.map((doc, idx) => (
            <Text key={idx}>📄 {doc.nombre || "-"}</Text>
          ))}
        </>
      )}
    </Page>
  </Document>
);

export default RequisicionPDF;
