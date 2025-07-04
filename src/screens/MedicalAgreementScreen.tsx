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
    const progress = contentOffset.y / (contentSize.height - layoutMeasurement.height);
    setScrollProgress(Math.min(progress, 1));
    
    // Check if user reached bottom
    if (progress >= 0.95) {
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
      title: "Educational Purpose Only",
      content: "This app provides educational information about food choices and is not a substitute for professional medical advice, diagnosis, or treatment.",
      icon: "school-outline"
    },
    {
      title: "Consult Your Doctor",
      content: "Always consult with your healthcare provider before making significant dietary changes, especially if you have existing health conditions or take medications.",
      icon: "medical-outline"
    },
    {
      title: "Individual Results May Vary",
      content: "The effectiveness of dietary interventions can vary between individuals. What works for one person may not work for another.",
      icon: "people-outline"
    },
    {
      title: "Emergency Situations",
      content: "If you experience chest pain, shortness of breath, or other emergency symptoms, seek immediate medical attention. Do not rely on this app for emergency medical guidance.",
      icon: "alert-circle-outline"
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
      
      <View className="flex-1 justify-end">
        <Animated.View
          style={{
            transform: [
              {
                translateY: slideAnimation,
              },
            ],
          }}
          className="bg-background-primary rounded-t-16dp max-h-[85%]"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-20dp border-b border-background-tertiary">
            <View className="flex-1">
              <Text className="text-h2 font-semibold text-text-primary">
                Important Medical Information
              </Text>
            </View>
            <Pressable onPress={handleClose} className="w-8 h-8 items-center justify-center">
              <Ionicons name="close" size={24} color="#7F8C8D" />
            </Pressable>
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
            <View className="py-20dp">
              <Text className="text-body-large text-text-secondary mb-24dp">
                Please read and understand the following important information before using this application.
              </Text>

              {medicalPoints.map((point, index) => (
                <View key={index} className="mb-16dp">
                  <Pressable
                    onPress={() => toggleSection(index)}
                    className="flex-row items-center p-16dp bg-background-secondary rounded-12dp border border-info/20"
                  >
                    <View className="w-10 h-10 bg-info/10 rounded-full items-center justify-center mr-12dp">
                      <Ionicons name={point.icon as any} size={20} color="#3498DB" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-h4 font-medium text-text-primary">
                        {point.title}
                      </Text>
                    </View>
                    <Ionicons 
                      name={expandedSections.includes(index) ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#7F8C8D" 
                    />
                  </Pressable>
                  
                  {expandedSections.includes(index) && (
                    <View className="mt-8dp px-16dp">
                      <Text className="text-body-regular text-text-secondary leading-relaxed">
                        {point.content}
                      </Text>
                    </View>
                  )}
                </View>
              ))}

              <View className="bg-secondary-green-pale rounded-12dp p-16dp mt-24dp">
                <Text className="text-h4 font-medium text-text-primary mb-8dp">
                  Your Health Journey
                </Text>
                <Text className="text-body-regular text-text-secondary">
                  This app is designed to support your health goals by providing information about food choices that align with heart-healthy eating patterns. Use it as a tool to make informed decisions alongside professional medical guidance.
                </Text>
              </View>

              <View className="h-24" />
            </View>
          </ScrollView>

          {/* Bottom Action */}
          <View className="p-20dp border-t border-background-tertiary">
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
                className={`rounded-28dp h-56dp items-center justify-center ${
                  isBottomReached 
                    ? 'bg-primary-green' 
                    : 'bg-background-tertiary'
                }`}
                style={{
                  shadowColor: isBottomReached ? '#16A085' : 'transparent',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  elevation: isBottomReached ? 8 : 0,
                }}
              >
                <Text className={`text-button font-semibold ${
                  isBottomReached ? 'text-primary-white' : 'text-text-tertiary'
                }`}>
                  I Understand
                </Text>
              </Pressable>
            </Animated.View>
            
            {!isBottomReached && (
              <Text className="text-caption font-medium text-text-tertiary text-center mt-8dp">
                Scroll to the bottom to continue
              </Text>
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}