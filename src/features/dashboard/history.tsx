import { Card, CardBody, CardHeader, Button } from '@heroui/react';
import { Thermometer, Droplets, TestTube } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";


export default function HistoryLectures() {

  const navigate = useNavigate();
  const historyData = [
    {
      time: "14:30",
      temperature: "24°C",
      humidity: "65%",
      ph: "pH7.0",
      phPercentage: "75%",
      showCircle: true,
      status: "normal"
    },
    {
      time: "14:00",
      temperature: "23°C",
      humidity: "68%",
      ph: "pH6.9",
      phPercentage: "78%",
      showCircle: true,
      status: "normal"
    },
    {
      time: "13:30",
      temperature: "25°C",
      humidity: "62%",
      ph: "pH7.2",
      phPercentage: "72%",
      showCircle: true,
      status: "warning"
    },
    {
      time: "13:00",
      temperature: "22°C",
      humidity: "70%",
      ph: "pH6.8",
      phPercentage: "80%",
      showCircle: true,
      status: "normal"
    }
  ];

const getStatusColor = (status: 'normal' | 'warning' | 'danger'): string => {
  const colorMap: Record<typeof status, string> = {
    normal: 'bg-[var(--green)]',
    warning: 'bg-[var(--alert)]',
    danger: 'bg-[var(--alert)]',
  };

  return colorMap[status];
};




  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const, // Explicitly type as Framer Motion's spring
      stiffness: 100,
      damping: 10
    }
  }
};

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        yoyo: Infinity
      }
    },
    tap: {
      scale: 0.98
    }
  };

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
            Historial de Datos
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
            {historyData.map((data, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="relative p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
              >
                {/* Indicador de tiempo y estado */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[var(--text-color)]">{data.time}</span>
                  {data.showCircle && (
                    <motion.div 
                      className={`w-4 h-4 rounded-full ${getStatusColor(data.status as 'normal' | 'warning' | 'danger')}`}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </div>
                
                {/* Datos de sensores */}
                <div className="space-y-1">
                  {/* Temperatura y Humedad */}
                  <div className="flex items-center justify-between">
                    <motion.div 
                      className="flex items-center gap-1"
                      whileHover={{ x: 5 }}
                    >
                      <Thermometer className="w-3.5 h-3.5 text-[var(--blue)]" />
                      <span className="text-xs text-[var(--text-color)]">{data.temperature}</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-1"
                      whileHover={{ x: 5 }}
                    >
                      <Droplets className="w-3 h-3 text-[var(--blue)]" />
                      <span className="text-xs text-[var(--text-color)]">{data.humidity}</span>
                    </motion.div>
                  </div>
                  
                  {/* pH y Porcentaje */}
                  <div className="flex items-center justify-between">
                    <motion.div 
                      className="flex items-center gap-1"
                      whileHover={{ x: 5 }}
                    >
                      <TestTube className="w-3.5 h-3.5 text-[var(--purple)]" />
                      <span className="text-xs text-[var(--text-color)]">{data.ph}</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-1"
                      whileHover={{ x: 5 }}
                    >
                      <motion.div 
                        className="w-2 h-2 bg-[var(--blue)] rounded-sm"
                        animate={{
                          rotate: [0, 180, 360]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      <span className="text-xs text-[var(--text-color)]">{data.phPercentage}</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* Botón Ver más */}
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
            Ver más
          </Button>
        </motion.div>
      </CardBody>
    </Card>
  );
}