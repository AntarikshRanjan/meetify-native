import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppState } from '../../context/AppContext';

export default function PlaceScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { places, plans, openChat } = useAppState();
    const router = useRouter();

    const place = places.find(p => p.id === id);
    const placePlans = plans.filter(p => p.placeId === id);

    if (!place) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Place not found</Text>
            </View>
        );
    }

    const getActivityColor = (count: number) => {
        if (count > 15) return '#EF4444';
        if (count > 5) return '#F59E0B';
        return '#22C55E';
    };

    const getActivityLabel = (count: number) => {
        if (count > 15) return 'Buzzing';
        if (count > 5) return 'Moderate';
        return 'Quiet';
    };

    const handleJoinChat = () => {
        openChat(place.id);
        router.replace(`/chat/${place.id}`);
    };

    return (
        <View style={styles.container}>
            {/* Handle bar */}
            <View style={styles.handleBar} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{place.name}</Text>
                <Text style={styles.category}>{place.category}</Text>
            </View>

            {/* Activity */}
            <View style={styles.activityRow}>
                <View style={[styles.activityDot, { backgroundColor: getActivityColor(place.activeCount) }]} />
                <Text style={[styles.activityText, { color: getActivityColor(place.activeCount) }]}>
                    {place.activeCount} active now · {getActivityLabel(place.activeCount)}
                </Text>
            </View>

            {/* Plans */}
            <ScrollView style={styles.plansContainer}>
                <Text style={styles.sectionTitle}>Active Plans</Text>
                {placePlans.length === 0 ? (
                    <Text style={styles.noPlans}>No active plans</Text>
                ) : (
                    placePlans.map(plan => (
                        <View key={plan.id} style={styles.planCard}>
                            <Text style={styles.planTitle}>{plan.title}</Text>
                            <View style={styles.planDetails}>
                                <Text style={styles.planTime}>{plan.time}</Text>
                                <Text style={styles.planPeople}>
                                    {plan.currentPeople}/{plan.maxPeople} people
                                </Text>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Join Chat Button */}
            <TouchableOpacity style={styles.joinButton} onPress={handleJoinChat}>
                <Text style={styles.joinButtonText}>Join Chat</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 12,
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    header: {
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    category: {
        fontSize: 14,
        color: '#6B7280',
        textTransform: 'capitalize',
        marginTop: 4,
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 16,
    },
    activityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    activityText: {
        fontSize: 14,
        fontWeight: '500',
    },
    plansContainer: {
        flex: 1,
        paddingHorizontal: 24,
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 12,
    },
    noPlans: {
        color: '#6B7280',
        fontSize: 14,
    },
    planCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    planTitle: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
    planDetails: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
    },
    planTime: {
        color: '#9CA3AF',
        fontSize: 13,
    },
    planPeople: {
        color: '#9CA3AF',
        fontSize: 13,
    },
    joinButton: {
        backgroundColor: '#3B82F6',
        marginHorizontal: 24,
        marginBottom: 40,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    joinButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 20,
    },
    errorText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 100,
    },
});
