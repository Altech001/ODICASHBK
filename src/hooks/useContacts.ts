import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

export const useContacts = (workspaceId: string) => {
  const queryClient = useQueryClient();

  const contactsQuery = useQuery({
    queryKey: ['contacts', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const response = await apiClient.get(`/contacts/${workspaceId}`);
      return response.data.data as Contact[];
    },
    enabled: !!workspaceId,
  });

  const createContactMutation = useMutation({
    mutationFn: async (data: { name: string; phone?: string; email?: string }) => {
      const response = await apiClient.post(`/contacts/${workspaceId}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', workspaceId] });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (contactId: string) => {
      const response = await apiClient.delete(`/contacts/${workspaceId}/${contactId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', workspaceId] });
    },
  });

  return {
    contacts: contactsQuery.data || [],
    isLoading: contactsQuery.isLoading,
    createContact: createContactMutation.mutate,
    isCreating: createContactMutation.isPending,
    deleteContact: deleteContactMutation.mutate,
    isDeleting: deleteContactMutation.isPending,
  };
};
