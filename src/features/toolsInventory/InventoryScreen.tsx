import { SuudaiNavbar } from "../../components";
import ToolsTable from "./ToolsTable"

export default function InventoryScreen() { 
    return (
        <>
        <SuudaiNavbar />
        <h2>Inventario de Herramientas</h2>
        <ToolsTable />
        </>
    )
}