import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  Modal, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Animated,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ChatModal({ visible, onClose }: ChatModalProps) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnimation = useRef(new Animated.Value(300)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  // System prompt for the AI
  const systemPrompt = `You are Dr. Plant, a knowledgeable and friendly AI assistant specializing in Dr. Caldwell Esselstyn's plant-based nutrition approach for heart disease reversal. 

Your role is to:
- Provide guidance on Dr. Esselstyn's whole food, plant-based (WFPB) diet
- Help users understand which foods are allowed and which should be avoided
- Answer questions about plant-based nutrition for heart health
- Offer practical tips for following the protocol
- Provide encouragement and support for lifestyle changes

Key principles of Dr. Esselstyn's approach:
- NO oil of any kind (including olive oil, coconut oil, etc.)
- NO nuts or seeds
- NO avocados
- NO refined sugars or processed foods
- Focus on whole grains, legumes, vegetables, and fruits
- Emphasize leafy green vegetables
- Goal of 6 servings of leafy greens daily

Always remind users to consult their healthcare provider before making major dietary changes. Be supportive, informative, and encouraging. Keep responses concise but helpful. If asked about medical conditions or symptoms, always recommend consulting a healthcare professional.`;

  useEffect(() => {
    if (visible) {
      // Add welcome message on first open
      if (messages.length === 0) {
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          text: "Hello! I'm Dr. Plant, your AI assistant for heart-healthy nutrition questions. I'm here to help you understand Dr. Esselstyn's plant-based approach. What would you like to know about?",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }

      // Animate in
      Animated.parallel([
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(opacityAnimation, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimation, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(msg => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.text
            })),
            { role: 'user', content: userMessage.text }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      if (data.choices && data.choices[0]) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.choices[0].message.content,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: opacityAnimation,
        }}
      >
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end', padding: 20 }}>
            <Animated.View
              style={{
                backgroundColor: 'white',
                borderRadius: 20,
                height: '75%',
                transform: [{ translateY: slideAnimation }],
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
                elevation: 20,
              }}
            >
              {/* Header */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: '#F3F4F6'
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#16A085',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12
                  }}>
                    <Ionicons name="leaf" size={20} color="white" />
                  </View>
                  <View>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: '#2C3E50'
                    }}>
                      Dr. Plant
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: '#7F8C8D'
                    }}>
                      Your AI Diet Assistant
                    </Text>
                  </View>
                </View>
                <Pressable onPress={handleClose}>
                  <Ionicons name="close" size={24} color="#7F8C8D" />
                </Pressable>
              </View>

              {/* Messages */}
              <ScrollView
                ref={scrollViewRef}
                style={{ flex: 1, padding: 20 }}
                showsVerticalScrollIndicator={false}
              >
                {messages.map((message) => (
                  <View
                    key={message.id}
                    style={{
                      alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                      marginBottom: 16,
                      maxWidth: '80%',
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: message.isUser ? '#16A085' : '#F8F9FA',
                        padding: 12,
                        borderRadius: 16,
                        borderBottomRightRadius: message.isUser ? 4 : 16,
                        borderBottomLeftRadius: message.isUser ? 16 : 4,
                      }}
                    >
                      <Text
                        style={{
                          color: message.isUser ? 'white' : '#2C3E50',
                          fontSize: 14,
                          lineHeight: 20,
                        }}
                      >
                        {message.text}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 10,
                        color: '#95A5A6',
                        marginTop: 4,
                        textAlign: message.isUser ? 'right' : 'left',
                      }}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                ))}
                
                {isLoading && (
                  <View style={{
                    alignSelf: 'flex-start',
                    marginBottom: 16,
                    maxWidth: '80%',
                  }}>
                    <View style={{
                      backgroundColor: '#F8F9FA',
                      padding: 12,
                      borderRadius: 16,
                      borderBottomLeftRadius: 4,
                    }}>
                      <Text style={{
                        color: '#95A5A6',
                        fontSize: 14,
                        fontStyle: 'italic',
                      }}>
                        Dr. Plant is typing...
                      </Text>
                    </View>
                  </View>
                )}
              </ScrollView>

              {/* Input */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 20,
                borderTopWidth: 1,
                borderTopColor: '#F3F4F6'
              }}>
                <TextInput
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 14,
                    maxHeight: 100,
                  }}
                  placeholder="Ask about heart-healthy foods..."
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  onSubmitEditing={sendMessage}
                  blurOnSubmit={false}
                />
                <Pressable
                  onPress={sendMessage}
                  disabled={!inputText.trim() || isLoading}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: inputText.trim() && !isLoading ? '#16A085' : '#E5E7EB',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 12,
                  }}
                >
                  <Ionicons 
                    name="send" 
                    size={20} 
                    color={inputText.trim() && !isLoading ? 'white' : '#95A5A6'} 
                  />
                </Pressable>
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}