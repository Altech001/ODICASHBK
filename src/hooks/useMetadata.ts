import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE' | 'BOTH';
}

export interface PaymentMode {
  id: string;
  name: string;
}

export const useMetadata = (workspaceId: string) => {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ['categories', workspaceId],
    queryFn: async () => {
      if (!workspaceId || workspaceId === 'undefined' || workspaceId === 'null') return [];
      const response = await apiClient.get(`/categories/${workspaceId}`);
      return response.data.data as Category[];
    },
    enabled: !!workspaceId && workspaceId !== 'undefined' && workspaceId !== 'null',
  });

  const paymentModesQuery = useQuery({
    queryKey: ['payment-modes', workspaceId],
    queryFn: async () => {
      if (!workspaceId || workspaceId === 'undefined' || workspaceId === 'null') return [];
      const response = await apiClient.get(`/payment-modes/${workspaceId}`);
      return response.data.data as PaymentMode[];
    },
    enabled: !!workspaceId && workspaceId !== 'undefined' && workspaceId !== 'null',
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: { name: string; type: string }) => {
      const response = await apiClient.post(`/categories/${workspaceId}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', workspaceId] });
    },
  });

  const createPaymentModeMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await apiClient.post(`/payment-modes/${workspaceId}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-modes', workspaceId] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await apiClient.delete(`/categories/${workspaceId}/${categoryId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', workspaceId] });
    },
  });

  const deletePaymentModeMutation = useMutation({
    mutationFn: async (modeId: string) => {
      const response = await apiClient.delete(`/payment-modes/${workspaceId}/${modeId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-modes', workspaceId] });
    },
  });

  return {
    categories: categoriesQuery.data || [],
    paymentModes: paymentModesQuery.data || [],
    isLoading: categoriesQuery.isLoading || paymentModesQuery.isLoading,
    createCategory: createCategoryMutation.mutate,
    createPaymentMode: createPaymentModeMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    deletePaymentMode: deletePaymentModeMutation.mutate,
  };
};
