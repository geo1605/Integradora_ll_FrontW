import { useState } from "react";
import { CircularProgress } from "@heroui/react";
import { CameraIcon } from "@heroicons/react/24/outline";

const camera = import.meta.env.VITE_CAMERA;

export default function CameraImage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <CircularProgress aria-label="Loading..." color="success" />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
          <CameraIcon className="w-12 h-12" />
          <span className=" font-medium">Cámara inactiva</span>
          <span className=" text-sm">
            No se puede cargar la transmisión en este momento
          </span>
        </div>
      )}

      <img
        src={camera}
        alt="Cámara en vivo"
        className={`w-full h-full object-contain rounded-lg ${
          loading || error ? "hidden" : "block"
        }`}
        onLoad={() => {
          setLoading(false);
          setError(false);
        }}
        onError={handleError}
      />
    </div>
  );
}