export type UserRole = 'super_admin' | 'employee' | 'client'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'
export type TaskPriority = 'Low' | 'Medium' | 'High'
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed'
export type RequestStatus = 'Submitted' | 'In Review' | 'Converted' | 'Declined'

export interface Profile {
  id: string
  name: string
  email: string
  role: UserRole
  is_active: boolean
  approval_status: ApprovalStatus
  created_at: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  assigned_employee_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  assigned_employee?: Pick<Profile, 'id' | 'name' | 'email'> | null
}

export interface MaintenanceRequest {
  id: string
  client_id: string
  title: string
  description: string | null
  status: RequestStatus
  created_at: string
  client?: Pick<Profile, 'id' | 'name' | 'email'> | null
  }
