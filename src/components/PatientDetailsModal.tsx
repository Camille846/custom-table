import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { User, Calendar, MapPin, Stethoscope, DollarSign } from "lucide-react"
import type { HospitalData } from "../types/hospital"

interface PatientDetailsModalProps {
  patient: HospitalData | null
  isOpen: boolean
  onClose: () => void
}

export function PatientDetailsModal({ patient, isOpen, onClose }: PatientDetailsModalProps) {
  if (!patient) return null

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
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <User className="h-6 w-6 text-blue-600" />
              Detalhes do Paciente
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-gray-600" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nome Completo</label>
                  <p className="text-lg font-semibold text-gray-900">{patient.patientName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">ID do Paciente</label>
                  <p className="text-lg font-mono text-gray-700">{patient.patientId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusBadge(patient.status)}>
                      {patient.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Prioridade</label>
                  <div className="mt-1">
                    <Badge className={getPriorityBadge(patient.priority)}>
                      {patient.priority}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Convênio</label>
                  <p className="text-gray-900">{patient.insurance}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Localização e Atendimento */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Localização e Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Departamento</label>
                  <p className="text-gray-900 font-medium">{patient.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Médico Responsável</label>
                  <p className="text-gray-900 font-medium">{patient.doctor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Número do Quarto</label>
                  <p className="text-gray-900 font-medium">{patient.roomNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datas e Prazos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Datas e Prazos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Data de Internação</label>
                  <p className="text-gray-900 font-medium">{formatDate(patient.admissionDate)}</p>
                </div>
                {patient.dischargeDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data de Alta</label>
                    <p className="text-gray-900 font-medium">{formatDate(patient.dischargeDate)}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Última Atualização</label>
                  <p className="text-gray-900 font-medium">{formatDate(patient.lastUpdate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diagnóstico e Tratamento */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-red-600" />
                Diagnóstico e Tratamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Diagnóstico</label>
                <p className="text-gray-900 font-medium">{patient.diagnosis}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Tratamento</label>
                <p className="text-gray-900 font-medium">{patient.treatment}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informações Financeiras */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Informações Financeiras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium text-gray-500">Custo Total</label>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(patient.cost)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
