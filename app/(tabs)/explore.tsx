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
import MapView, { Marker, Circle } from 'react-native-maps';
import { useAppState } from '../../context/AppContext';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Dark map style for native
const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#1d1d1d' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
];

// Menu options - using minimal symbols instead of emojis
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
            {/* Backdrop */}
            <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
            </Animated.View>

            {/* Menu */}
            <Animated.View
                style={[
                    styles.menuContainer,
                    { transform: [{ translateX: slideAnim }] },
                ]}
            >
                {/* Menu Header */}
                <View style={styles.menuHeader}>
                    <View style={styles.userAvatar}>
                        <Text style={styles.avatarText}>M</Text>
                    </View>
                    <Text style={styles.menuTitle}>Welcome</Text>
                    <Text style={styles.menuSubtitle}>Meetify User</Text>
                </View>

                {/* Menu Items */}
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

                {/* Menu Footer */}
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

// Leaflet Map for Web
function WebMapView({ places, onMarkerPress, getColor }: any) {
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
    }, []);

    // Dynamic import for react-leaflet (only on web)
    const [MapComponents, setMapComponents] = useState<any>(null);

    useEffect(() => {
        if (Platform.OS === 'web') {
            Promise.all([
                import('react-leaflet'),
                import('leaflet'),
            ]).then(([reactLeaflet, L]) => {
                // Fix default marker icon
                delete (L.Icon.Default.prototype as any)._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                });
                setMapComponents({ ...reactLeaflet, L });
            });
        }
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
                {/* Dark map tiles */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {/* Place markers */}
                {places.map((place: any) => (
                    <CircleMarker
                        key={place.id}
                        center={[place.latitude, place.longitude]}
                        radius={15 + place.activeCount * 0.5}
                        pathOptions={{
                            color: getColor(place.activeCount),
                            fillColor: getColor(place.activeCount),
                            fillOpacity: 0.7,
                            weight: 2,
                        }}
                        eventHandlers={{
                            click: () => onMarkerPress(place.id),
                        }}
                    >
                        <Popup>
                            <div style={{ textAlign: 'center', padding: '4px' }}>
                                <strong style={{ fontSize: '14px' }}>{place.name}</strong>
                                <br />
                                <span style={{ color: '#666', fontSize: '12px' }}>{place.category}</span>
                                <br />
                                <span style={{
                                    color: getColor(place.activeCount),
                                    fontWeight: 'bold',
                                    fontSize: '14px'
                                }}>
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

    const getColor = (count: number) => {
        if (count > 15) return '#EF4444'; // Red
        if (count > 5) return '#F59E0B';  // Yellow
        return '#22C55E'; // Green
    };

    const handleMarkerPress = (placeId: string) => {
        router.push(`/place/${placeId}`);
    };

    const filteredPlaces = places.filter(place =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Web version - Full screen Leaflet map
    if (Platform.OS === 'web') {
        return (
            <View style={styles.container}>
                {/* Full screen map */}
                <WebMapView
                    places={filteredPlaces}
                    onMarkerPress={handleMarkerPress}
                    getColor={getColor}
                />

                {/* Glass Header Overlay */}
                <View style={styles.headerOverlay}>
                    {/* Menu Button */}
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => setMenuVisible(true)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.menuButtonText}>☰</Text>
                    </TouchableOpacity>

                    {/* Search Bar */}
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

                {/* Slide Menu */}
                <SlideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
            </View>
        );
    }

    // Native version - react-native-maps
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 12.9716,
                    longitude: 77.5946,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                customMapStyle={darkMapStyle}
            >
                {filteredPlaces.map((place) => (
                    <React.Fragment key={place.id}>
                        <Circle
                            center={{ latitude: place.latitude, longitude: place.longitude }}
                            radius={100 + place.activeCount * 5}
                            fillColor={`${getColor(place.activeCount)}33`}
                            strokeWidth={0}
                        />
                        <Marker
                            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                            onPress={() => handleMarkerPress(place.id)}
                        >
                            <View style={[styles.marker, { backgroundColor: getColor(place.activeCount) }]}>
                                <Text style={styles.markerText}>{place.activeCount}</Text>
                            </View>
                        </Marker>
                    </React.Fragment>
                ))}
            </MapView>

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

            <SlideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    map: {
        flex: 1,
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
    marker: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    markerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    // Glass Header Overlay
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 12,
    },
    menuButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(20, 20, 25, 0.75)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        ...(Platform.OS === 'web' ? {
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
        } : {}),
    },
    menuButtonText: {
        color: 'white',
        fontSize: 20,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(20, 20, 25, 0.75)',
        borderRadius: 24,
        paddingHorizontal: 16,
        height: 48,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        gap: 10,
        ...(Platform.OS === 'web' ? {
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
        } : {}),
    },
    searchIcon: {
        fontSize: 16,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        fontSize: 15,
        ...(Platform.OS === 'web' ? {
            outlineStyle: 'none',
        } : {}),
    },
    clearIcon: {
        color: '#6B7280',
        fontSize: 14,
        padding: 4,
    },
    // Legend
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
        ...(Platform.OS === 'web' ? {
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
        } : {}),
    },
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
        ...(Platform.OS === 'web' ? {
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
        } : {}),
    },
    menuHeader: {
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
    },
    userAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#3B82F6',
    },
    avatarText: {
        fontSize: 28,
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
    },
    logoutText: {
        fontSize: 16,
        color: '#EF4444',
        fontWeight: '600',
    },
    versionText: {
        fontSize: 12,
        color: '#4B5563',
        marginTop: 12,
        textAlign: 'center',
    },
});
