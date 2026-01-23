export interface Resource {
  id: number
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface CreateResourceDto {
  title: string
  description: string
}

export interface UpdateResourceDto {
  title?: string
  description?: string
}
