import { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Pagination } from "@heroui/react";

const allData = [
  { date: "08/06/2025", time: "15:30", temp: "22.5°C", humidity: "65%", water: "78%", ph: "6.8", status: "Normal" },
  { date: "08/06/2025", time: "14:30", temp: "24.1°C", humidity: "58%", water: "72%", ph: "7.2", status: "Desviación" },
  { date: "08/06/2025", time: "13:30", temp: "21.8°C", humidity: "71%", water: "65%", ph: "6.3", status: "Normal" },
  { date: "08/06/2025", time: "12:30", temp: "22.1°C", humidity: "45%", water: "81%", ph: "8.9", status: "Alerta" },
  { date: "08/06/2025", time: "11:30", temp: "23.5°C", humidity: "60%", water: "75%", ph: "6.5", status: "Normal" },
  { date: "08/06/2025", time: "10:30", temp: "23.1°C", humidity: "61%", water: "75%", ph: "6.0", status: "Desviación" },
  { date: "08/06/2025", time: "09:30", temp: "21.0°C", humidity: "73%", water: "88%", ph: "6.7", status: "Normal" },
];

const statusProps: Record<string, { color: "success" | "warning" | "danger" }> = {
  Normal: { color: "success" },
  "Desviación": { color: "warning" },
  Alerta: { color: "danger" }
};

export default function HistoryTable() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(allData.length / rowsPerPage);

  const paginatedData = allData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className=" p-4 rounded-xl shadow-md">
      <Table aria-label="Historial de datos">
        <TableHeader>
          <TableColumn>Fecha</TableColumn>
          <TableColumn>Hora</TableColumn>
          <TableColumn>Temperatura</TableColumn>
          <TableColumn>Humedad</TableColumn>
          <TableColumn>Nivel de Agua</TableColumn>
          <TableColumn>pH</TableColumn>
          <TableColumn>Estado</TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.time}</TableCell>
              <TableCell>{row.temp}</TableCell>
              <TableCell>{row.humidity}</TableCell>
              <TableCell>{row.water}</TableCell>
              <TableCell>{row.ph}</TableCell>
              <TableCell>
                <Chip color={statusProps[row.status].color} variant="flat">
                  {row.status}
                </Chip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs ">Mostrando {paginatedData.length} de {allData.length} registros</p>
        <Pagination total={totalPages} page={page} onChange={setPage} color="success" />
      </div>
    </div>
  );
}
