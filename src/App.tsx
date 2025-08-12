import { HospitalTable } from "./components/CustomizableTable"

export default function Home() {
  return (
    <div className="bg-gray-50 h-screen">
      <div className="container mx-auto py-8 px-4 w-full h-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">Sistema de Gerenciamento Hospitalar</h1>
          <p className="text-gray-600">Gerencie pacientes, leitos e recursos com facilidade</p>
        </div>
        <HospitalTable />
      </div>
    </div>
  )
}
