export interface HospitalData {
  id: string;
  patientName: string;
  patientId: string;
  admissionDate: string;
  dischargeDate?: string;
  department: string;
  doctor: string;
  roomNumber: string;
  status: 'Admitido' | 'Em Tratamento' | 'Alta' | 'Transferido' | 'Falecido';
  priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  diagnosis: string;
  treatment: string;
  insurance: string;
  cost: number;
  lastUpdate: string;
}

export interface ColumnConfig {
  key: keyof HospitalData;
  label: string;
  visible: boolean;
  sortable: boolean;
  width?: string;
  type: 'text' | 'number' | 'date' | 'status' | 'priority' | 'currency';
}
