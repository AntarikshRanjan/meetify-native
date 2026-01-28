import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Animated, Platform, useWindowDimensions } from 'react-native';
import React, { useRef, useEffect } from 'react';

// Simple icon component without emojis
function TabIconSymbol({ name, focused }: { name: string; focused: boolean }) {
    // Using simple text-based icons
    const getIcon = () => {
        switch (name) {
            case 'explore':
                return '◎';
            case 'social':
                return '◇';
            case 'inbox':
                return '◌';
            default:
                return '○';
        }
    };

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;
    const bgOpacityAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: focused ? 1 : 0.9,
                friction: 8,
                tension: 120,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: focused ? 1 : 0,
                duration: 180,
                useNativeDriver: true,
            }),
            Animated.timing(bgOpacityAnim, {
                toValue: focused ? 1 : 0,
                duration: 180,
                useNativeDriver: false,
            }),
        ]).start();
    }, [focused]);

    const backgroundColor = bgOpacityAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', 'rgba(59, 130, 246, 0.2)'],
    });

    return (
        <Animated.View
            style={[
                styles.tabIcon,
                {
                    transform: [{ scale: scaleAnim }],
                    backgroundColor,
                },
            ]}
        >
            <Text style={[
                styles.iconSymbol,
                { color: focused ? '#3B82F6' : '#6B7280' }
            ]}>
                {getIcon()}
            </Text>
            <Animated.Text
                style={[
                    styles.tabLabel,
                    { opacity: opacityAnim }
                ]}
            >
                {name}
            </Animated.Text>
        </Animated.View>
    );
}

export default function TabLayout() {
    const { width } = useWindowDimensions();

    // Responsive margins based on screen width
    const horizontalMargin = Math.max(16, Math.min(width * 0.1, 60));

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        left: horizontalMargin,
                        right: horizontalMargin,
                    }
                ],
                tabBarActiveTintColor: '#3B82F6',
                tabBarInactiveTintColor: '#6B7280',
                tabBarShowLabel: false,
                // Smooth tab transition
                ...(Platform.OS === 'web' ? {
                    // Add CSS transition for web
                } : {}),
            }}
        >
            <Tabs.Screen
                name="explore"
                options={{
                    tabBarIcon: ({ focused }) => <TabIconSymbol name="explore" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="social"
                options={{
                    tabBarIcon: ({ focused }) => <TabIconSymbol name="social" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="inbox"
                options={{
                    tabBarIcon: ({ focused }) => <TabIconSymbol name="inbox" focused={focused} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 20,
        height: 56,
        backgroundColor: 'rgba(18, 18, 22, 0.85)',
        borderRadius: 28,
        borderTopWidth: 0,
        paddingBottom: 0,
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        ...(Platform.OS === 'web' ? {
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            transition: 'all 0.3s ease',
        } : {}),
    },
    tabIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        ...(Platform.OS === 'web' ? {
            transition: 'all 0.2s ease',
        } : {}),
    },
    iconSymbol: {
        fontSize: 18,
        fontWeight: '300',
    },
    tabLabel: {
        color: '#3B82F6',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
        letterSpacing: 0.2,
    },
});
