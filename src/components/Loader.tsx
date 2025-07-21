import { Spinner } from "@heroui/react";

export default function Loader({
    size = "lg",
    color = "success",
    text = "Cargando...",
    }: {
    size?: "sm" | "md" | "lg";
    color?:  "success";
    text?: string;
    }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full space-y-2">
        <Spinner size={size} color={color} />
        <p className="text-sm text-gray-600">{text}</p>
        </div>
    );
    }
