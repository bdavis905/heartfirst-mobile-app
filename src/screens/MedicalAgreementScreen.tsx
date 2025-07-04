import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface MedicalAgreementScreenProps {
  onAccept: () => void;
  onClose: () => void;
}

export default function MedicalAgreementScreen({ onAccept, onClose }: MedicalAgreementScreenProps) {
  const insets = useSafeAreaInsets();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBottomReached, setIsBottomReached] = useState(false);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  
  const slideAnimation = useRef(new Animated.Value(300)).current;
  const backdropAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(0.8)).current;
  const checkmarkAnimation = useRef(new Animated.Value(0)).current;
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Modal entrance animation
    Animated.parallel([
      Animated.timing(backdropAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-enable button after 3 seconds for better UX
    const timer = setTimeout(() => {
      setIsBottomReached(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Enable button animation when bottom reached
    if (isBottomReached) {
      Animated.spring(buttonAnimation, {
        toValue: 1,
        damping: 0.8,
        useNativeDriver: true,
      }).start();
    }
  }, [isBottomReached]);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    
    // More reliable progress calculation
    const maxScroll = Math.max(0, contentSize.height - layoutMeasurement.height);
    const progress = maxScroll > 0 ? contentOffset.y / maxScroll : 1;
    setScrollProgress(Math.min(Math.max(progress, 0), 1));
    
    // Check if user reached bottom or content doesn't need scrolling
    if (progress >= 0.8 || maxScroll <= 10) {
      setIsBottomReached(true);
    }
  };

  const toggleSection = (index: number) => {
    setExpandedSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleAccept = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Success animation
    setShowSuccess(true);
    Animated.timing(checkmarkAnimation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        onAccept();
      }, 1000);
    });
  };

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const medicalPoints = [
    {
      title: "Not Medical Advice",
      content: "This application is for educational and informational purposes only. It does not provide medical advice, diagnosis, or treatment. The food analysis and nutritional information provided should not replace professional medical consultation.",
      icon: "information-circle-outline"
    },
    {
      title: "Consult Healthcare Professionals",
      content: "Before making any dietary changes, especially if you have heart disease, diabetes, high blood pressure, or other medical conditions, consult with your physician, registered dietitian, or other qualified healthcare provider.",
      icon: "medical-outline"
    },
    {
      title: "Individual Results Vary",
      content: "Dietary interventions affect individuals differently. Results may vary based on genetics, lifestyle, medical history, and adherence to recommendations. What works for one person may not be suitable for another.",
      icon: "people-outline"
    },
    {
      title: "Emergency Medical Situations",
      content: "If you experience chest pain, shortness of breath, severe headache, or other medical emergencies, seek immediate professional medical attention. Do not rely on this app for emergency medical guidance.",
      icon: "alert-circle-outline"
    },
    {
      title: "Food Analysis Limitations",
      content: "Food analysis results are based on available nutritional databases and may not be 100% accurate. Always read food labels and verify nutritional information independently.",
      icon: "search-outline"
    },
    {
      title: "Dr. Esselstyn's Protocol",
      content: "This app references Dr. Caldwell Esselstyn's plant-based nutrition approach. While supported by research, it represents one dietary strategy among many. Individual medical needs may require different approaches.",
      icon: "leaf-outline"
    }
  ];

  if (showSuccess) {
    return (
      <View className="flex-1 bg-black/50 items-center justify-center">
        <Animated.View
          style={{
            opacity: checkmarkAnimation,
            transform: [
              {
                scale: checkmarkAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
              },
            ],
          }}
          className="w-24 h-24 bg-success rounded-full items-center justify-center"
        >
          <Ionicons name="checkmark" size={48} color="#FFFFFF" />
        </Animated.View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Animated.View
        style={{
          opacity: backdropAnimation,
        }}
        className="absolute inset-0 bg-black/50"
      />
      
      <View className="flex-1 justify-center items-center px-4">
        <Animated.View
          style={{
            transform: [
              {
                translateY: slideAnimation,
              },
            ],
          }}
          className="bg-background-primary rounded-20dp w-full max-w-lg max-h-[90%] shadow-2xl"
        >
          {/* Header */}
          <View className="p-24dp border-b border-background-tertiary">
            <View className="flex-row items-center justify-between mb-4">
              <View className="w-12 h-12 bg-secondary-green-pale rounded-full items-center justify-center">
                <Ionicons name="medical" size={24} color="#16A085" />
              </View>
              <Pressable onPress={handleClose} className="w-10 h-10 items-center justify-center">
                <Ionicons name="close" size={24} color="#7F8C8D" />
              </Pressable>
            </View>
            <Text className="text-h1 font-semibold text-text-primary mb-2">
              Medical Disclaimer
            </Text>
            <Text className="text-body-regular text-text-secondary">
              Important information about using this health app
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="h-1 bg-background-tertiary">
            <View
              className="h-full bg-primary-green"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </View>

          {/* Content */}
          <ScrollView
            className="flex-1 px-20dp"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            <View className="py-24dp">
              <Text className="text-body-large text-text-secondary mb-24dp text-center">
                Please read and acknowledge the following medical disclaimer before using this application.
              </Text>

              {medicalPoints.map((point, index) => (
                <View key={index} className="mb-16dp">
                  <Pressable
                    onPress={() => toggleSection(index)}
                    className="flex-row items-start p-16dp bg-background-secondary rounded-12dp border border-background-tertiary"
                  >
                    <View className="w-10 h-10 bg-primary-green/10 rounded-full items-center justify-center mr-12dp mt-1">
                      <Ionicons name={point.icon as any} size={18} color="#16A085" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-h4 font-medium text-text-primary mb-1">
                        {point.title}
                      </Text>
                      <Text className="text-body-small text-text-secondary">
                        Tap to {expandedSections.includes(index) ? 'hide' : 'read'} details
                      </Text>
                    </View>
                    <Ionicons 
                      name={expandedSections.includes(index) ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#7F8C8D" 
                    />
                  </Pressable>
                  
                  {expandedSections.includes(index) && (
                    <View className="mt-8dp px-16dp py-12dp bg-background-primary rounded-8dp border-l-4 border-primary-green">
                      <Text className="text-body-regular text-text-secondary leading-relaxed">
                        {point.content}
                      </Text>
                    </View>
                  )}
                </View>
              ))}

              <View className="bg-gradient-to-r from-secondary-green-pale to-primary-green/10 rounded-16dp p-20dp mt-24dp">
                <View className="flex-row items-center mb-12dp">
                  <Ionicons name="heart" size={20} color="#16A085" />
                  <Text className="text-h4 font-semibold text-text-primary ml-8dp">
                    Your Health Journey
                  </Text>
                </View>
                <Text className="text-body-regular text-text-secondary leading-relaxed">
                  This app supports your wellness goals by providing educational information about heart-healthy food choices based on Dr. Esselstyn's plant-based approach. Use it as a helpful tool alongside professional medical guidance for optimal health outcomes.
                </Text>
              </View>

              <View className="h-32" />
            </View>
          </ScrollView>

          {/* Bottom Action */}
          <View className="p-24dp border-t border-background-tertiary">
            <Animated.View
              style={{
                opacity: buttonAnimation,
                transform: [
                  {
                    scale: buttonAnimation,
                  },
                ],
              }}
            >
              <Pressable
                onPress={handleAccept}
                disabled={!isBottomReached}
                className="rounded-full items-center justify-center flex-row"
                style={{
                  height: 56,
                  backgroundColor: isBottomReached ? '#16A085' : '#ECF0F1',
                  shadowColor: isBottomReached ? '#16A085' : 'transparent',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  elevation: isBottomReached ? 8 : 0,
                }}
              >
                <Ionicons 
                  name="checkmark-circle" 
                  size={20} 
                  color={isBottomReached ? '#FFFFFF' : '#95A5A6'}
                  style={{ marginRight: 8 }}
                />
                <Text 
                  className="font-semibold"
                  style={{
                    color: isBottomReached ? '#FFFFFF' : '#95A5A6',
                    fontSize: 17,
                    lineHeight: 24,
                    letterSpacing: 0.1,
                  }}
                >
                  I Acknowledge & Understand
                </Text>
              </Pressable>
            </Animated.View>
            
            {!isBottomReached && (
              <Text 
                className="text-center mt-3"
                style={{
                  color: '#95A5A6',
                  fontSize: 12,
                  lineHeight: 16,
                  letterSpacing: 0.2,
                }}
              >
                Please review the disclaimer above • Button activates automatically
              </Text>
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}