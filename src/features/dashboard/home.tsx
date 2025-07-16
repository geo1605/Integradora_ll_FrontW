import { useState } from "react";
import { Card } from "@heroui/react";
import Tank from "./tank/Tank";
import Temperature from "./temperature";
import Conductivity from "./Conductivity";
import HistoryLectures from "./history";
import CameraImage from "../../components/Camera";

export default function Home() {
  const [level] = useState(60); // Nivel inicial

  return (
    <div className="flex flex-col md:flex-row p-4 gap-6 h-full overflow-hidden">
      {/* Columna 1: fija */}
      <div className="w-full md:w-3/5 flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-green-700">Monitoreo Actual</h1>

        <div className="flex flex-row gap-4 w-full">
          <div className="w-full sm:w-1/2">
            <Temperature />
          </div>
          <div className="w-full sm:w-1/2">
            <Conductivity />
          </div>
        </div>

        <Card className="h-80">
          <CameraImage />
        </Card>
      </div>

      {/* Columna 2: más angosta */}
      <div className="flex flex-row gap-4 w-full md:w-2/5">
        <Card className="w-1/5 min-h-[400px]">
          <Tank level={level} />
        </Card>

        <HistoryLectures />
      </div>
    </div>
  );
}
