import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export interface Entry {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: string;
  description: string;
  entryDate: string;
  createdAt: string;
  createdBy: {
    firstName: string;
    lastName: string;
  };
  category?: { name: string };
  contact?: { name: string };
  paymentMode?: { name: string };
}

export const useEntries = (cashbookId: string) => {
  const queryClient = useQueryClient();

  const entriesQuery = useQuery({
    queryKey: ['entries', cashbookId],
    queryFn: async () => {
      const response = await apiClient.get(`/entries/cashbook/${cashbookId}`);
      return response.data.data as Entry[];
    },
    enabled: !!cashbookId,
  });

  const createEntryMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post(`/entries/cashbook/${cashbookId}`, data);
      return response.data.data;
    },
    onMutate: async (newEntry) => {
      await queryClient.cancelQueries({ queryKey: ['entries', cashbookId] });
      const previousEntries = queryClient.getQueryData(['entries', cashbookId]);
      
      queryClient.setQueryData(['entries', cashbookId], (old: Entry[] | undefined) => {
        const optimisticEntry: Entry = {
          id: Math.random().toString(),
          ...newEntry,
          createdAt: new Date().toISOString(),
          createdBy: { firstName: 'You', lastName: '' },
          amount: newEntry.amount.toString(),
        };
        return [optimisticEntry, ...(old || [])];
      });

      return { previousEntries };
    },
    onError: (err, newEntry, context) => {
      queryClient.setQueryData(['entries', cashbookId], context?.previousEntries);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['entries', cashbookId] });
      queryClient.invalidateQueries({ queryKey: ['cashbook', cashbookId] });
    },
  });

  return {
    entries: entriesQuery.data || [],
    isLoading: entriesQuery.isLoading,
    createEntry: createEntryMutation.mutate,
    isCreating: createEntryMutation.isPending,
  };
};
