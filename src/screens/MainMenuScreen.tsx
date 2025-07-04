import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface MainMenuScreenProps {
  navigation: any;
}

export default function MainMenuScreen({ navigation }: MainMenuScreenProps) {
  const insets = useSafeAreaInsets();

  const handleMenuPress = (screenName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(screenName);
  };

  const menuItems = [
    {
      title: 'Guidelines',
      subtitle: 'Dr. Esselstyn\'s Protocol',
      icon: 'heart-outline',
      color: '#E74C3C',
      screen: 'Guidelines',
    },
    {
      title: 'Food Scanner',
      subtitle: 'Analyze your meals',
      icon: 'camera-outline',
      color: '#3498DB',
      screen: 'FoodAnalyzer',
    },
    {
      title: 'Daily Greens',
      subtitle: 'Track your 6 servings',
      icon: 'leaf-outline',
      color: '#16A085',
      screen: 'GreensTracker',
    },
    {
      title: 'History',
      subtitle: 'Your progress over time',
      icon: 'stats-chart-outline',
      color: '#9B59B6',
      screen: 'GreensHistory',
    },
  ];

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#F8F9FA',
      paddingTop: insets.top,
    }}>
      {/* Header */}
      <View style={{
        paddingHorizontal: 24,
        paddingVertical: 32,
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: 32,
          lineHeight: 38,
          fontWeight: '700',
          color: '#2C3E50',
          textAlign: 'center',
          marginBottom: 8,
        }}>
          Heart Health Hub
        </Text>
        <Text style={{
          fontSize: 16,
          lineHeight: 22,
          fontWeight: '500',
          color: '#7F8C8D',
          textAlign: 'center',
        }}>
          Your journey to cardiovascular wellness
        </Text>
      </View>

      {/* Menu Items */}
      <View style={{
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: insets.bottom + 24,
      }}>
        {menuItems.map((item, index) => (
          <Pressable
            key={item.screen}
            onPress={() => handleMenuPress(item.screen)}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#ECF0F1' : 'white',
              borderRadius: 16,
              padding: 24,
              marginBottom: 16,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            })}
          >
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: item.color + '15',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
            }}>
              <Ionicons 
                name={item.icon as any} 
                size={28} 
                color={item.color} 
              />
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 18,
                lineHeight: 24,
                fontWeight: '600',
                color: '#2C3E50',
                marginBottom: 4,
              }}>
                {item.title}
              </Text>
              <Text style={{
                fontSize: 14,
                lineHeight: 18,
                fontWeight: '500',
                color: '#7F8C8D',
              }}>
                {item.subtitle}
              </Text>
            </View>
            
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color="#BDC3C7" 
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}