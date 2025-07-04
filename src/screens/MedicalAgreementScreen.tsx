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

  const handleScroll = async (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    
    // Calculate scroll progress
    const maxScroll = Math.max(0, contentSize.height - layoutMeasurement.height);
    const progress = maxScroll > 0 ? contentOffset.y / maxScroll : 1;
    setScrollProgress(Math.min(Math.max(progress, 0), 1));
    
    // User must scroll to at least 95% to enable button (or content doesn't need scrolling)
    if ((progress >= 0.95 || maxScroll <= 10) && !isBottomReached) {
      setIsBottomReached(true);
      // Haptic feedback when user reaches the bottom
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

  const medicalDisclaimer = `MEDICAL DISCLAIMER AND TERMS OF USE

IMPORTANT: READ CAREFULLY BEFORE USING THIS APPLICATION

1. NOT MEDICAL ADVICE
This application is for educational and informational purposes only. The content provided, including food analysis, nutritional information, and health-related recommendations, is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition.

2. NO DOCTOR-PATIENT RELATIONSHIP
Use of this application does not create a doctor-patient relationship between you and the app developers, Dr. Caldwell Esselstyn, or any healthcare provider. This app does not provide medical consultations or personalized medical advice.

3. CONSULT YOUR HEALTHCARE PROVIDER
Before making any dietary changes, especially if you have:
• Heart disease or cardiovascular conditions
• Diabetes or blood sugar disorders
• High blood pressure or hypertension
• Food allergies or intolerances
• Any chronic medical condition
• Take medications that may interact with dietary changes

Please consult with your physician, registered dietitian, or other qualified healthcare professional.

4. EMERGENCY MEDICAL SITUATIONS
If you experience any of the following symptoms, seek immediate emergency medical attention and do NOT rely on this app:
• Chest pain or pressure
• Shortness of breath or difficulty breathing
• Severe headache or dizziness
• Sudden weakness or numbness
• Loss of consciousness
• Severe allergic reactions

Call emergency services (911) immediately for any life-threatening situations.

5. INDIVIDUAL RESULTS VARY
Dietary interventions and lifestyle changes affect individuals differently. Results may vary significantly based on:
• Genetics and family history
• Current health status
• Lifestyle factors
• Adherence to recommendations
• Other medications or treatments
• Age, gender, and activity level

What works for one person may not be suitable or effective for another.

6. FOOD ANALYSIS LIMITATIONS
Food analysis results provided by this app are based on:
• Available nutritional databases
• Image recognition technology
• General food composition data

These results may not be 100% accurate and should not be relied upon for:
• Precise calorie counting for medical purposes
• Allergen detection for individuals with severe allergies
• Exact nutritional content for specific brands or preparations
• Medical dietary restrictions

Always read food labels and verify nutritional information independently.

7. DR. ESSELSTYN'S APPROACH
This app references Dr. Caldwell Esselstyn's plant-based nutrition approach for heart disease reversal. While this approach is supported by published research and clinical experience, it represents one dietary strategy among many. Individual medical needs may require different nutritional approaches.

8. NOT FDA APPROVED
This application has not been evaluated by the Food and Drug Administration (FDA). The recommendations and information provided are not intended to diagnose, treat, cure, or prevent any disease.

9. ASSUMPTION OF RISK
By using this application, you acknowledge and assume all risks associated with:
• Following dietary recommendations
• Making lifestyle changes
• Relying on app-generated information
• Any adverse effects from dietary modifications

10. LIMITATION OF LIABILITY
The developers, Dr. Esselstyn, and associated parties shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use this application.

11. ACCURACY OF INFORMATION
While we strive to provide accurate and up-to-date information, we cannot guarantee the completeness, accuracy, or reliability of all content. Nutritional science is constantly evolving, and recommendations may change based on new research.

12. CHILDREN AND SPECIAL POPULATIONS
This app is designed for healthy adults. Special consideration should be given to:
• Children and adolescents
• Pregnant or breastfeeding women
• Elderly individuals
• Individuals with eating disorders
• Those with compromised immune systems

These populations should always consult healthcare providers before making dietary changes.

13. SUPPLEMENT AND MEDICATION INTERACTIONS
Plant-based diets may affect the absorption and effectiveness of certain medications and supplements. Consult your healthcare provider about potential interactions, especially if you take:
• Blood thinners (warfarin, etc.)
• Diabetes medications
• Blood pressure medications
• Thyroid medications
• Any prescription medications

14. MONITORING AND FOLLOW-UP
If you have existing health conditions and choose to follow dietary recommendations from this app, regular monitoring by healthcare professionals is essential. This may include:
• Regular blood tests
• Blood pressure monitoring
• Weight and body composition tracking
• Symptom assessment

15. DISCONTINUATION
Stop using this app and consult a healthcare provider immediately if you experience:
• Unexpected weight loss or gain
• Persistent fatigue or weakness
• Digestive issues
• Any concerning symptoms
• Worsening of existing conditions

By continuing to use this application, you acknowledge that you have read, understood, and agree to be bound by this medical disclaimer and terms of use.

Remember: Your health is your responsibility. This app is a tool to support your wellness journey, but it should never replace professional medical care and guidance.

Last Updated: January 2025`;

  if (showSuccess) {
    return (
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center', justifyContent: 'center' }}>
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
            width: 96,
            height: 96,
            backgroundColor: '#16A085',
            borderRadius: 48,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Ionicons name="checkmark" size={48} color="#FFFFFF" />
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: backdropAnimation,
        }}
      />
      
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
        <Animated.View
          style={{
            transform: [{ translateY: slideAnimation }],
            backgroundColor: 'white',
            borderRadius: 20,
            width: '100%',
            maxWidth: 500,
            maxHeight: '90%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 20,
          }}
        >
          {/* Header */}
          <View style={{ 
            padding: 24, 
            borderBottomWidth: 1, 
            borderBottomColor: '#F3F4F6' 
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ 
                width: 48, 
                height: 48, 
                backgroundColor: '#E8F8F5', 
                borderRadius: 24, 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Ionicons name="medical" size={24} color="#16A085" />
              </View>
              <Pressable onPress={handleClose} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="close" size={24} color="#7F8C8D" />
              </Pressable>
            </View>
            <Text style={{
              fontSize: 24,
              lineHeight: 30,
              fontWeight: '600',
              color: '#2C3E50',
              marginBottom: 8
            }}>
              Medical Disclaimer
            </Text>
            <Text style={{
              fontSize: 14,
              lineHeight: 20,
              color: '#7F8C8D'
            }}>
              Important information about using this health app
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={{ height: 4, backgroundColor: '#F3F4F6' }}>
            <View
              style={{
                height: '100%',
                backgroundColor: '#16A085',
                width: `${scrollProgress * 100}%`,
                borderRadius: 2
              }}
            />
          </View>

          {/* Content */}
          <ScrollView
            style={{ 
              flex: 1, 
              paddingHorizontal: 24,
              height: 350
            }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={true}
          >
            <View style={{ paddingTop: 24, paddingBottom: 80 }}>
              <Text style={{
                fontSize: 16,
                lineHeight: 24,
                color: '#7F8C8D',
                marginBottom: 24,
                textAlign: 'center'
              }}>
                Please read the complete medical disclaimer below. The accept button will appear after you scroll to the bottom.
              </Text>

              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#2C3E50',
                textAlign: 'center',
                marginBottom: 16
              }}>
                MEDICAL DISCLAIMER AND TERMS OF USE
              </Text>
              
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#E74C3C',
                textAlign: 'center',
                marginBottom: 20
              }}>
                IMPORTANT: READ CAREFULLY BEFORE USING
              </Text>

              <Text style={{
                fontSize: 14,
                lineHeight: 20,
                color: '#2C3E50',
                marginBottom: 16
              }}>
                1. NOT MEDICAL ADVICE{'\n'}
                This application is for educational purposes only. It does not provide medical advice, diagnosis, or treatment. Always consult your physician before making dietary changes.
              </Text>

              <Text style={{
                fontSize: 14,
                lineHeight: 20,
                color: '#2C3E50',
                marginBottom: 16
              }}>
                2. EMERGENCY SITUATIONS{'\n'}
                If you experience chest pain, shortness of breath, or other medical emergencies, call 911 immediately. Do not rely on this app for emergency guidance.
              </Text>

              <Text style={{
                fontSize: 14,
                lineHeight: 20,
                color: '#2C3E50',
                marginBottom: 16
              }}>
                3. CONSULT HEALTHCARE PROVIDERS{'\n'}
                Before following any dietary recommendations, especially if you have heart disease, diabetes, high blood pressure, or take medications, consult your doctor or registered dietitian.
              </Text>

              <Text style={{
                fontSize: 14,
                lineHeight: 20,
                color: '#2C3E50',
                marginBottom: 16
              }}>
                4. INDIVIDUAL RESULTS VARY{'\n'}
                Dietary changes affect everyone differently based on genetics, health status, and lifestyle. What works for one person may not work for another.
              </Text>

              <Text style={{
                fontSize: 14,
                lineHeight: 20,
                color: '#2C3E50',
                marginBottom: 16
              }}>
                5. FOOD ANALYSIS LIMITATIONS{'\n'}
                Food analysis results may not be 100% accurate. Always read food labels and verify nutritional information independently, especially for allergies.
              </Text>

              <Text style={{
                fontSize: 14,
                lineHeight: 20,
                color: '#2C3E50',
                marginBottom: 16
              }}>
                6. DR. ESSELSTYN'S APPROACH{'\n'}
                This app references Dr. Esselstyn's plant-based nutrition approach. While research-supported, individual medical needs may require different approaches.
              </Text>

              <Text style={{
                fontSize: 14,
                lineHeight: 20,
                color: '#2C3E50',
                marginBottom: 16
              }}>
                7. NOT FDA APPROVED{'\n'}
                This application has not been evaluated by the FDA. It is not intended to diagnose, treat, cure, or prevent any disease.
              </Text>

              <Text style={{
                fontSize: 14,
                lineHeight: 20,
                color: '#2C3E50',
                marginBottom: 16
              }}>
                8. MEDICATION INTERACTIONS{'\n'}
                Plant-based diets may affect medication absorption. Consult your healthcare provider about potential interactions, especially with blood thinners, diabetes, or heart medications.
              </Text>

              <Text style={{
                fontSize: 14,
                lineHeight: 20,
                color: '#2C3E50',
                marginBottom: 16
              }}>
                9. SPECIAL POPULATIONS{'\n'}
                This app is designed for healthy adults. Children, pregnant women, elderly individuals, and those with eating disorders should consult healthcare providers first.
              </Text>

              <Text style={{
                fontSize: 14,
                lineHeight: 20,
                color: '#2C3E50',
                marginBottom: 16
              }}>
                10. ASSUMPTION OF RISK{'\n'}
                By using this application, you acknowledge and assume all risks associated with following dietary recommendations and making lifestyle changes.
              </Text>

              <Text style={{
                fontSize: 14,
                lineHeight: 20,
                color: '#2C3E50',
                marginBottom: 16
              }}>
                11. LIMITATION OF LIABILITY{'\n'}
                The developers and Dr. Esselstyn are not liable for any damages resulting from the use of this application.
              </Text>

              <Text style={{
                fontSize: 14,
                lineHeight: 20,
                color: '#2C3E50',
                marginBottom: 16
              }}>
                12. ACCURACY OF INFORMATION{'\n'}
                While we strive to provide accurate information, we cannot guarantee completeness or reliability. Nutritional science evolves, and recommendations may change.
              </Text>

              <View style={{
                backgroundColor: '#FFF3CD',
                padding: 16,
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: '#FFC107',
                marginBottom: 16
              }}>
                <Text style={{
                  fontSize: 14,
                  lineHeight: 20,
                  color: '#856404',
                  fontWeight: '500'
                }}>
                  By continuing to use this application, you acknowledge that you have read, understood, and agree to be bound by this medical disclaimer.{'\n\n'}
                  Remember: This app is a tool to support your wellness journey, but it should never replace professional medical care.
                </Text>
              </View>

              <Text style={{
                fontSize: 12,
                color: '#7F8C8D',
                textAlign: 'center',
                fontStyle: 'italic',
                marginBottom: 40
              }}>
                Last Updated: January 2025
              </Text>
            </View>
          </ScrollView>

          {/* Bottom Action */}
          <View style={{ 
            padding: 24, 
            borderTopWidth: 1, 
            borderTopColor: '#F3F4F6' 
          }}>
            <Animated.View
              style={{
                opacity: buttonAnimation,
                transform: [{ scale: buttonAnimation }],
              }}
            >
              <Pressable
                onPress={handleAccept}
                disabled={!isBottomReached}
                style={{
                  height: 56,
                  backgroundColor: isBottomReached ? '#16A085' : '#ECF0F1',
                  borderRadius: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
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
                <Text style={{
                  color: isBottomReached ? '#FFFFFF' : '#95A5A6',
                  fontSize: 17,
                  lineHeight: 24,
                  fontWeight: '600',
                  letterSpacing: 0.1,
                }}>
                  I Acknowledge & Understand
                </Text>
              </Pressable>
            </Animated.View>
            
            {!isBottomReached && (
              <Text style={{
                textAlign: 'center',
                marginTop: 12,
                color: '#95A5A6',
                fontSize: 12,
                lineHeight: 16,
                letterSpacing: 0.2,
              }}>
                Scroll to the bottom to enable the accept button
              </Text>
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}