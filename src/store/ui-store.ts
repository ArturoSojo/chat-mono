import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UIState } from '@/types';

interface UIStore extends UIState {
  // Actions
  setCurrentUser: (userId: string) => void;
  setSelectedConversation: (conversationId: string | undefined) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: string) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveCall: (call: UIState['activeCall']) => void;
  clearActiveCall: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      // Initial state
      currentUserId: undefined,
      selectedConversationId: undefined,
      theme: 'light',
      language: 'es',
      sidebarCollapsed: false,
      activeCall: undefined,

      // Actions
      setCurrentUser: (userId) => set({ currentUserId: userId }),
      
      setSelectedConversation: (conversationId) => 
        set({ selectedConversationId: conversationId }),
      
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },
      
      setLanguage: (language) => set({ language }),
      
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      setActiveCall: (call) => set({ activeCall: call }),
      
      clearActiveCall: () => set({ activeCall: undefined }),
    }),
    {
      name: 'chat-ui-store',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);