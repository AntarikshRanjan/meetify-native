import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppState } from '../../context/AppContext';

export default function ChatScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { places, messages, sendMessage } = useAppState();
    const router = useRouter();
    const [input, setInput] = useState('');

    const place = places.find(p => p.id === id);
    const chatMessages = messages[id || ''] || [];

    if (!place) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Chat not found</Text>
            </View>
        );
    }

    const handleSend = () => {
        if (input.trim() && id) {
            sendMessage(id, input.trim());
            setInput('');
        }
    };

    const renderMessage = ({ item }: { item: typeof chatMessages[0] }) => {
        const isMe = item.senderId === 'me';
        const isSystem = item.type === 'system';

        if (isSystem) {
            return (
                <View style={styles.systemMessage}>
                    <Text style={styles.systemText}>{item.content}</Text>
                </View>
            );
        }

        return (
            <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.otherMessage]}>
                {!isMe && <Text style={styles.senderName}>{item.senderName}</Text>}
                <Text style={[styles.messageText, isMe && styles.myMessageText]}>
                    {item.content}
                </Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>{place.name}</Text>
                    <Text style={styles.headerSub}>{place.activeCount} active now</Text>
                </View>
            </View>

            {/* Messages */}
            <FlatList
                data={chatMessages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.messagesList}
                inverted={false}
            />

            {/* Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type a message..."
                    placeholderTextColor="#6B7280"
                    multiline
                />
                <TouchableOpacity
                    style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={!input.trim()}
                >
                    <Text style={styles.sendButtonText}>→</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#121212',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backText: {
        color: 'white',
        fontSize: 20,
    },
    headerInfo: {
        marginLeft: 12,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    headerSub: {
        color: '#6B7280',
        fontSize: 13,
    },
    messagesList: {
        padding: 16,
        paddingBottom: 20,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#3B82F6',
        borderBottomRightRadius: 4,
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#1F2937',
        borderBottomLeftRadius: 4,
    },
    senderName: {
        color: '#9CA3AF',
        fontSize: 12,
        marginBottom: 4,
    },
    messageText: {
        color: '#E5E7EB',
        fontSize: 15,
    },
    myMessageText: {
        color: 'white',
    },
    systemMessage: {
        alignSelf: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    systemText: {
        color: '#6B7280',
        fontSize: 13,
        fontStyle: 'italic',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: 30,
        backgroundColor: '#121212',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    input: {
        flex: 1,
        backgroundColor: '#1F2937',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        color: 'white',
        fontSize: 15,
        maxHeight: 100,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    sendButtonDisabled: {
        backgroundColor: '#374151',
    },
    sendButtonText: {
        color: 'white',
        fontSize: 18,
    },
    errorText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 100,
    },
});
