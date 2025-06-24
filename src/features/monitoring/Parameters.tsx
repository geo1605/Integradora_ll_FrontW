import { useState } from 'react';
import { Card, Button, Input, toast } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Droplets, Waves, CircleAlert, Save } from "lucide-react";

type ParameterField = 'temperature' | 'ph' | 'humidity' | 'waterLevel';

interface ParameterRange {
  min: number;
  max: number;
}

interface Settings {
  temperature: ParameterRange;
  ph: ParameterRange;
  humidity: ParameterRange;
  waterLevel: ParameterRange;
  isActive: boolean;
}

// Estilo base para íconos redondos
const iconWrapper = "w-10 h-10 flex items-center justify-center rounded-full shadow-md";

// Íconos con colores y animaciones
const icons: Record<ParameterField, JSX.Element> = {
  temperature: (
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={iconWrapper}
      style={{ backgroundColor: 'rgba(251, 146, 60, 0.2)' }} // naranja suave
    >
      <Thermometer className="text-orange-600 w-5 h-5" />
    </motion.div>
  ),
  ph: (
    <motion.div
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      className={iconWrapper}
      style={{ backgroundColor: 'rgba(192, 132, 252, 0.2)' }} // lila suave
    >
      <span className="text-purple-700 font-bold text-sm">pH</span>
    </motion.div>
  ),
  humidity: (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      className={iconWrapper}
      style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}
    >
      <Droplets className="text-emerald-600 w-5 h-5" />
    </motion.div>
  ),
  waterLevel: (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className={iconWrapper}
      style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)' }}
    >
      <Waves className="text-sky-600 w-5 h-5" />
    </motion.div>
  ),
};

const ParameterSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    temperature: { min: 15, max: 35 },
    ph: { min: 6.0, max: 8.0 },
    humidity: { min: 40, max: 80 },
    waterLevel: { min: 20, max: 90 },
    isActive: true
  });

  const [editing, setEditing] = useState<ParameterField | null>(null);
  const [tempValues, setTempValues] = useState<{ min: string; max: string }>({ min: '', max: '' });

  const handleEditStart = (field: ParameterField) => {
    setEditing(field);
    setTempValues({
      min: settings[field].min.toString(),
      max: settings[field].max.toString()
    });
  };

  const handleEditCancel = () => setEditing(null);

  const handleEditSave = () => {
    if (!editing) return;

    const newMin = parseFloat(tempValues.min);
    const newMax = parseFloat(tempValues.max);

    if (isNaN(newMin) || isNaN(newMax)) {
      toast.error('Los valores deben ser números');
      return;
    }

    if (newMin >= newMax) {
      toast.error('El valor mínimo debe ser menor al máximo');
      return;
    }

    setSettings(prev => ({
      ...prev,
      [editing]: { min: newMin, max: newMax }
    }));

    toast.success('Configuración actualizada');
    setEditing(null);
  };

  const ParameterCard = ({
    title,
    field,
    unit
  }: {
    title: string;
    field: ParameterField;
    unit: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="w-full"
    >
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <Card className="p-5 shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            {icons[field]}
            <h2 className="text-lg font-semibold">{title} ({unit})</h2>
          </div>

          {editing === field ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Valor Mínimo</label>
                    <Input
                      type="number"
                      value={tempValues.min}
                      onChange={(e) => setTempValues({ ...tempValues, min: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Valor Máximo</label>
                    <Input
                      type="number"
                      value={tempValues.max}
                      onChange={(e) => setTempValues({ ...tempValues, max: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="light" onClick={handleEditCancel}>Cancelar</Button>
                  <Button onClick={handleEditSave}>Guardar</Button>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Valor Mínimo</p>
                  <p className="text-xl font-bold">{settings[field].min}{unit}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Valor Máximo</p>
                  <p className="text-xl font-bold">{settings[field].max}{unit}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 gap-1 mb-3">
                <CircleAlert className="w-4 h-4 text-gray-400" />
                Rango recomendado: {settings[field].min}{unit} – {settings[field].max}{unit}
              </div>
              <Button size="sm" variant="ghost" onClick={() => handleEditStart(field)}>
                Editar rango
              </Button>
            </>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-bold text-center text-[var(--text-color)]"
      >
        Configuración de Parámetros
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ParameterCard title="Temperatura" field="temperature" unit="°C" />
        <ParameterCard title="Humedad" field="humidity" unit="%" />
        <ParameterCard title="Nivel de pH" field="ph" unit="" />
        <ParameterCard title="Nivel de Agua" field="waterLevel" unit="%" />
      </div>

      <motion.div className="flex justify-center pt-4" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          size="lg"
          className="bg-[var(--green)] text-white"
          startContent={<Save className="w-5 h-5" />}
        >
          Guardar Configuración
        </Button>
      </motion.div>
    </div>
  );
};

export default ParameterSettings;
