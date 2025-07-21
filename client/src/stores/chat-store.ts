import { create, StateCreator } from "zustand";

interface Message {
  senderId: string;
  message: string;
  timestamp: string;
  isSent: boolean;
}

interface Chat {
  recipientId: string;
  recipientName: string;
  lastMessage?: string;
}

interface Store {
  chats: Chat[];
  selectedChat: string | null; // recipientId of the selected chat
  messages: { [recipientId: string]: Message[] }; // Messages per recipient
  addChat: (recipientId: string, recipientName: string) => void;
  selectChat: (recipientId: string) => void;
  addMessage: (recipientId: string, message: Message) => void;
  updateLastMessage: (recipientId: string, message: string) => void;
}

const chatStore: StateCreator<Store> = (set) => ({
  chats: [],
  selectedChat: null,
  messages: {},
  addChat: (recipientId, recipientName) =>
    set((state) => {
      // Avoid duplicate chats
      if (state.chats.find((chat) => chat.recipientId === recipientId)) {
        return state;
      }
      return {
        chats: [...state.chats, { recipientId, recipientName }],
      };
    }),
  selectChat: (recipientId) => set({ selectedChat: recipientId }),
  addMessage: (recipientId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [recipientId]: [...(state.messages[recipientId] || []), message],
      },
    })),
  updateLastMessage: (recipientId, message) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.recipientId === recipientId
          ? { ...chat, lastMessage: message }
          : chat
      ),
    })),
});

const useChatStore = create(chatStore);

export default useChatStore;
