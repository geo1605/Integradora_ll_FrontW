
import {Card } from '@heroui/react'
import Controls from './controls'
import ParameterSettings from './Parameters'
import CameraImage from '../../components/camera';

export default function MonitoringScreen() {
  return (
    <>

      <div className="p-6">
        <h2 className="text-3xl font-bold text-green-700 mb-4">
          Monitoreo y Control
        </h2>

        <Card className=" shadow-md h-96">
          <CameraImage />
        </Card>

        <h3 className="text-xl font-semibold mb-2">Controles</h3>

        <Controls />

        <ParameterSettings/>
      </div>
    </>
  );
}
