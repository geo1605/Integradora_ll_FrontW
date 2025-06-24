import React from "react";
import { Thermometer, Droplets, FlaskConical, ShieldCheck } from "lucide-react";
import { Card } from "@heroui/react";
import { motion } from "framer-motion";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color,
  animate = false 
}: { 
  title: string; 
  value: string | React.ReactNode; 
  icon: React.ReactNode; 
  color: string;
  animate?: boolean;
}) => (
  <Card className="flex items-center justify-between p-4">
    <div className="flex items-center gap-3">
      <motion.div
        className={`w-10 h-10 flex items-center justify-center rounded-full ${color} bg-opacity-20`}
        animate={{
          scale: animate ? [1, 1.1, 1] : 1,
          rotate: animate ? [0, 5, -5, 0] : 0
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {icon}
      </motion.div>
      <div className="text-left">
        <p className="text-sm leading-tight">{title}</p>
        <p className="text-xl font-bold leading-tight">{value}</p>
      </div>
    </div>
  </Card>
);

export default function StatsSummary() {
  const generalStatus = "Normal"; // cambiar a "Alerta" para ver el efecto
  const isNormal = generalStatus === "Normal";

  return (
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard
      title="Temperatura Promedio"
      value="22.4°C"
      icon={<Thermometer className="text-orange-500 w-5 h-5" />}
      color="bg-orange-500"
      animate={true}
    />
    <StatCard
      title="Humedad Promedio"
      value="64.2%"
      icon={<Droplets className="text-cyan-500 w-5 h-5" />}
      color="bg-cyan-500"
      animate={true}
    />
    <StatCard
      title="pH Promedio"
      value="6.8"
      icon={<FlaskConical className="text-purple-500 w-5 h-5" />}
      color="bg-purple-500"
      animate={true}
    />
    <StatCard
      title="Estado General"
      value={
        <motion.span 
          className={`font-semibold ${isNormal ? "text-green-600" : "text-red-600"}`}
          animate={!isNormal ? { 
            scale: [1, 1.05, 1],
            transition: { duration: 1.5, repeat: Infinity } 
          } : {}}
        >
          {generalStatus}
        </motion.span>
      }
      icon={
        <ShieldCheck className={`${isNormal ? "text-green-600" : "text-red-600"} w-5 h-5`} />
      }
      color={isNormal ? "bg-green-500" : "bg-red-500"}
      animate={!isNormal}
    />
  </div>
);

}