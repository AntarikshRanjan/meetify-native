// Place type
export interface Place {
    id: string;
    name: string;
    category: string;
    latitude: number;
    longitude: number;
    activeCount: number;
}

// Plan type
export interface Plan {
    id: string;
    placeId: string;
    title: string;
    time: string;
    currentPeople: number;
    maxPeople: number;
}

// Message type
export interface Message {
    id: string;
    placeId: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: Date;
    type: 'text' | 'system';
}

// Post type (Social Feed)
export interface Post {
    id: string;
    placeId: string;
    placeName: string;
    content: string;
    timestamp: Date;
}
