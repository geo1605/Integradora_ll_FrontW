import { motion } from "framer-motion";
import { Card, CardBody, CardHeader, Progress } from "@heroui/react";
import { Thermometer } from "lucide-react";

export default function Temperature() {
  const temperature = 24; // Puedes cambiar este valor dinámicamente

  // Determinar color según la temperatura
  let iconColor = "text-[var(--green)]";
  let progressColor = "success";
  let bgGradient = "from-green-100 to-green-50";
  let progressClass = "bg-green-500";

  if (temperature < 10) {
    iconColor = "text-[var(--blue)]";
    progressColor = "primary";
    bgGradient = "from-blue-100 to-blue-50";
    progressClass = "bg-blue-500";
  } else if (temperature > 30) {
    iconColor = "text-[var(--alert)]";
    progressColor = "danger";
    bgGradient = "from-red-100 to-red-50";
    progressClass = "bg-red-500";
  }

  // Calcular valor de progreso (ajustado para rango 0-40°C)
  const progressValue = Math.min(Math.max(temperature, 0), 40) * 2.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 min-w-0"
          >
            <div className="flex items-center justify-center w-10 h-10">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <Thermometer className={`w-9 h-9 ${iconColor}`} />
              </motion.div>
            </div>
            <h2 className="text-xl font-semibold hidden sm:block">
              Temperatura
            </h2>
          </motion.div>

          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-baseline gap-1"
          >
            <span className={`text-2xl sm:text-3xl font-bold ${iconColor}`}>
              {temperature}
            </span>
            <span className="text-base sm:text-lg text-gray-600">°C</span>
          </motion.div>
        </CardHeader>

        <CardBody className="px-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.4 }}
            className="mt-2"
          >
            <Progress 
              aria-label="Temperature level"
              value={progressValue}
              color={progressColor}
              size="sm"
            />
          </motion.div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
