
import React, { useState } from "react";
import SuudaiNavbar from "../../components/NavegationBar";
import {Card, CardBody} from "@heroui/react";
import Tank from "./tank/Tank";
import Temperature from "./temperature";

export default function Home() {
  const [level, setLevel] = useState(60); // Nivel inicial
  return (
    <>
      <SuudaiNavbar />

      <div className="flex p-4 gap-6">
        {/* Columna 1: fija */}
        <div className="w-3/5 flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-green-700">Monitoreo Actual</h1>

          <div className="h-32 flex gap-4">
            <Card className="w-1/2 h-full">
            <Temperature />
            </Card>
            <Card className="w-1/2 h-full">a</Card>
          </div>

          <Card className="flex-grow min-h-[200px]">Otro contenido</Card>
        </div>

        {/* Columna 2: más angosta */}
        <Card className="basis-[10%] min-h-[400px]">
           <Tank level={level} />
        </Card>

        {/* Columna 3: más ancha */}
        <Card className="basis-[25%] min-h-[500px]">Columna 3</Card>
      </div>

    </>
  );
}
