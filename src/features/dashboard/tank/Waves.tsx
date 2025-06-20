import Wavify from "react-wavify";

interface TankWavesProps {
  level: number; // 0–100
}

export default function TankWaves({ level }: TankWavesProps) {
  const clampedLevel = Math.min(100, Math.max(0, level));
  const waveHeight = `${clampedLevel}%`; // YA NO invertimos el nivel

  return (
    <>
      {/* Fondo azul sólido debajo de las olas */}
      <div
        className="absolute w-full"
        style={{
          bottom: 0,
          height: waveHeight,
          backgroundColor: "var(--blue)",
          transition: "height 0.7s ease-in-out",
        }}
      />

      {/* Olas de fondo */}
      <Wavify
        fill="#5EC2F7"
        paused={false}
        options={{
          height: 20,
          amplitude: 15,
          speed: 0.15,
          points: 4,
        }}
        className="absolute w-full opacity-50 transition-all duration-700 ease-in-out"
        style={{ bottom: waveHeight }}
      />

      {/* Olas delanteras */}
      <Wavify
        fill="var(--blue)"
        paused={false}
        options={{
          height: 30,
          amplitude: 25,
          speed: 0.25,
          points: 3,
        }}
        className="absolute w-full transition-all duration-700 ease-in-out"
        style={{ bottom: waveHeight }}
      />
    </>
  );
}
