import StatsSummary from "./StatsSummary";
import HistoryTable from "./HistoryTable";

export default function HistoryScreen() {
  return (
    <>
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold ">Registro de Datos</h1>
        <p className="text-sm ">Monitoreo continuo de condiciones ambientales</p>
      </div>
      <StatsSummary />
      <HistoryTable />
    </div>
    </>
  );
}