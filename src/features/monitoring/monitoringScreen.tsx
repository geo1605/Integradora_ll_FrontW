
import {Card } from '@heroui/react'
import { SuudaiNavbar } from '../../components'
import Controls from './controls'
import ParameterSettings from './Parameters'

export default function MonitoringScreen() {
  return (
    <>
      <SuudaiNavbar />

      <div className="p-6">
        <h2 className="text-3xl font-bold text-green-700 mb-4">
          Monitoreo y Control
        </h2>

        <Card className="p-6 mb-6 shadow-md">
          <h3 className="text-xl font-semibold mb-2">Cámara</h3>
          <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
            Vista de la cámara (próximamente)
          </div>
        </Card>

        <h3 className="text-xl font-semibold mb-2">Controles</h3>

        <Controls />

        <ParameterSettings/>
      </div>
    </>
  );
}
