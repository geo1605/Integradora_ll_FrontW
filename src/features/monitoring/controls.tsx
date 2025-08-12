// components/Controls.tsx
import { Card, Switch } from "@heroui/react";
import { Filter, RefreshCw, Droplet, Filter as FilterOff } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Easing } from "framer-motion";
import { getMotorStates, updateMotorStates } from "../../api/motors"; 

const getIconAnimation = (iconName: string, isOn: boolean) => {
  if (!isOn) return {};
  switch (iconName) {
    case "RefreshCw":
      return { rotate: 360, transition: { repeat: Infinity, duration: 2, ease: "linear" as Easing } };
    case "Droplet":
      return { y: [0, -5, 0], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" as Easing } };
    case "Filter":
    case "FilterOff":
      return { x: [-2, 2, -2], transition: { repeat: Infinity, duration: 1.8, ease: "easeInOut" as Easing } };
    default:
      return { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } };
  }
};

const ControlCard = ({
  label,
  motorKey,
  Icon,
  iconName,
  isOn,
  onToggle
}: {
  label: string;
  motorKey: keyof MotorStates;
  Icon: React.ElementType;
  iconName: string;
  isOn: boolean;
  onToggle: (key: keyof MotorStates, value: boolean) => void;
}) => {
  const circleStyle = { backgroundColor: isOn ? "var(--green)" : "var(--alert)" };
  const iconStyle = { color: "#FFFFFF" };

  return (
    <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
      <Card className="p-6 flex flex-col items-center gap-3 shadow-md rounded-xl relative overflow-hidden" style={{ backgroundColor: "var(--section-color)" }}>
        <AnimatePresence>
          {isOn && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-green-500" />}
        </AnimatePresence>

        <motion.div
          className="rounded-full p-3 relative"
          style={circleStyle}
          animate={{
            scale: isOn ? [1, 1.05, 1] : 1,
            boxShadow: isOn ? "0 0 15px rgba(74, 222, 128, 0.7)" : "0 0 0px rgba(239, 68, 68, 0)"
          }}
          transition={{ scale: { duration: 0.5, repeat: isOn ? Infinity : 0, repeatDelay: 1 }, boxShadow: { duration: 0.3 } }}
        >
          <motion.div animate={getIconAnimation(iconName, isOn)}>
            <Icon className="w-6 h-6" style={iconStyle} />
          </motion.div>
        </motion.div>

        <span className="text-sm font-semibold text-[var(--text-color)] text-center">{label}</span>

        <motion.div whileTap={{ scale: 0.95 }}>
          <Switch isSelected={isOn} onChange={() => onToggle(motorKey, !isOn)} color={isOn ? "success" : "danger"} />
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isOn ? 1 : 0, backgroundColor: isOn ? "var(--green)" : "var(--alert)" }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </Card>
    </motion.div>
  );
};

export default function Controls() {
  const [states, setStates] = useState<MotorStates>({
    VERTICAL: false,
    RIEGO: false,
    AGITACION: false,
    CASCADA: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const data = await getMotorStates();
        setStates(data);
      } catch (err) {
        console.error("Error cargando estados:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStates();
  }, []);

  const handleToggle = async (key: keyof MotorStates, value: boolean) => {
    const newState = { ...states, [key]: value };
    setStates(newState);
    try {
      await updateMotorStates(newState);
    } catch (err) {
      console.error("Error actualizando motor:", err);
    }
  };

  if (loading) return <p className="p-4">🔄 Cargando controles...</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-[var(--bg-color)]">
      <ControlCard label="Filtro Cascada" motorKey="CASCADA" Icon={Filter} iconName="Filter" isOn={states.CASCADA} onToggle={handleToggle} />
      <ControlCard label="Sistema de Agitación" motorKey="AGITACION" Icon={RefreshCw} iconName="RefreshCw" isOn={states.AGITACION} onToggle={handleToggle} />
      <ControlCard label="Sistema de Riego" motorKey="RIEGO" Icon={Droplet} iconName="Droplet" isOn={states.RIEGO} onToggle={handleToggle} />
      <ControlCard label="Sistema de Filtración" motorKey="VERTICAL" Icon={FilterOff} iconName="FilterOff" isOn={states.VERTICAL} onToggle={handleToggle} />
    </div>
  );
}

// ✅ Nuevo tipo MotorStates sin MOSQUITOS
interface MotorStates {
  VERTICAL: boolean;
  RIEGO: boolean;
  AGITACION: boolean;
  CASCADA: boolean;
}
