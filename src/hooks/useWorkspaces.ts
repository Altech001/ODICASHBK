import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export interface Workspace {
  id: string;
  name: string;
  type: 'PERSONAL' | 'BUSINESS';
  ownerId: string;
  owner?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useWorkspaces = () => {
  const queryClient = useQueryClient();

  const workspacesQuery = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await apiClient.get('/workspaces');
      const data = response.data.data;
      // Backend returns categorized workspaces: { owned: Workspace[], member: Workspace[] }
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const all = [...(data.owned || []), ...(data.member || [])] as Workspace[];
        // Filter out duplicates by ID
        const unique = Array.from(new Map(all.map(item => [item.id, item])).values());
        return unique;
      }
      return (data || []) as Workspace[];
    },
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiClient.post('/workspaces', { name, type: 'BUSINESS' });
      return response.data.data as Workspace;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });

  const updateWorkspaceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Workspace> }) => {
      const response = await apiClient.patch(`/workspaces/${id}`, data);
      return response.data.data as Workspace;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });

  const deleteWorkspaceMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/workspaces/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });

  return {
    workspaces: workspacesQuery.data || [],
    isLoading: workspacesQuery.isLoading,
    error: workspacesQuery.error,
    createWorkspace: createWorkspaceMutation.mutate,
    isCreating: createWorkspaceMutation.isPending,
    updateWorkspace: updateWorkspaceMutation.mutate,
    isUpdating: updateWorkspaceMutation.isPending,
    deleteWorkspace: deleteWorkspaceMutation.mutate,
    isDeleting: deleteWorkspaceMutation.isPending,
  };
};
