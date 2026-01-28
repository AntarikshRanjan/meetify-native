import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppState } from '../../context/AppContext';

export default function SocialScreen() {
    const { posts } = useAppState();

    const formatTime = (date: Date) => {
        const diff = Date.now() - date.getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Social</Text>
                <Text style={styles.subtitle}>Updates from places</Text>
            </View>

            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {item.placeName.charAt(0)}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.placeName}>{item.placeName}</Text>
                                <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
                            </View>
                        </View>
                        <Text style={styles.content}>{item.content}</Text>
                    </View>
                )}
            />
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
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    placeName: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
    },
    time: {
        color: '#6B7280',
        fontSize: 12,
    },
    content: {
        color: '#E5E7EB',
        fontSize: 15,
        lineHeight: 22,
    },
});
