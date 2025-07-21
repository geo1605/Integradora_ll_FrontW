import { motion } from "framer-motion";
import { Card, CardBody, CardHeader, Progress } from "@heroui/react";
import { Zap } from "lucide-react";

interface ConductivityProps {
  value?: number;
}

export default function Conductivity({ value }: ConductivityProps) {
  // Determinar color según la conductividad
  let iconColor = "text-[var(--green)]";
  let progressColor: "default" | "success" | "primary" | "secondary" | "warning" | "danger" = "success";

  if (value === undefined || value === null) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-4">Datos de conductividad no disponibles</div>
        </CardBody>
      </Card>
    );
  }

  const roundedValue = Math.round(value * 10) / 10; // Redondear a 1 decimal

  if (roundedValue > 700) {
    iconColor = "text-[var(--alert)]";
    progressColor = "danger";
  } else if (roundedValue > 500) {
    iconColor = "text-[var(--blue)]";
    progressColor = "primary";
  }

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
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Zap className={`w-9 h-9 ${iconColor}`} />
              </motion.div>
            </div>
            <h2 className="text-xl font-semibold hidden sm:block">Conductividad</h2>
          </motion.div>

          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-baseline gap-1"
          >
            <span className={`text-2xl sm:text-3xl font-bold ${iconColor}`}>
              {roundedValue}
            </span>
            <span className="text-base sm:text-lg text-gray-600">µS/cm</span>
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
              aria-label="Conductivity level"
              value={(roundedValue / 10) * 100} // Ajuste para mostrar correctamente en la barra
              color={progressColor}
              size="sm"
            />
          </motion.div>
        </CardBody>
      </Card>
    </motion.div>
  );
}