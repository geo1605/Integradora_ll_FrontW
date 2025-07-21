import { useState, useEffect } from "react";
import { Card } from "@heroui/react";
import Tank from "./tank/Tank";
import Temperature from "./temperature";
import Conductivity from "./Conductivity";
import HistoryLectures from "./history";
import { CameraImage, Loader } from "../../components/"
import { getLastSensorRegister } from "../../api/sensors";

interface SensorData {
  ph?: number;
  conductivity?: number;
  temperature?: number;
  level?: number;
}

export default function Home() {
  const [sensorData, setSensorData] = useState<SensorData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLastSensorRegister();
        // Extraemos el primer elemento del array sensors
        const sensorReadings = response.data.sensors[0];
        setSensorData(sensorReadings);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Actualizar cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col md:flex-row p-4 gap-6 h-full overflow-hidden">
      {/* Columna 1: fija */}
      <div className="w-full md:w-3/5 flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-green-700">Monitoreo Actual</h1>

        <div className="flex flex-row gap-4 w-full">
          <div className="w-full sm:w-1/2">
            <Temperature value={sensorData.temperature} />
          </div>
          <div className="w-full sm:w-1/2">
            <Conductivity value={sensorData.conductivity} />
          </div>
        </div>

        <Card className="h-80">
          <CameraImage />
        </Card>
      </div>

      {/* Columna 2: más angosta */}
      <div className="flex flex-row gap-4 w-full md:w-2/5">
        <Card className="w-1/5 min-h-[400px]">
          <Tank level={sensorData.level} ph={sensorData.ph} />
        </Card>

        <HistoryLectures />
      </div>
    </div>
  );
}