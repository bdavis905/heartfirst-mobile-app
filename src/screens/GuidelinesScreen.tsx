import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function GuidelinesScreen() {
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
    <View className="flex-1">
      <LinearGradient
        colors={['#FFFFFF', '#E8F6F3']}
        locations={[0, 1]}
        className="flex-1"
      >
        {/* Header */}
        <View style={{ paddingTop: insets.top }} className="bg-white/90 border-b border-gray-200">
          <View style={{ paddingHorizontal: 24, paddingVertical: 20 }}>
            <Text
              className="font-bold text-center"
              style={{
                color: '#2C3E50',
                fontSize: 28,
                lineHeight: 34,
                letterSpacing: -0.3,
              }}
            >
              Dr. Esselstyn's Guidelines
            </Text>
            <Text
              className="text-center mt-2"
              style={{
                color: '#7F8C8D',
                fontSize: 15,
                lineHeight: 22,
              }}
            >
              Heart Disease Reversal Protocol
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {/* Introduction */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: '#16A08515' }}
              >
                <Ionicons name="information-circle" size={24} color="#16A085" />
              </View>
              <Text
                className="font-semibold flex-1"
                style={{
                  color: '#2C3E50',
                  fontSize: 18,
                  lineHeight: 24,
                  letterSpacing: -0.1,
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
            <View key={index} className="mb-6">
              <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Section Header */}
                <View
                  className="p-5 border-b border-gray-100"
                  style={{ backgroundColor: section.backgroundColor }}
                >
                  <View className="flex-row items-center">
                    <Ionicons name={section.icon as any} size={24} color={section.color} />
                    <Text
                      className="font-semibold ml-3"
                      style={{
                        color: section.color,
                        fontSize: 18,
                        lineHeight: 24,
                        letterSpacing: -0.1,
                      }}
                    >
                      {section.category}
                    </Text>
                  </View>
                </View>

                {/* Section Items */}
                <View className="p-5">
                  {section.items.map((item, itemIndex) => (
                    <View key={itemIndex} className="flex-row items-start mb-3 last:mb-0">
                      <View className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: section.color }} />
                      <Text
                        className="flex-1"
                        style={{
                          color: '#2C3E50',
                          fontSize: 15,
                          lineHeight: 22,
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
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <Text
              className="font-semibold mb-3"
              style={{
                color: '#2C3E50',
                fontSize: 18,
                lineHeight: 24,
                letterSpacing: -0.1,
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
      </LinearGradient>
    </View>
  );
}