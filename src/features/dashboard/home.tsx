
import React, { useState } from "react";
import SuudaiNavbar from "../../components/NavegationBar";
import {Card, CardBody} from "@heroui/react";
import Tank from "./tank/Tank";
import Temperature from "./temperature";
import Humidity from "./humidity";
import HistoryLectures from "./history";

export default function Home() {
  const [level, setLevel] = useState(60); // Nivel inicial
  return (
    <>
      <SuudaiNavbar />

      <div className="flex flex-col md:flex-row p-4 gap-6">
        {/* Columna 1: fija */}
        <div className="w-full md:w-3/5 flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-green-700">Monitoreo Actual</h1>

          <div className="flex flex-row gap-4 w-full">
            <div className="w-full sm:w-1/2">
              <Temperature />
            </div>
            <div className="w-full sm:w-1/2">
              <Humidity />
            </div>
          </div>

          <Card className="flex-grow min-h-[200px]">Otro contenido</Card>
        </div>
        <div className="flex flex-row gap-4 w-full md:w-2/5">
        {/* Columna 2: más angosta */}
        <Card className="w-1/5 min-h-[400px]">
           <Tank level={level} />
        </Card>

        <HistoryLectures />
        </div>
      </div>

    </>
  );
}
