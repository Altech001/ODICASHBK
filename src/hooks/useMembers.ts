import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export interface Member {
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface Invite {
  id: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export const useMembers = (workspaceId: string) => {
  const queryClient = useQueryClient();

  const membersQuery = useQuery({
    queryKey: ['members', workspaceId],
    queryFn: async () => {
      console.log(`🔍 Fetching members for workspace: ${workspaceId}`);
      if (!workspaceId || workspaceId === 'undefined' || workspaceId === 'null') {
        console.warn('⚠️ No valid workspaceId provided to useMembers');
        return [];
      }
      try {
        const response = await apiClient.get(`/workspaces/${workspaceId}/members`);
        console.log('✅ Members retrieved:', response.data.data);
        return response.data.data as Member[];
      } catch (error) {
        console.error('❌ Failed to fetch members:', error);
        throw error;
      }
    },
    enabled: !!workspaceId && workspaceId !== 'undefined' && workspaceId !== 'null',
  });

  const inviteMemberMutation = useMutation({
    mutationFn: async (data: { email: string; role: string }) => {
      console.log(`📩 Sending invitation to ${data.email} for workspace ${workspaceId}`);
      if (!workspaceId) throw new Error('Workspace ID is required');
      const response = await apiClient.post(`/workspaces/${workspaceId}/members`, data);
      console.log('✅ Invitation response:', response.data);
      return response.data;
    },
    onMutate: async (newInvitation) => {
      await queryClient.cancelQueries({ queryKey: ['members', workspaceId] });
      const previousMembers = queryClient.getQueryData<Member[]>(['members', workspaceId]);
      return { previousMembers };
    },
    onError: (err: any, newInvitation, context) => {
      console.error('❌ Invitation failed:', err.response?.data || err.message);
      if (context?.previousMembers) {
        queryClient.setQueryData(['members', workspaceId], context.previousMembers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['members', workspaceId] });
    },
  });

  return {
    members: membersQuery.data || [],
    isLoading: membersQuery.isLoading,
    inviteMember: inviteMemberMutation.mutate,
    isInviting: inviteMemberMutation.isPending,
  };
};
