import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../context/AppContext';
import { View, Platform } from 'react-native';

export default function RootLayout() {
    return (
        <AppProvider>
            <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
                <StatusBar style="light" />
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: '#0a0a0a' },
                        // Smoother animations
                        animation: Platform.OS === 'ios' ? 'default' : 'fade_from_bottom',
                        animationDuration: 250,
                    }}
                >
                    <Stack.Screen
                        name="(tabs)"
                        options={{
                            headerShown: false,
                            animation: 'fade',
                        }}
                    />
                    <Stack.Screen
                        name="place/[id]"
                        options={{
                            presentation: 'transparentModal',
                            animation: 'fade',
                            animationDuration: 200,
                        }}
                    />
                    <Stack.Screen
                        name="chat/[id]"
                        options={{
                            animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
                            animationDuration: 250,
                        }}
                    />
                </Stack>
            </View>
        </AppProvider>
    );
}
