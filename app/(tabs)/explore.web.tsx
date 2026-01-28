import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Platform,
    TouchableOpacity,
    TextInput,
    Animated,
    Pressable,
    Dimensions
} from 'react-native';
import { useAppState } from '../../context/AppContext';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Menu options
const menuItems = [
    { id: '1', icon: '○', label: 'Profile', description: 'View and edit your profile' },
    { id: '2', icon: '◎', label: 'Settings', description: 'App preferences' },
    { id: '3', icon: '◇', label: 'Notifications', description: 'Manage alerts' },
    { id: '4', icon: '□', label: 'Appearance', description: 'Theme & display' },
    { id: '5', icon: '◈', label: 'Privacy', description: 'Privacy settings' },
    { id: '6', icon: '?', label: 'Help & Support', description: 'Get help' },
    { id: '7', icon: 'i', label: 'About', description: 'App info' },
];

// Slide-out Menu Component
function SlideMenu({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.8)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 8,
                    tension: 65,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -SCREEN_WIDTH * 0.8,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
            </Animated.View>

            <Animated.View
                style={[
                    styles.menuContainer,
                    { transform: [{ translateX: slideAnim }] },
                ]}
            >
                <View style={styles.menuHeader}>
                    <View style={styles.userAvatar}>
                        <Text style={styles.avatarText}>M</Text>
                    </View>
                    <Text style={styles.menuTitle}>Welcome</Text>
                    <Text style={styles.menuSubtitle}>Meetify User</Text>
                </View>

                <View style={styles.menuItems}>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuItem}
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuItemIcon}>
                                <Text style={styles.menuIconText}>{item.icon}</Text>
                            </View>
                            <View style={styles.menuItemContent}>
                                <Text style={styles.menuItemLabel}>{item.label}</Text>
                                <Text style={styles.menuItemDescription}>{item.description}</Text>
                            </View>
                            <Text style={styles.menuItemArrow}>›</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.menuFooter}>
                    <TouchableOpacity style={styles.logoutButton} onPress={onClose}>
                        <Text style={styles.logoutIcon}>→</Text>
                        <Text style={styles.logoutText}>Sign Out</Text>
                    </TouchableOpacity>
                    <Text style={styles.versionText}>Meetify v1.0.0</Text>
                </View>
            </Animated.View>
        </View>
    );
}

// Leaflet Map Component for Web
function WebMapView({ places, onMarkerPress, getColor }: any) {
    const [MapComponents, setMapComponents] = useState<any>(null);

    useEffect(() => {
        // Inject Leaflet CSS
        if (typeof document !== 'undefined') {
            const linkId = 'leaflet-css';
            if (!document.getElementById(linkId)) {
                const link = document.createElement('link');
                link.id = linkId;
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }
        }

        // Dynamic import for react-leaflet
        Promise.all([
            import('react-leaflet'),
            import('leaflet'),
        ]).then(([reactLeaflet, L]) => {
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });
            setMapComponents({ ...reactLeaflet, L });
        });
    }, []);

    if (!MapComponents) {
        return (
            <View style={styles.mapLoading}>
                <Text style={styles.loadingText}>Loading map...</Text>
            </View>
        );
    }

    const { MapContainer, TileLayer, CircleMarker, Popup } = MapComponents;

    return (
        <View style={styles.webMapContainer}>
            <MapContainer
                center={[12.9716, 77.5946]}
                zoom={14}
                style={{ width: '100%', height: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {places.map((place: any) => (
                    <CircleMarker
                        key={place.id}
                        center={[place.latitude, place.longitude]}
                        radius={20}
                        pathOptions={{
                            color: getColor(place.activeCount),
                            fillColor: getColor(place.activeCount),
                            fillOpacity: 0.8,
                            weight: 3,
                        }}
                        eventHandlers={{
                            click: () => onMarkerPress(place.id),
                        }}
                    >
                        <Popup>
                            <div style={{ color: '#333', minWidth: 150 }}>
                                <strong>{place.name}</strong>
                                <br />
                                <span style={{ color: '#666' }}>{place.category}</span>
                                <br />
                                <span style={{ color: getColor(place.activeCount) }}>
                                    {place.activeCount} active
                                </span>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </View>
    );
}

export default function ExploreScreen() {
    const { places } = useAppState();
    const router = useRouter();
    const [menuVisible, setMenuVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPlaces = places.filter(place =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getColor = (count: number) => {
        if (count > 15) return '#EF4444';
        if (count > 5) return '#F59E0B';
        return '#22C55E';
    };

    const handleMarkerPress = (placeId: string) => {
        router.push(`/place/${placeId}`);
    };

    return (
        <View style={styles.container}>
            <WebMapView
                places={filteredPlaces}
                onMarkerPress={handleMarkerPress}
                getColor={getColor}
            />

            {/* Glass Header Overlay */}
            <View style={styles.headerOverlay}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => setMenuVisible(true)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.menuButtonText}>☰</Text>
                </TouchableOpacity>

                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>○</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search places..."
                        placeholderTextColor="#6B7280"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Text style={styles.clearIcon}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Legend */}
            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
                    <Text style={styles.legendText}>Low</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.legendText}>Medium</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                    <Text style={styles.legendText}>High</Text>
                </View>
            </View>

            <SlideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    webMapContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    mapLoading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
    },
    loadingText: {
        color: '#6B7280',
        fontSize: 16,
    },
    headerOverlay: {
        position: 'absolute',
        top: 50,
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(20, 20, 25, 0.85)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
    } as any,
    menuButtonText: {
        color: 'white',
        fontSize: 18,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(20, 20, 25, 0.85)',
        borderRadius: 22,
        paddingHorizontal: 16,
        height: 44,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
    } as any,
    searchIcon: {
        color: '#6B7280',
        fontSize: 14,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        fontSize: 15,
        outlineStyle: 'none',
    } as any,
    clearIcon: {
        color: '#6B7280',
        fontSize: 14,
        padding: 4,
    },
    legendContainer: {
        position: 'absolute',
        bottom: 100,
        right: 16,
        backgroundColor: 'rgba(20, 20, 25, 0.85)',
        borderRadius: 12,
        padding: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
    } as any,
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendText: {
        color: '#9CA3AF',
        fontSize: 12,
    },
    // Slide Menu Styles
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    menuContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: SCREEN_WIDTH * 0.8,
        maxWidth: 320,
        backgroundColor: 'rgba(17, 17, 17, 0.95)',
        borderRightWidth: 1,
        borderRightColor: 'rgba(59, 130, 246, 0.2)',
        backdropFilter: 'blur(20px)',
    } as any,
    menuHeader: {
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    userAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 2,
        borderColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3B82F6',
    },
    menuTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    menuSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    menuItems: {
        flex: 1,
        paddingTop: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
    },
    menuItemIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuIconText: {
        fontSize: 18,
        color: '#9CA3AF',
        fontWeight: '300',
    },
    menuItemContent: {
        flex: 1,
        marginLeft: 14,
    },
    menuItemLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    menuItemDescription: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    menuItemArrow: {
        fontSize: 22,
        color: '#4B5563',
    },
    menuFooter: {
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
    },
    logoutIcon: {
        fontSize: 20,
        color: '#EF4444',
    },
    logoutText: {
        fontSize: 16,
        color: '#EF4444',
        fontWeight: '600',
    },
    versionText: {
        color: '#4B5563',
        fontSize: 12,
        marginTop: 12,
    },
});
