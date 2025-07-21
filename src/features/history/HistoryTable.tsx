import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Button,
  DatePicker
} from "@heroui/react";
import { getAllSensorRegisters } from "../../api/sensors";
import { CalendarDateTime} from "@internationalized/date";
import  Loader  from "../../components/Loader";

interface SensorData {
  temperature: number;
  conductivity: number;
  ph: number;
  level: number;
}

interface HistoryItem {
  _id: string;
  createDate: string;
  sensors: SensorData[];
}

export default function HistoryTable() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [allData, setAllData] = useState<HistoryItem[]>([]);
  const [filteredData, setFilteredData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    startDate: null as CalendarDateTime | null,
    endDate: null as CalendarDateTime | null
  });
  const [dateRange, setDateRange] = useState({
    minDate: null as Date | null,
    maxDate: null as Date | null
  });

  const rowsPerPage = 20;

  const normalizeDate = (date: Date | string | null): Date | null => {
    if (!date) return null;
    
    try {
      const d = date instanceof Date ? new Date(date) : new Date(date);
      if (isNaN(d.getTime())) return null;
      return d;
    } catch {
      return null;
    }
  };

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllSensorRegisters();
      
      const sortedData = response.data.sort((a: HistoryItem, b: HistoryItem) => 
        new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
      );
      
      setAllData(sortedData);
      setFilteredData(sortedData);
      setTotalItems(response.count);
      setTotalPages(Math.ceil(response.count / rowsPerPage));
      
      const dates = response.data.map((item: HistoryItem) => new Date(item.createDate));
      const minDate = new Date(Math.min(...dates.map((date: Date) => date.getTime())));
      const maxDate = new Date(Math.max(...dates.map((date: Date) => date.getTime())));
      setDateRange({ minDate, maxDate });
      
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleDateChange = (field: "startDate" | "endDate", date: CalendarDateTime | null) => {
    setFilters(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const applyFilters = () => {
    setPage(1);
    
    if (!filters.startDate && !filters.endDate) {
      setFilteredData(allData);
      setTotalItems(allData.length);
      setTotalPages(Math.ceil(allData.length / rowsPerPage));
      return;
    }
    
    const filtered = allData.filter(item => {
      const itemDate = normalizeDate(item.createDate);
      if (!itemDate) return false;
      
      const itemTime = itemDate.getTime();
      
      if (filters.startDate && !filters.endDate) {
        const startTime = new Date(filters.startDate.toString()).getTime();
        return itemTime >= startTime;
      }
      
      if (!filters.startDate && filters.endDate) {
        const endTime = new Date(filters.endDate.toString()).getTime();
        return itemTime <= endTime;
      }
      
      if (filters.startDate && filters.endDate) {
        const startTime = new Date(filters.startDate.toString()).getTime();
        const endTime = new Date(filters.endDate.toString()).getTime();
        return itemTime >= startTime && itemTime <= endTime;
      }
      
      return true;
    });
    
    setFilteredData(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / rowsPerPage));
  };

  const getWaterStatus = (level: number) => {
    return level >= 50 ? "Tanque lleno" : "Tanque vacío";
  };

  const displayDate = (date: Date | null): string => {
    if (!date) return "--";
    try {
      return date.toLocaleDateString("es-ES");
    } catch {
      return "--";
    }
  };

  const displayDateTime = (date: CalendarDateTime | Date | null): string => {
    if (!date) return "--";
    try {
      const jsDate = date instanceof Date ? date : new Date(date.toString());
      return jsDate.toLocaleString("es-ES", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "--";
    }
  };

  const displayDateRange = () => {
    if (filters.startDate || filters.endDate) {
      return `Mostrando registros del ${displayDateTime(filters.startDate)} al ${displayDateTime(filters.endDate)}`;
    } else {
      return `Mostrando todos los registros (del ${displayDateTime(dateRange.minDate)} al ${displayDateTime(dateRange.maxDate)})`;
    }
  };

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="p-4 rounded-xl shadow-md space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DatePicker
          label="Desde"
          value={filters.startDate}
          onChange={(date) => handleDateChange("startDate", date)}
          className="w-full"
          granularity="minute"
          hideTimeZone
        />
        <DatePicker
          label="Hasta"
          value={filters.endDate}
          onChange={(date) => handleDateChange("endDate", date)}
          className="w-full"
          granularity="minute"
          minValue={filters.startDate}
          hideTimeZone
        />
        <Button
          color="primary"
          onClick={applyFilters}
          className="h-full"
          isLoading={loading}
        >
          Buscar
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600">
            {displayDateRange()}
          </p>

          <Table aria-label="Historial de datos">
            <TableHeader>
              <TableColumn>Fecha</TableColumn>
              <TableColumn>Hora</TableColumn>
              <TableColumn>Temperatura</TableColumn>
              <TableColumn>Conductividad</TableColumn>
              <TableColumn>Nivel de Agua</TableColumn>
              <TableColumn>pH</TableColumn>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => {
                const date = new Date(item.createDate);
                const formattedDate = displayDate(date);
                const formattedTime = date.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                });
                const sensorData = item.sensors[0];

                return (
                  <TableRow key={item._id}>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>{formattedTime}</TableCell>
                    <TableCell>{sensorData.temperature.toFixed(1)}°C</TableCell>
                    <TableCell>{sensorData.conductivity.toFixed(2)} mS/cm</TableCell>
                    <TableCell>{getWaterStatus(sensorData.level)} ({sensorData.level}%)</TableCell>
                    <TableCell>{sensorData.ph.toFixed(1)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      )}

      <div className="flex items-center justify-between mt-4">
        <p className="text-xs">
          Mostrando {paginatedData.length} de {totalItems} registros
        </p>
        <Pagination
          total={totalPages}
          page={page}
          onChange={setPage}
          color="success"
          isDisabled={loading || error !== null}
        />
      </div>
    </div>
  );
}