import { useState, useMemo } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu"
import { Settings, Search, Eye, Download, Plus, MoreHorizontal, User, Activity, GripVertical } from "lucide-react"
import { hospitalData } from "../data/hospitalData"
import type { HospitalData } from "../types/hospital"
import { PatientDetailsModal } from "./PatientDetailsModal"

// Definição das colunas disponíveis
const availableColumns = [
  { key: "patientId", label: "ID", essential: true },
  { key: "patientName", label: "Nome do Paciente", essential: true },
  { key: "department", label: "Departamento", essential: true },
  { key: "doctor", label: "Médico Responsável", essential: false },
  { key: "roomNumber", label: "Quarto", essential: false },
  { key: "status", label: "Status", essential: true },
  { key: "priority", label: "Prioridade", essential: true },
  { key: "admissionDate", label: "Data Internação", essential: false },
  { key: "diagnosis", label: "Diagnóstico", essential: false },
  { key: "treatment", label: "Tratamento", essential: false },
  { key: "insurance", label: "Convênio", essential: false },
  { key: "cost", label: "Custo", essential: false },
  { key: "lastUpdate", label: "Última Atualização", essential: false },
]

export function HospitalTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [visibleColumns, setVisibleColumns] = useState(
    availableColumns
      .filter((col) => col.essential || ["doctor", "roomNumber", "admissionDate"].includes(col.key))
      .map((col) => col.key),
  )
  
  // Estado para ordem das colunas
  const [columnOrder, setColumnOrder] = useState<string[]>(
    availableColumns
      .filter((col) => col.essential || ["doctor", "roomNumber", "admissionDate"].includes(col.key))
      .map((col) => col.key)
  )

  // Estado para o modal de detalhes
  const [selectedPatient, setSelectedPatient] = useState<HospitalData | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Função para abrir o modal de detalhes
  const openPatientDetails = (patient: HospitalData) => {
    setSelectedPatient(patient)
    setIsDetailsModalOpen(true)
  }

  // Função para fechar o modal de detalhes
  const closePatientDetails = () => {
    setIsDetailsModalOpen(false)
    setSelectedPatient(null)
  }

  // Função para reordenar colunas
  const reorderColumns = (fromIndex: number, toIndex: number) => {
    const newOrder = [...columnOrder]
    const [removed] = newOrder.splice(fromIndex, 1)
    newOrder.splice(toIndex, 0, removed)
    setColumnOrder(newOrder)
  }

  // Função para sincronizar colunas visíveis com a ordem
//   const syncVisibleColumnsWithOrder = () => {
//     setVisibleColumns(columnOrder)
//   }

  // Filtros e busca
  const filteredPatients = useMemo(() => {
    return hospitalData.filter((patient) => {
      const matchesSearch =
        patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || patient.status === statusFilter
      const matchesDepartment = departmentFilter === "all" || patient.department === departmentFilter
      const matchesPriority = priorityFilter === "all" || patient.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesDepartment && matchesPriority
    })
  }, [searchTerm, statusFilter, departmentFilter, priorityFilter])

  // Opções únicas para filtros
  const departments = [...new Set(hospitalData.map((p) => p.department))]
  const statuses = [...new Set(hospitalData.map((p) => p.status))]
  const priorities = [...new Set(hospitalData.map((p) => p.priority))]

  const toggleColumn = (columnKey: string) => {
    const column = availableColumns.find((col) => col.key === columnKey)
    if (column?.essential) return // Não permite remover colunas essenciais

    setVisibleColumns((prev) =>
      prev.includes(columnKey) ? prev.filter((key) => key !== columnKey) : [...prev, columnKey],
    )
    
    // Sincronizar com a ordem das colunas
    if (visibleColumns.includes(columnKey)) {
      setColumnOrder(prev => prev.filter(key => key !== columnKey))
    } else {
      setColumnOrder(prev => [...prev, columnKey])
    }
  }

  const selectAllColumns = () => {
    setVisibleColumns(availableColumns.map(col => col.key))
    setColumnOrder(availableColumns.map(col => col.key))
  }

  const deselectAllColumns = () => {
    setVisibleColumns(availableColumns.filter(col => col.essential).map(col => col.key))
    setColumnOrder(availableColumns.filter(col => col.essential).map(col => col.key))
  }

  const resetToDefault = () => {
    const defaultColumns = availableColumns
      .filter((col) => col.essential || ["doctor", "roomNumber", "admissionDate"].includes(col.key))
      .map((col) => col.key)
    setVisibleColumns(defaultColumns)
    setColumnOrder(defaultColumns)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'Admitido': "bg-blue-100 text-blue-800",
      'Em Tratamento': "bg-orange-100 text-orange-800",
      'Alta': "bg-green-100 text-green-800",
      'Transferido': "bg-purple-100 text-purple-800",
      'Falecido': "bg-gray-100 text-gray-800",
    }
    return variants[status] || "bg-gray-100 text-gray-800"
  }

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      'Crítica': "bg-red-100 text-red-800",
      'Alta': "bg-orange-100 text-orange-800",
      'Média': "bg-yellow-100 text-yellow-800",
      'Baixa': "bg-green-100 text-green-800",
    }
    return variants[priority] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const renderCellContent = (patient: HospitalData, columnKey: string) => {
    switch (columnKey) {
      case "status":
        return <Badge className={getStatusBadge(patient.status)}>{patient.status}</Badge>
      case "priority":
        return <Badge className={getPriorityBadge(patient.priority)}>{patient.priority}</Badge>
      case "admissionDate":
        return formatDate(patient.admissionDate)
      case "lastUpdate":
        return formatDate(patient.lastUpdate)
      case "cost":
        return formatCurrency(patient.cost)
      case "patientName":
        return <div className="font-medium text-gray-900">{patient.patientName}</div>
      default:
        return patient[columnKey as keyof HospitalData]
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Gerenciamento de Pacientes
          </CardTitle>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-700 text-gray-900">
              <Plus className="h-4 w-4 mr-2" />
              Novo Paciente
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Controles de Busca e Filtros */}
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, ID ou diagnóstico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Departamento</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full text-xs">
                <SelectValue placeholder="Prioridade" className="text-xs" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="all">Prioridade</SelectItem>
                {priorities.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Menu de Customização de Colunas */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Settings className="h-4 w-4 mr-2" />
                  Colunas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Personalizar Colunas</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-1 text-xs text-gray-500 italic">
                  💡 Arraste os cabeçalhos da tabela para reordenar as colunas
                </div>
                <DropdownMenuSeparator />
                {availableColumns.map((column) => (
                  <DropdownMenuItem
                    key={column.key}
                    className="flex items-center space-x-2 cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault()
                      toggleColumn(column.key)
                    }}
                  >
                    <Checkbox
                      checked={visibleColumns.includes(column.key)}
                      onCheckedChange={() => toggleColumn(column.key)}
                      disabled={column.essential}
                      className="border-blue-300 flex items-center justify-center text-blue-600 data-[state=checked]:bg-blue-100 data-[state=checked]:border-blue-500"
                    />
                    <span className={column.essential ? "text-gray-500" : visibleColumns.includes(column.key) ? "text-blue-700 font-medium" : "text-gray-700"}>
                      {column.label}
                      {column.essential && " (obrigatório)"}
                    </span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <div className="p-2 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={visibleColumns.length === availableColumns.length ? deselectAllColumns : selectAllColumns}
                    className="w-full justify-start text-xs"
                  >
                    {visibleColumns.length === availableColumns.length ? (
                      <>
                        <Eye className="h-3 w-3 mr-2" />
                        Desmarcar Todas
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3 mr-2" />
                        Selecionar Todas
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetToDefault}
                    className="w-full justify-start text-xs"
                  >
                    <Settings className="h-3 w-3 mr-2" />
                    Padrão
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Indicadores */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{filteredPatients.length} pacientes</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{visibleColumns.length} colunas visíveis</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Tabela Desktop */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {columnOrder
                  .filter((colKey) => visibleColumns.includes(colKey))
                  .map((columnKey, index) => {
                    const column = availableColumns.find(col => col.key === columnKey)
                    return (
                      <th
                        key={columnKey}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-move hover:bg-gray-100 transition-colors"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', index.toString())
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault()
                          const fromIndex = parseInt(e.dataTransfer.getData('text/plain'))
                          const toIndex = index
                          if (fromIndex !== toIndex) {
                            reorderColumns(fromIndex, toIndex)
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-3 w-3 text-gray-400" />
                          {column?.label}
                        </div>
                      </th>
                    )
                  })}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  {columnOrder
                    .filter((colKey) => visibleColumns.includes(colKey))
                    .map((columnKey) => (
                      <td key={columnKey} className="px-6 py-4 whitespace-nowrap text-sm">
                        {renderCellContent(patient, columnKey)}
                      </td>
                    ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openPatientDetails(patient)}>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Histórico</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Dar Alta</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards Mobile */}
        <div className="lg:hidden space-y-4 p-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{patient.patientName}</h3>
                  <p className="text-sm text-gray-500">ID: {patient.patientId}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openPatientDetails(patient)}>Ver Detalhes</DropdownMenuItem>
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem>Histórico</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Departamento:</span>
                  <p className="font-medium">{patient.department}</p>
                </div>
                <div>
                  <span className="text-gray-500">Quarto:</span>
                  <p className="font-medium">{patient.roomNumber}</p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <div className="mt-1">
                    <Badge className={getStatusBadge(patient.status)}>{patient.status}</Badge>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Prioridade:</span>
                  <div className="mt-1">
                    <Badge className={getPriorityBadge(patient.priority)}>{patient.priority}</Badge>
                  </div>
                </div>
              </div>

              {visibleColumns.includes("doctor") && (
                <div className="mt-3 pt-3 border-t">
                  <span className="text-gray-500 text-sm">Médico:</span>
                  <p className="font-medium">{patient.doctor}</p>
                </div>
              )}
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum paciente encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou termo de busca</p>
          </div>
        )}
      </CardContent>

      {/* Modal de Detalhes */}
      {selectedPatient && (
        <PatientDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={closePatientDetails}
          patient={selectedPatient}
        />
      )}
    </Card>
  )
}
