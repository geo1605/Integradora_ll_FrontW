import { Card, Switch } from "@heroui/react";
import {
  Filter,
  RefreshCw,
  Droplet,
  Lightbulb,
  Filter as FilterOff,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Easing } from "framer-motion";

const getIconAnimation = (iconName: string, isOn: boolean) => {
  if (!isOn) return {};
  
  switch (iconName) {
    case "RefreshCw":
      return {
        rotate: 360,
        transition: {
          repeat: Infinity,
          duration: 2,
          ease: "linear" as Easing
        }
      };
    case "Droplet":
      return {
        y: [0, -5, 0],
        transition: {
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut" as Easing
        }
      };
    case "Lightbulb":
      return {
        scale: [1, 1.1, 1],
        opacity: [1, 0.8, 1],
        transition: {
          repeat: Infinity,
          duration: 1.2
        }
      };
    case "Filter":
    case "FilterOff":
      return {
        x: [-2, 2, -2],
        transition: {
          repeat: Infinity,
          duration: 1.8,
          ease: "easeInOut" as Easing
        }
      };
    default:
      return {
        scale: [1, 1.05, 1],
        transition: {
          repeat: Infinity,
          duration: 2
        }
      };
  }
};

const ControlCard = ({
  label,
  Icon,
  iconName
}: {
  label: string;
  Icon: React.ElementType;
  iconName: string;
}) => {
  const [isOn, setIsOn] = useState(false);

  const circleStyle = {
    backgroundColor: isOn ? "var(--green)" : "var(--alert)",
  };

  const iconStyle = {
    color: "#FFFFFF",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card
        className="p-6 flex flex-col items-center gap-3 shadow-md rounded-xl relative overflow-hidden"
        style={{ backgroundColor: "var(--section-color)" }}
      >
        {/* Animated background overlay */}
        <AnimatePresence>
          {isOn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-green-500"
            />
          )}
        </AnimatePresence>

        {/* Icon with custom animation when on */}
        <motion.div
          className="rounded-full p-3 relative"
          style={circleStyle}
          animate={{
            scale: isOn ? [1, 1.05, 1] : 1,
            boxShadow: isOn
              ? "0 0 15px rgba(74, 222, 128, 0.7)"
              : "0 0 0px rgba(239, 68, 68, 0)",
          }}
          transition={{
            scale: { duration: 0.5, repeat: isOn ? Infinity : 0, repeatDelay: 1 },
            boxShadow: { duration: 0.3 },
          }}
        >
          <motion.div
            animate={getIconAnimation(iconName, isOn)}
          >
            <Icon className="w-6 h-6" style={iconStyle} />
          </motion.div>
        </motion.div>

        <span className="text-sm font-semibold text-[var(--text-color)] text-center">
          {label}
        </span>

        <motion.div whileTap={{ scale: 0.95 }}>
          <Switch
            isSelected={isOn}
            onChange={() => setIsOn(!isOn)}
            color={isOn ? "success" : "danger"}
          />
        </motion.div>

        {/* Status indicator */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: isOn ? 1 : 0,
            backgroundColor: isOn ? "var(--green)" : "var(--alert)",
          }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </Card>
    </motion.div>
  );
};

export default function Controls() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-[var(--bg-color)]">
      <ControlCard label="Filtro Cascada" Icon={Filter} iconName="Filter" />
      <ControlCard label="Sistema de Agitación" Icon={RefreshCw} iconName="RefreshCw" />
      <ControlCard label="Sistema de Riego" Icon={Droplet} iconName="Droplet" />
      <ControlCard label="Sistema de Filtración" Icon={FilterOff} iconName="FilterOff" />
      <ControlCard label="Luz para Mosquitos" Icon={Lightbulb} iconName="Lightbulb" />
    </div>
  );
};