import { Place, Plan, Post, Message } from './types';

export const MOCK_PLACES: Place[] = [
    {
        id: '1',
        name: 'Third Wave Coffee',
        category: 'cafe',
        latitude: 12.9716,
        longitude: 77.5946,
        activeCount: 12,
    },
    {
        id: '2',
        name: 'Toit Brewpub',
        category: 'bar',
        latitude: 12.9784,
        longitude: 77.6408,
        activeCount: 28,
    },
    {
        id: '3',
        name: 'Cubbon Park Yoga',
        category: 'park',
        latitude: 12.9763,
        longitude: 77.5929,
        activeCount: 5,
    },
    {
        id: '4',
        name: 'Rameshwaram Cafe',
        category: 'cafe',
        latitude: 12.9352,
        longitude: 77.6245,
        activeCount: 18,
    },
];

export const MOCK_PLANS: Plan[] = [
    {
        id: 'p1',
        placeId: '1',
        title: 'Morning Coffee Meetup',
        time: '9:00 AM',
        currentPeople: 4,
        maxPeople: 8,
    },
    {
        id: 'p2',
        placeId: '1',
        title: 'Work From Cafe Session',
        time: '2:00 PM',
        currentPeople: 6,
        maxPeople: 10,
    },
    {
        id: 'p3',
        placeId: '2',
        title: 'Friday Night Drinks',
        time: '7:00 PM',
        currentPeople: 12,
        maxPeople: 20,
    },
    {
        id: 'p4',
        placeId: '3',
        title: 'Sunrise Yoga Session',
        time: '6:00 AM',
        currentPeople: 3,
        maxPeople: 15,
    },
];

export const MOCK_POSTS: Post[] = [
    {
        id: 'post1',
        placeId: '2',
        placeName: 'Toit Brewpub',
        content: 'Happy hour starting now! 🍺 First drink on the house for new visitors.',
        timestamp: new Date(Date.now() - 1800000),
    },
    {
        id: 'post2',
        placeId: '1',
        placeName: 'Third Wave Coffee',
        content: 'New single-origin Ethiopian beans just arrived! ☕',
        timestamp: new Date(Date.now() - 3600000),
    },
    {
        id: 'post3',
        placeId: '3',
        placeName: 'Cubbon Park Yoga',
        content: 'Free meditation session tomorrow at 7 AM. All welcome! 🧘',
        timestamp: new Date(Date.now() - 7200000),
    },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
    '1': [
        { id: 'm1', placeId: '1', senderId: 'system', senderName: 'System', content: 'Welcome to Third Wave Coffee chat!', timestamp: new Date(Date.now() - 3600000), type: 'system' },
        { id: 'm2', placeId: '1', senderId: 'user1', senderName: 'Rahul', content: 'Anyone here for the morning meetup?', timestamp: new Date(Date.now() - 1800000), type: 'text' },
        { id: 'm3', placeId: '1', senderId: 'user2', senderName: 'Priya', content: 'Yes! I\'m near the window seat', timestamp: new Date(Date.now() - 900000), type: 'text' },
    ],
    '2': [
        { id: 'm4', placeId: '2', senderId: 'system', senderName: 'System', content: 'Welcome to Toit Brewpub chat!', timestamp: new Date(Date.now() - 7200000), type: 'system' },
        { id: 'm5', placeId: '2', senderId: 'user3', senderName: 'Amit', content: 'The wheat beer is amazing today!', timestamp: new Date(Date.now() - 3600000), type: 'text' },
    ],
};
