import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { resourceApi } from '@/api/resource.api'
import type { CreateResourceDto, UpdateResourceDto } from '@/types/api/resource'

export const useResourceList = () => {
  return useQuery({
    queryKey: ['resources'],
    queryFn: resourceApi.getAll,
  })
}

export const useResource = (id: number) => {
  return useQuery({
    queryKey: ['resources', id],
    queryFn: () => resourceApi.getById(id),
    enabled: !!id,
  })
}

export const useCreateResource = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateResourceDto) => resourceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
    },
  })
}

export const useUpdateResource = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateResourceDto }) =>
      resourceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
    },
  })
}

export const useDeleteResource = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => resourceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
    },
  })
}
