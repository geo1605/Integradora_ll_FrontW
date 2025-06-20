import { motion } from "framer-motion";
import { Card, CardBody, CardHeader, Progress } from "@heroui/react";
import { Droplets } from "lucide-react";

export default function Humidity() {
  const humidity = 65; // Puedes cambiar este valor dinámicamente

  // Determinar color según la humedad
  let iconColor = "text-[var(--green)]";
  let progressColor = "success";
  let bgGradient = "from-green-100 to-green-50";
  let progressClass = "bg-green-500";

  if (humidity > 70) {
    iconColor = "text-[var(--blue)]";
    progressColor = "primary";
    bgGradient = "from-blue-100 to-blue-50";
    progressClass = "bg-blue-500";
  } else if (humidity < 30) {
    iconColor = "text-[var(--alert)]";
    progressColor = "danger";
    bgGradient = "from-red-100 to-red-50";
    progressClass = "bg-red-500";
  }

  return (
    <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="w-full max-w-md mx-auto"
>
  <Card>
    <CardHeader className="flex flex-wrap items-center justify-between ">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 min-w-0"
      >
        <div className="flex items-center justify-center w-10 h-10 ">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Droplets className={`w-9 h-9 ${iconColor}`} />
          </motion.div>
        </div>
        <h2 className="text-xl font-semibold hidden sm:block">Humedad</h2>
      </motion.div>

      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex items-baseline gap-1"
      >
        <span className={`text-2xl sm:text-3xl font-bold ${iconColor}`}>
          {humidity}
        </span>
        <span className="text-base sm:text-lg text-gray-600">%</span>
      </motion.div>
    </CardHeader>


    <CardBody className="px-6 ">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 0.4 }}
        className="mt-2"
      >
        <Progress 
          aria-label="Humidity level"
          value={humidity}
          color={progressColor}
          size="sm"
        />
      </motion.div>
    </CardBody>
  </Card>
</motion.div>

  );
}