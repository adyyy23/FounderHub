import { supabase } from '@/lib/supabase';

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  last_message?: Message;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  last_read_at: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

export interface MessageInsert {
  conversation_id: string;
  content: string;
}

export interface ConversationWithDetails extends Conversation {
  participants: ConversationParticipant[];
  messages: Message[];
  unread_count: number;
}

export const messagingService = {
  async getConversations(): Promise<ConversationWithDetails[]> {
    const { data: participations, error } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) {
      throw error;
    }

    const conversationIds = participations?.map(p => p.conversation_id) || [];

    if (conversationIds.length === 0) {
      return [];
    }

    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select(`
        *,
        conversation_participants(*),
        messages(*)
      `)
      .in('id', conversationIds)
      .order('updated_at', { ascending: false });

    if (convError) {
      throw convError;
    }

    const userId = (await supabase.auth.getUser()).data.user?.id;

    return conversations?.map(conv => {
      const participants = conv.conversation_participants as ConversationParticipant[];
      const messages = (conv.messages as Message[]).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      const participations = participants.filter(p => p.user_id === userId);
      const lastReadAt = participations[0]?.last_read_at;

      const unread_count = messages.filter(
        m => m.sender_id !== userId && (!lastReadAt || new Date(m.created_at) > new Date(lastReadAt))
      ).length;

      const last_message = messages[0];

      return {
        ...conv,
        participants,
        messages,
        unread_count,
        last_message,
      };
    }) || [];
  },

  async getConversationById(id: string): Promise<ConversationWithDetails | null> {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        conversation_participants(*),
        messages(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) return null;

    const messages = (data.messages as Message[]).sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const participants = data.conversation_participants as ConversationParticipant[];

    return {
      ...data,
      participants,
      messages,
      unread_count: 0,
      last_message: messages[messages.length - 1],
    };
  },

  async createConversation(participants: string[]): Promise<ConversationWithDetails> {
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({})
      .select()
      .single();

    if (convError) {
      throw convError;
    }

    const participantInserts = participants.map(user_id => ({
      conversation_id: conversation.id,
      user_id,
    }));

    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (userId && !participants.includes(userId)) {
      participantInserts.push({ conversation_id: conversation.id, user_id: userId });
    }

    const { error: partError } = await supabase
      .from('conversation_participants')
      .insert(participantInserts);

    if (partError) {
      throw partError;
    }

    return {
      ...conversation,
      messages: [],
      unread_count: 0,
    };
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, content })
      .select()
      .single();

    if (error) {
      throw error;
    }

    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return data;
  },

  async markAsRead(conversationId: string): Promise<void> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;

    await supabase
      .from('conversation_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);
  },

  async getOrCreateDirectConversation(otherUserId: string): Promise<ConversationWithDetails> {
    if (!otherUserId) {
      throw new Error('Other user ID is required');
    }

    const conversations = await this.getConversations();

    const directConversation = conversations.find(conv => {
      const participants = conv.participants as ConversationParticipant[];
      return (
        participants.length === 2 &&
        participants.some(p => p.user_id === otherUserId)
      );
    });

    if (directConversation) {
      return directConversation;
    }

    return this.createConversation([otherUserId]);
  },

  async getUnreadCount(): Promise<number> {
    const conversations = await this.getConversations();
    return conversations.reduce((sum, conv) => sum + conv.unread_count, 0);
  },
};
