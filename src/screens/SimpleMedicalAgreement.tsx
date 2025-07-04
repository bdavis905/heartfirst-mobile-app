import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface SimpleMedicalAgreementProps {
  onAccept: () => void;
  onClose: () => void;
}

export default function SimpleMedicalAgreement({ onAccept, onClose }: SimpleMedicalAgreementProps) {
  const insets = useSafeAreaInsets();
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;
    if (isAtBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onAccept();
  };

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20
    }}>
      <View style={{
        backgroundColor: 'white',
        borderRadius: 20,
        width: '100%',
        maxWidth: 500,
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 20,
      }}>
        {/* Header */}
        <View style={{ 
          padding: 20, 
          borderBottomWidth: 1, 
          borderBottomColor: '#F3F4F6',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '600',
            color: '#2C3E50'
          }}>
            Medical Disclaimer
          </Text>
          <Pressable onPress={handleClose}>
            <Ionicons name="close" size={24} color="#7F8C8D" />
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1, padding: 20 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#E74C3C', marginBottom: 16 }}>
            IMPORTANT MEDICAL DISCLAIMER
          </Text>

          <Text style={{ fontSize: 14, lineHeight: 20, color: '#2C3E50', marginBottom: 16 }}>
            This application is for educational and informational purposes only. It does not provide medical advice, diagnosis, or treatment.
          </Text>

          <Text style={{ fontSize: 14, lineHeight: 20, color: '#2C3E50', marginBottom: 16 }}>
            Always consult your physician or other qualified healthcare provider before making any dietary changes, especially if you have heart disease, diabetes, high blood pressure, or other medical conditions.
          </Text>

          <Text style={{ fontSize: 14, lineHeight: 20, color: '#2C3E50', marginBottom: 16 }}>
            In case of medical emergencies (chest pain, shortness of breath, etc.), call 911 immediately. Do not rely on this app for emergency medical guidance.
          </Text>

          <Text style={{ fontSize: 14, lineHeight: 20, color: '#2C3E50', marginBottom: 16 }}>
            Food analysis results may not be 100% accurate. Always read food labels and verify nutritional information independently.
          </Text>

          <Text style={{ fontSize: 14, lineHeight: 20, color: '#2C3E50', marginBottom: 16 }}>
            Individual results may vary. This app references Dr. Esselstyn's plant-based approach, but individual medical needs may require different dietary strategies.
          </Text>

          <Text style={{ fontSize: 14, lineHeight: 20, color: '#2C3E50', marginBottom: 16 }}>
            This application has not been evaluated by the FDA and is not intended to diagnose, treat, cure, or prevent any disease.
          </Text>

          <View style={{
            backgroundColor: '#FFF3CD',
            padding: 16,
            borderRadius: 12,
            marginBottom: 20
          }}>
            <Text style={{ fontSize: 14, lineHeight: 20, color: '#856404', fontWeight: '500' }}>
              By using this application, you acknowledge that you have read and understood this disclaimer and agree to use the app at your own risk.
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Accept Button */}
        <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
          <Pressable
            onPress={handleAccept}
            disabled={!hasScrolledToBottom}
            style={{
              backgroundColor: hasScrolledToBottom ? '#16A085' : '#ECF0F1',
              height: 50,
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row'
            }}
          >
            <Ionicons 
              name="checkmark-circle" 
              size={20} 
              color={hasScrolledToBottom ? '#FFFFFF' : '#95A5A6'}
              style={{ marginRight: 8 }}
            />
            <Text style={{
              color: hasScrolledToBottom ? '#FFFFFF' : '#95A5A6',
              fontSize: 16,
              fontWeight: '600'
            }}>
              I Understand & Agree
            </Text>
          </Pressable>
          
          {!hasScrolledToBottom && (
            <Text style={{
              textAlign: 'center',
              marginTop: 8,
              color: '#95A5A6',
              fontSize: 12
            }}>
              Please scroll to the bottom to enable this button
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}