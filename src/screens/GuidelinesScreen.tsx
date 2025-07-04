import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface GuidelinesScreenProps {
  navigation?: {
    goBack: () => void;
  };
}

export default function GuidelinesScreen({ navigation }: GuidelinesScreenProps) {
  const insets = useSafeAreaInsets();

  const guidelines = [
    {
      category: "Foods to AVOID",
      icon: "close-circle",
      color: "#E74C3C",
      backgroundColor: "#E74C3C10",
      items: [
        "All oils (including olive oil, coconut oil, etc.)",
        "Dairy products (milk, cheese, yogurt, butter)",
        "Meat (beef, pork, poultry, fish, seafood)",
        "Nuts and seeds",
        "Avocados and olives",
        "Refined sugars and processed foods",
        "Caffeine and alcohol"
      ]
    },
    {
      category: "Foods to ENJOY",
      icon: "checkmark-circle",
      color: "#2ECC71",
      backgroundColor: "#2ECC7110",
      items: [
        "Leafy greens (kale, spinach, arugula, lettuce)",
        "Cruciferous vegetables (broccoli, cauliflower, Brussels sprouts)",
        "Root vegetables (sweet potatoes, carrots, beets)",
        "Whole grains (brown rice, quinoa, oats, whole wheat)",
        "Legumes (beans, lentils, chickpeas, peas)",
        "Fresh fruits (berries, apples, oranges, bananas)",
        "Herbs and spices (turmeric, ginger, garlic, herbs)"
      ]
    },
    {
      category: "Daily Targets",
      icon: "target",
      color: "#3498DB",
      backgroundColor: "#3498DB10",
      items: [
        "6 servings of leafy greens throughout the day",
        "Start with greens first thing in the morning",
        "End with greens before bedtime",
        "Space servings evenly throughout the day",
        "Focus on variety in your green choices",
        "Aim for 1-2 cups of greens per serving",
        "Make greens the foundation of every meal"
      ]
    },
    {
      category: "Key Principles",
      icon: "heart",
      color: "#16A085",
      backgroundColor: "#16A08510",
      items: [
        "Whole food, plant-based nutrition only",
        "No added oils or processed foods",
        "Maximize nutrient density",
        "Prioritize leafy greens above all",
        "Eat to reverse arterial damage",
        "Focus on long-term heart health",
        "Consistency is key to success"
      ]
    }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <View style={{ 
        paddingTop: insets.top, 
        backgroundColor: 'white', 
        borderBottomWidth: 1, 
        borderBottomColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          paddingHorizontal: 24, 
          paddingVertical: 20 
        }}>
          {navigation && (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.goBack();
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.6 : 1,
                marginRight: 16,
                padding: 8,
                marginLeft: -8,
              })}
            >
              <Ionicons name="chevron-back" size={24} color="#16A085" />
            </Pressable>
          )}
          
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text
              style={{
                color: '#2C3E50',
                fontSize: 28,
                lineHeight: 34,
                letterSpacing: -0.3,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Dr. Esselstyn's Guidelines
            </Text>
            <Text
              style={{
                color: '#7F8C8D',
                fontSize: 15,
                lineHeight: 22,
                textAlign: 'center',
                marginTop: 8,
              }}
            >
              Heart Disease Reversal Protocol
            </Text>
          </View>
          
          {/* Spacer to balance the back button */}
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 24 }}>
        {/* Introduction */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
                backgroundColor: '#16A08515',
              }}
            >
              <Ionicons name="information-circle" size={24} color="#16A085" />
            </View>
            <Text
              style={{
                color: '#2C3E50',
                fontSize: 18,
                lineHeight: 24,
                letterSpacing: -0.1,
                fontWeight: '600',
                flex: 1,
              }}
            >
              About This Protocol
            </Text>
          </View>
          <Text
            style={{
              color: '#7F8C8D',
              fontSize: 15,
              lineHeight: 22,
              marginBottom: 16,
            }}
          >
            Dr. Caldwell Esselstyn's plant-based protocol has been proven to halt and reverse heart disease. 
            This approach focuses on eliminating all sources of dietary cholesterol and saturated fat while 
            maximizing nutrient-dense, whole plant foods.
          </Text>
          <Text
            style={{
              color: '#16A085',
              fontSize: 13,
              lineHeight: 18,
              letterSpacing: 0.1,
              fontWeight: '500',
            }}
          >
            Always consult with your healthcare provider before making significant dietary changes.
          </Text>
        </View>

        {/* Guidelines Sections */}
        {guidelines.map((section, index) => (
          <View key={index} style={{ marginBottom: 24 }}>
            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
              overflow: 'hidden',
            }}>
              {/* Section Header */}
              <View
                style={{
                  padding: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: '#F3F4F6',
                  backgroundColor: section.backgroundColor,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name={section.icon as any} size={24} color={section.color} />
                  <Text
                    style={{
                      color: section.color,
                      fontSize: 18,
                      lineHeight: 24,
                      letterSpacing: -0.1,
                      fontWeight: '600',
                      marginLeft: 12,
                    }}
                  >
                    {section.category}
                  </Text>
                </View>
              </View>

              {/* Section Items */}
              <View style={{ padding: 20 }}>
                {section.items.map((item, itemIndex) => (
                  <View 
                    key={itemIndex} 
                    style={{ 
                      flexDirection: 'row', 
                      alignItems: 'flex-start', 
                      marginBottom: itemIndex === section.items.length - 1 ? 0 : 12 
                    }}
                  >
                    <View 
                      style={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: 4, 
                        marginTop: 8, 
                        marginRight: 12, 
                        backgroundColor: section.color 
                      }} 
                    />
                    <Text
                      style={{
                        color: '#2C3E50',
                        fontSize: 15,
                        lineHeight: 22,
                        flex: 1,
                      }}
                    >
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}

        {/* Footer */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <Text
            style={{
              color: '#2C3E50',
              fontSize: 18,
              lineHeight: 24,
              letterSpacing: -0.1,
              fontWeight: '600',
              marginBottom: 12,
            }}
          >
            Remember
          </Text>
          <Text
            style={{
              color: '#7F8C8D',
              fontSize: 15,
              lineHeight: 22,
            }}
          >
            This protocol requires commitment and consistency. The goal is to provide your body with the optimal 
            nutrition needed to heal and reverse arterial damage. Every food choice is an opportunity to support 
            your cardiovascular health.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}