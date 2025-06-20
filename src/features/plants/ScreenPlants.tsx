import { useEffect, useState } from "react";
import { SuudaiNavbar } from "../../components";
import Pipe from "./Pipes/Pipe";
import ElbowPipe from "./Pipes/ElbowPipe";
import ContinuePipe from "./Pipes/ContinuePipe";

export default function HydroSystem() {
  const totalModulos = 27;
  const modulosPorPipe = 3;
  const totalPipes = Math.ceil(totalModulos / modulosPorPipe);

  const [pipesPerRow, setPipesPerRow] = useState(3);
  const [isMobile, setIsMobile] = useState(false); // ← controlar si es móvil (<700px)

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;

      setIsMobile(width <= 700); // ← actualizar estado
      if (width <= 745) setPipesPerRow(1);
      else if (width <= 1020) setPipesPerRow(2);
      else setPipesPerRow(3);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const totalRows = Math.ceil(totalPipes / pipesPerRow);


  

  return (
    <>
      <SuudaiNavbar />
      <div className="flex flex-col items-center -mt-[1px]">
        {Array.from({ length: totalRows }).map((_, rowIndex) => {
          const start = rowIndex * pipesPerRow;
          const end = Math.min(start + pipesPerRow, totalPipes);
          const pipes = Array.from({ length: end - start }).map((_, i) => (
            <Pipe key={start + i} />
          ));

          return (
            <div
              key={rowIndex}
              className={`flex ${
                isMobile ? "flex-col items-center" : "flex-row"
              } w-full max-w-6xl`}
            >
              {/* Solo muestra ElbowPipe/ContinuePipe si no es móvil */}
                {!isMobile && (
                  <div className="w-full max-w-[120px] sm:w-[20%] md:w-[15%] sm:min-w-[100px] ">
                    {rowIndex === 0 ? <ElbowPipe /> : <ContinuePipe />}
                  </div>
                )}


              <div
                className={`flex flex-wrap flex-1 mt-5 ${
                  isMobile ? "justify-center" : "justify-start"
                }`}
              >
                {pipes}
              </div>
            </div>
          );
        })}
        
      </div>
    </>
  );
}
