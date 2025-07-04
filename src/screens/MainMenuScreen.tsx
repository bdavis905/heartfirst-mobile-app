import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import FloatingMenu from '../components/FloatingMenu';

interface MainMenuScreenProps {
  navigation: any;
}

type MenuNavigationType = 'guidelines' | 'greens_tracker' | 'scanner' | 'history';

export default function MainMenuScreen({ navigation }: MainMenuScreenProps) {
  const insets = useSafeAreaInsets();

  const handleMenuPress = async (screenName: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(screenName);
  };

  const handleFloatingMenuNavigate = (screen: MenuNavigationType) => {
    const screenMapping = {
      'guidelines': 'Guidelines',
      'greens_tracker': 'GreensTracker', 
      'scanner': 'FoodAnalyzer',
      'history': 'GreensHistory'
    };
    navigation.navigate(screenMapping[screen]);
  };

  const menuItems = [
    {
      title: 'Food Scanner',
      subtitle: 'Analyze your meals for heart health',
      icon: 'camera-outline',
      color: '#3498DB',
      screen: 'FoodAnalyzer',
    },
    {
      title: 'Daily Greens',
      subtitle: 'Track your 6 daily servings',
      icon: 'leaf-outline',
      color: '#16A085',
      screen: 'GreensTracker',
    },
    {
      title: 'History',
      subtitle: 'View your weekly progress',
      icon: 'stats-chart-outline',
      color: '#9B59B6',
      screen: 'GreensHistory',
    },
    {
      title: 'Guidelines',
      subtitle: 'Dr. Esselstyn\'s heart protocol',
      icon: 'heart-outline',
      color: '#E74C3C',
      screen: 'Guidelines',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Floating Menu */}
      <FloatingMenu onNavigate={handleFloatingMenuNavigate} />
      
      <View style={{ 
        paddingTop: insets.top, 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        borderBottomWidth: 1, 
        borderBottomColor: '#E5E7EB' 
      }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          paddingHorizontal: 24, 
          paddingVertical: 20 
        }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text 
              style={{
                color: '#2C3E50',
                fontSize: 28,
                lineHeight: 34,
                letterSpacing: -0.3,
                fontWeight: '600'
              }}
            >
              Heart Health Hub
            </Text>
            <Text 
              style={{
                color: '#7F8C8D',
                fontSize: 15,
                lineHeight: 22,
                marginTop: 8
              }}
            >
              Your journey to cardiovascular wellness
            </Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 32 }}>
        <Text style={{ color: 'red', fontSize: 20, textAlign: 'center', marginBottom: 20 }}>DEBUG: Menu Items Loading...</Text>
        <View style={{ flexDirection: 'column' }}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.screen}
              onPress={() => handleMenuPress(item.screen)}
              style={({ pressed }) => ({
                backgroundColor: item.color,
                borderRadius: 24,
                padding: 32,
                shadowColor: item.color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
                transform: [{ scale: pressed ? 0.95 : 1 }],
                marginBottom: index < menuItems.length - 1 ? 24 : 0,
                minHeight: 140,
                width: '100%',
              })}
            >
              <View style={{ alignItems: 'center' }}>
                <Ionicons name={item.icon as any} size={64} color="white" />
                <Text style={{
                  color: 'white',
                  fontSize: 20,
                  lineHeight: 26,
                  fontWeight: '700',
                  marginTop: 16,
                  textAlign: 'center'
                }}>
                  {item.title}
                </Text>
                <Text style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: 14,
                  lineHeight: 18,
                  fontWeight: '500',
                  marginTop: 8,
                  textAlign: 'center'
                }}>
                  {item.subtitle}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={{ marginTop: 48, paddingHorizontal: 16 }}>
          <Text style={{
            color: '#7F8C8D',
            fontSize: 12,
            lineHeight: 16,
            textAlign: 'center'
          }}>
            All features follow Dr. Esselstyn"s heart disease reversal protocol
          </Text>
        </View>
      </View>
    </View>
  );
}