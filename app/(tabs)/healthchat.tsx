import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import fetchAIResponse from '../../hooks/openai'; // Import the utility function

export default function HealthChatTab() {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'ai', text: 'Hello! I’m your AI doctor. Tell me about your symptoms.' },
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
  
    const newMessage = { id: `${Date.now()}`, sender: "user", text: userMessage.trim() };
    setMessages([...messages, newMessage]);
    setUserMessage("");
  
    try {
      setLoading(true);
  
      // Call Hugging Face API
      const aiResponse = await fetchAIResponse(userMessage);
  
      // Add AI response to messages
      const newAIMessage = { id: `${Date.now() + 1}`, sender: "ai", text: aiResponse };
      setMessages((prevMessages) => [...prevMessages, newAIMessage]);
    } catch (error) {
      console.error("Error handling AI response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: `${Date.now() + 2}`, sender: "ai", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  

  const renderMessage = ({ item }: { item: { id: string; sender: string; text: string } }) => {
    if (item.sender === 'ai') {
      return (
        <View style={styles.aiBubble}>
          <Image source={require('../../assets/images/AIRecom.png')} style={styles.aiImage} />
          <Text style={styles.aiText}>{item.text}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{item.text}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Chat Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Health Chat</Text>
        <Text style={styles.subtitle}>
          Chat with your AI assistant and discuss your symptoms.
        </Text>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
      />

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#999999"
          value={userMessage}
          onChangeText={setUserMessage}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>{loading ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDE8E8', // Soft pastel pink background
  },
  header: {
    padding: 20,
    backgroundColor: '#FFB6C1', // Light pink
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
  },
  subtitle: {
    fontSize: 14,
    color: '#FFE4E1', // Soft pastel text
    textAlign: 'center',
    marginTop: 5,
  },
  chatContainer: {
    padding: 20,
  },
  aiBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Ensure AI text aligns properly
    backgroundColor: '#FFFFFF', // White bubble
    padding: 15, // Add consistent padding
    borderRadius: 20,
    marginBottom: 15, // Add space between bubbles
    alignSelf: 'flex-start', // Align to the start for AI
    maxWidth: '90%', // Prevent bubble from being too wide
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3, // Add shadow for Android
  },
  
  aiImage: {
    width: 40,
    height: 40,
    marginRight: 10, // Space between the image and text
    resizeMode: 'contain',
    alignSelf: 'flex-start', // Align image with the top of the bubble
  },
  
  aiText: {
    fontSize: 16,
    lineHeight: 22, // Add line spacing for readability
    color: '#3D5A80', // Deep blue
    flexShrink: 1, // Allow text to wrap within the bubble
    flexGrow: 1, // Expand as needed
  },
  
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFC3A0', // Pastel orange-pink
    padding: 20, // Increase padding
    borderRadius: 20,
    marginBottom: 15, // Increase margin between bubbles
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3, // Shadow for Android
  },
  userText: {
    fontSize: 16,
    lineHeight: 22, // Better line spacing
    color: '#2C3E50', // Deep gray-blue
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC', // Light gray border
    backgroundColor: '#FFE4E1', // Pastel input background
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FFB6C1', // Light pink border
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#FFFFFF', // White input background
    color: '#333333', // Dark text color
  },
  sendButton: {
    backgroundColor: '#FF69B4', // Hot pink button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
});
