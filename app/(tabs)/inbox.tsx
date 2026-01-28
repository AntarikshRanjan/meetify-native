import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppState } from '../../context/AppContext';
import { useRouter } from 'expo-router';

export default function InboxScreen() {
    const { places, joinedPlaceIds, messages } = useAppState();
    const router = useRouter();

    const joinedPlaces = places.filter(p => joinedPlaceIds.includes(p.id));

    const getLastMessage = (placeId: string) => {
        const placeMessages = messages[placeId];
        if (!placeMessages || placeMessages.length === 0) return 'No messages yet';
        const last = placeMessages[placeMessages.length - 1];
        return last.content.substring(0, 50) + (last.content.length > 50 ? '...' : '');
    };

    const getActivityColor = (count: number) => {
        if (count > 15) return '#EF4444';
        if (count > 5) return '#F59E0B';
        return '#22C55E';
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Inbox</Text>
                <Text style={styles.subtitle}>Your joined chats</Text>
            </View>

            {joinedPlaces.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyIcon}>◌</Text>
                    <Text style={styles.emptyTitle}>No chats yet</Text>
                    <Text style={styles.emptyText}>
                        Join a place from the map to start chatting
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={joinedPlaces}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => router.push(`/chat/${item.id}`)}
                        >
                            <View style={[styles.avatar, { backgroundColor: getActivityColor(item.activeCount) }]}>
                                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.placeName}>{item.name}</Text>
                                <Text style={styles.lastMessage}>{getLastMessage(item.id)}</Text>
                            </View>
                            <View style={styles.badge}>
                                <Text style={[styles.badgeText, { color: getActivityColor(item.activeCount) }]}>
                                    {item.activeCount}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    list: {
        padding: 16,
        paddingBottom: 100,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    cardContent: {
        flex: 1,
        marginLeft: 12,
    },
    placeName: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    lastMessage: {
        color: '#6B7280',
        fontSize: 13,
        marginTop: 2,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
    },
    badgeText: {
        fontWeight: '600',
        fontSize: 13,
    },
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    emptyText: {
        color: '#6B7280',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
});
