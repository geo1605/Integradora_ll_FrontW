import { useState } from "react";
import { CircularProgress } from "@heroui/react";

const camera = import.meta.env.VITE_CAMERA;

export default function CameraImage() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z z-10">
          <CircularProgress aria-label="Loading..." color="success" />
        </div>
      )}
      <img
        src={camera}
        alt="Cámara en vivo"
        className="w-full h-full object-contain rounded-lg"
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        style={{ display: loading ? "none" : "block" }}
      />
    </div>
  );
}
