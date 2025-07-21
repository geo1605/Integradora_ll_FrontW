import { Card, CardBody, CardHeader, Button } from '@heroui/react';
import { Thermometer, Zap, TestTube } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { getAllSensorRegisters } from '../../api/sensors'; // Adjust the import path as needed

interface SensorData {
  temperature: number;
  conductivity: number;
  ph: number;
  level: number;
}

interface HistoryItem {
  _id: string;
  createDate: string;
  sensors: SensorData[];
}

export default function HistoryLectures() {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllSensorRegisters();
        // Sort by date (newest first) and take first 4
        const sortedData = response.data
          .sort((a: HistoryItem, b: HistoryItem) => 
            new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
          )
          .slice(0, 4);
        setHistoryData(sortedData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (level: number): string => {
    if (level < 2.5) return 'bg-[var(--alert)]'; // danger (low level)
    if (level < 4) return 'bg-[var(--alert)]'; // warning
    return 'bg-[var(--green)]'; // normal
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2, yoyo: Infinity }
    },
    tap: { scale: 0.98 }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="w-full h-[500px]">
      <CardHeader className="pb-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <h2 className="text-lg font-bold text-[var(--text-color)] mb-2">
            Historial Reciente
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-0.5 bg-[var(--blue)] rounded-full origin-left"
          />
        </motion.div>
      </CardHeader>

      <CardBody className="pt-4 pb-4 flex flex-col h-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex-grow overflow-y-auto space-y-4"
        >
          <AnimatePresence>
            {historyData.map((data) => {
              const sensorData = data.sensors[0];
              const isFull = sensorData.level >= 4;
              const statusColor = getStatusColor(sensorData.level);
              
              return (
                <motion.div
                  key={data._id}
                  variants={itemVariants}
                  className="relative p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[var(--text-color)]">
                      {formatTime(data.createDate)}
                    </span>
                    <motion.div
                      className={`w-4 h-4 rounded-full ${statusColor}`}
                      animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <motion.div className="flex items-center gap-1" whileHover={{ x: 5 }}>
                        <Thermometer className="w-3.5 h-3.5 text-[var(--blue)]" />
                        <span className="text-xs text-[var(--text-color)]">
                          {sensorData.temperature.toFixed(1)}°C
                        </span>
                      </motion.div>
                      <motion.div className="flex items-center gap-1" whileHover={{ x: 5 }}>
                        <Zap className="w-3 h-3 text-[var(--blue)]" />
                        <span className="text-xs text-[var(--text-color)]">
                          {sensorData.conductivity.toFixed(2)} mS/cm
                        </span>
                      </motion.div>
                    </div>

                    <div className="flex items-center justify-between">
                      <motion.div className="flex items-center gap-1" whileHover={{ x: 5 }}>
                        <TestTube className="w-3.5 h-3.5 text-[var(--purple)]" />
                        <span className="text-xs text-[var(--text-color)]">
                          pH{sensorData.ph.toFixed(1)}
                        </span>
                      </motion.div>
                      <motion.div className="flex items-center gap-1" whileHover={{ x: 5 }}>
                        <motion.div
                          className="w-2 h-2 bg-[var(--blue)] rounded-sm"
                          animate={{ rotate: [0, 180, 360] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                        <span className="text-xs text-[var(--text-color)]">
                          {isFull ? 'Tanque lleno' : 'Tanque vacío'}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="mt-4"
        >
          <Button
            color="success"
            className="rounded-full text-sm text-white font-semibold"
            fullWidth
            onClick={() => navigate("/history")}
          >
            Ver historial completo
          </Button>
        </motion.div>
      </CardBody>
    </Card>
  );
}