import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Place, Message, Plan, Post } from '../data/types';
import { MOCK_PLACES, MOCK_PLANS, MOCK_POSTS, MOCK_MESSAGES } from '../data/mock';

interface AppContextType {
    places: Place[];
    plans: Plan[];
    posts: Post[];
    messages: Record<string, Message[]>;
    selectedPlaceId: string | null;
    activeChatPlaceId: string | null;
    joinedPlaceIds: string[];
    selectPlace: (id: string | null) => void;
    openChat: (placeId: string) => void;
    closeChat: () => void;
    joinPlace: (placeId: string) => void;
    sendMessage: (placeId: string, content: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [places] = useState<Place[]>(MOCK_PLACES);
    const [plans] = useState<Plan[]>(MOCK_PLANS);
    const [posts] = useState<Post[]>(MOCK_POSTS);
    const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
    const [activeChatPlaceId, setActiveChatPlaceId] = useState<string | null>(null);
    const [joinedPlaceIds, setJoinedPlaceIds] = useState<string[]>([]);

    const selectPlace = (id: string | null) => {
        setSelectedPlaceId(id);
    };

    const openChat = (placeId: string) => {
        setActiveChatPlaceId(placeId);
        setSelectedPlaceId(null);
        if (!joinedPlaceIds.includes(placeId)) {
            setJoinedPlaceIds(prev => [...prev, placeId]);
        }
    };

    const closeChat = () => {
        setActiveChatPlaceId(null);
    };

    const joinPlace = (placeId: string) => {
        if (!joinedPlaceIds.includes(placeId)) {
            setJoinedPlaceIds(prev => [...prev, placeId]);
        }
    };

    const sendMessage = (placeId: string, content: string) => {
        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            placeId,
            senderId: 'me',
            senderName: 'You',
            content,
            timestamp: new Date(),
            type: 'text',
        };
        setMessages(prev => ({
            ...prev,
            [placeId]: [...(prev[placeId] || []), newMessage],
        }));
    };

    return (
        <AppContext.Provider
            value={{
                places,
                plans,
                posts,
                messages,
                selectedPlaceId,
                activeChatPlaceId,
                joinedPlaceIds,
                selectPlace,
                openChat,
                closeChat,
                joinPlace,
                sendMessage,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppState() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within an AppProvider');
    }
    return context;
}
