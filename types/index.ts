export type UserRole = 'super_admin' | 'employee'
export type TaskPriority = 'Low' | 'Medium' | 'High'
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed'

export interface Profile {
  id: string
  name: string
  email: string
  role: UserRole
  is_active: boolean
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
