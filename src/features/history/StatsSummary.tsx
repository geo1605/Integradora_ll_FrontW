import React, { useState, useEffect } from "react";
import { Thermometer, Zap, FlaskConical, ShieldCheck } from "lucide-react";
import { Card } from "@heroui/react";
import { motion } from "framer-motion";
import { getAllSensorRegisters } from "../../api/sensors"; // Adjust the import path as necessary

interface Sensor {
  temperature: number;
  conductivity: number;
  ph: number;
}

interface DataItem {
  sensors: Sensor[];
  status?: boolean;
}


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
  const [stats, setStats] = useState({
    avgTemp: 0,
    avgConductivity: 0,
    avgPh: 0,
    status: "Normal"
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await getAllSensorRegisters();
      const data: DataItem[] = response.data;

      if (data.length > 0) {
        const sum = data.reduce(
          (acc: { temp: number; conductivity: number; ph: number; status: number }, item: DataItem) => {
            const sensor = item.sensors[0];
            return {
              temp: acc.temp + sensor.temperature,
              conductivity: acc.conductivity + sensor.conductivity,
              ph: acc.ph + sensor.ph,
              status: item.status ? acc.status + 1 : acc.status
            };
          },
          { temp: 0, conductivity: 0, ph: 0, status: 0 }
        );

        const avgTemp = sum.temp / data.length;
        const avgConductivity = sum.conductivity / data.length;
        const avgPh = sum.ph / data.length;
        const statusPercentage = (sum.status / data.length) * 100;

        setStats({
          avgTemp,
          avgConductivity,
          avgPh,
          status:
            statusPercentage > 80
              ? "Normal"
              : statusPercentage > 50
              ? "Desviación"
              : "Alerta"
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);


  const isNormal = stats.status === "Normal";
  const isWarning = stats.status === "Desviación";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Temperatura Promedio"
        value={loading ? "--" : `${stats.avgTemp.toFixed(1)}°C`}
        icon={<Thermometer className="text-orange-500 w-5 h-5" />}
        color="bg-orange-500"
        animate={true}
      />
      <StatCard
        title="Conductividad Promedio"
        value={loading ? "--" : `${stats.avgConductivity.toFixed(2)} mS/cm`}
        icon={<Zap className="text-cyan-500 w-5 h-5" />}
        color="bg-cyan-500"
        animate={true}
      />
      <StatCard
        title="pH Promedio"
        value={loading ? "--" : stats.avgPh.toFixed(1)}
        icon={<FlaskConical className="text-purple-500 w-5 h-5" />}
        color="bg-purple-500"
        animate={true}
      />
      <StatCard
        title="Estado General"
        value={
          loading ? "--" : (
            <motion.span 
              className={`font-semibold ${
                isNormal ? "text-green-600" : 
                isWarning ? "text-yellow-600" : "text-red-600"
              }`}
              animate={!isNormal ? { 
                scale: [1, 1.05, 1],
                transition: { duration: 1.5, repeat: Infinity } 
              } : {}}
            >
              {stats.status}
            </motion.span>
          )
        }
        icon={
          <ShieldCheck className={`${
            isNormal ? "text-green-600" : 
            isWarning ? "text-yellow-600" : "text-red-600"
          } w-5 h-5`} />
        }
        color={
          isNormal ? "bg-green-500" : 
          isWarning ? "bg-yellow-500" : "bg-red-500"
        }
        animate={!isNormal}
      />
    </div>
  );
}