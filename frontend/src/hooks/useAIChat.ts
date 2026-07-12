import { useState } from 'react';
import api from '@/services/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UseAIChatOptions {
  moduleType: string;
  title: string;
  subject: string;
  initialMessage: string;
}

export function useAIChat({ moduleType, title, subject, initialMessage }: UseAIChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'initial',
    role: 'assistant',
    content: initialMessage,
    timestamp: new Date(),
  }]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string, hiddenContext?: string) => {
    if (!content.trim() && !hiddenContext) return;

    const displayContent = content || 'Analyzed code context.';

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: displayContent,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setError(null);

    try {
      let currentConvId = conversationId;
      if (!currentConvId) {
        const { data: newConv } = await api.post('/ai/conversations', {
          module_type: moduleType,
          title: title,
          subject: subject
        });
        currentConvId = newConv.id;
        setConversationId(newConv.id);
      }

      const apiContent = hiddenContext ? `${hiddenContext}\n\n${content}` : content;

      const { data: responseData } = await api.post(`/ai/conversations/${currentConvId}/messages`, {
        content: apiContent
      });

      const aiMsg: ChatMessage = {
        id: responseData.id || crypto.randomUUID(),
        role: 'assistant',
        content: responseData.content,
        timestamp: new Date(responseData.created_at || new Date()),
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("AI Error:", err);
      setError(err.message || "Failed to connect to AI");
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I'm sorry, but I encountered an error connecting to the backend API.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetChat = () => {
    setMessages([{
      id: crypto.randomUUID(),
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date(),
    }]);
    setConversationId(null);
    setError(null);
    setIsTyping(false);
  };

  return {
    messages,
    isTyping,
    error,
    sendMessage,
    resetChat,
    setMessages
  };
}
