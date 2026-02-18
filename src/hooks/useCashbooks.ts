import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export interface Cashbook {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  currency: string;
  balance: string;
  totalIncome: string;
  totalExpense: string;
  allowBackdate: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    members: number;
    entries: number;
  };
}

export const useCashbooks = (workspaceId?: string) => {
  const queryClient = useQueryClient();

  const cashbooksQuery = useQuery({
    queryKey: ['cashbooks', workspaceId],
    queryFn: async () => {
      if (!workspaceId || workspaceId === 'undefined' || workspaceId === 'null') return [];
      const response = await apiClient.get(`/cashbooks/workspace/${workspaceId}`);
      return response.data.data as Cashbook[];
    },
    enabled: !!workspaceId && workspaceId !== 'undefined' && workspaceId !== 'null',
  });

  const createCashbookMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!workspaceId) throw new Error('Workspace ID is required');
      const response = await apiClient.post(`/cashbooks/workspace/${workspaceId}`, { name });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashbooks', workspaceId] });
    },
  });

  const updateCashbookMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const response = await apiClient.patch(`/cashbooks/${id}`, { name });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashbooks', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['cashbook'] });
    },
  });

  const deleteCashbookMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/cashbooks/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashbooks', workspaceId] });
    },
  });

  const updateMemberRoleMutation = useMutation({
    mutationFn: async ({ id, userId, role }: { id: string; userId: string; role: string }) => {
      const response = await apiClient.patch(`/cashbooks/${id}/members/${userId}`, { role });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashbook-members'] });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const response = await apiClient.delete(`/cashbooks/${id}/members/${userId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashbook-members'] });
    },
  });

  return {
    cashbooks: cashbooksQuery.data || [],
    isLoading: cashbooksQuery.isLoading,
    error: cashbooksQuery.error,
    createCashbook: createCashbookMutation.mutate,
    isCreating: createCashbookMutation.isPending,
    updateCashbook: updateCashbookMutation.mutate,
    isUpdating: updateCashbookMutation.isPending,
    deleteCashbook: deleteCashbookMutation.mutate,
    isDeleting: deleteCashbookMutation.isPending,
    updateMemberRole: updateMemberRoleMutation.mutate,
    removeMember: removeMemberMutation.mutate,
  };
};

export const useCashbook = (cashbookId: string) => {
  return useQuery({
    queryKey: ['cashbook', cashbookId],
    queryFn: async () => {
      const response = await apiClient.get(`/cashbooks/${cashbookId}`);
      return response.data.data as Cashbook;
    },
    enabled: !!cashbookId,
  });
};

export const useCashbookMembers = (cashbookId: string) => {
  return useQuery({
    queryKey: ['cashbook-members', cashbookId],
    queryFn: async () => {
      const response = await apiClient.get(`/cashbooks/${cashbookId}/members`);
      return response.data.data;
    },
    enabled: !!cashbookId,
  });
};
