import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
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

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ 
          paddingHorizontal: 24, 
          paddingVertical: 20,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100%'
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: '100%', maxWidth: 400 }}>
        
        {/* Food Scanner Button */}
        <Pressable
          onPress={() => handleMenuPress('FoodAnalyzer')}
          style={{
            backgroundColor: '#3498DB',
            borderRadius: 20,
            padding: 24,
            marginBottom: 16,
            minHeight: 120,
            width: '100%',
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="camera-outline" size={64} color="white" />
            <Text style={{
              color: 'white',
              fontSize: 20,
              lineHeight: 26,
              fontWeight: '700',
              marginTop: 16,
              textAlign: 'center'
            }}>
              Food Scanner
            </Text>
            <Text style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 14,
              lineHeight: 18,
              fontWeight: '500',
              marginTop: 8,
              textAlign: 'center'
            }}>
              Analyze your meals for heart health
            </Text>
          </View>
        </Pressable>

        {/* Daily Greens Button */}
        <Pressable
          onPress={() => handleMenuPress('GreensTracker')}
          style={{
            backgroundColor: '#16A085',
            borderRadius: 20,
            padding: 24,
            marginBottom: 16,
            minHeight: 120,
            width: '100%',
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="leaf-outline" size={64} color="white" />
            <Text style={{
              color: 'white',
              fontSize: 20,
              lineHeight: 26,
              fontWeight: '700',
              marginTop: 16,
              textAlign: 'center'
            }}>
              Daily Greens
            </Text>
            <Text style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 14,
              lineHeight: 18,
              fontWeight: '500',
              marginTop: 8,
              textAlign: 'center'
            }}>
              Track your 6 daily servings
            </Text>
          </View>
        </Pressable>

        {/* History Button */}
        <Pressable
          onPress={() => handleMenuPress('GreensHistory')}
          style={{
            backgroundColor: '#9B59B6',
            borderRadius: 20,
            padding: 24,
            marginBottom: 16,
            minHeight: 120,
            width: '100%',
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="stats-chart-outline" size={64} color="white" />
            <Text style={{
              color: 'white',
              fontSize: 20,
              lineHeight: 26,
              fontWeight: '700',
              marginTop: 16,
              textAlign: 'center'
            }}>
              History
            </Text>
            <Text style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 14,
              lineHeight: 18,
              fontWeight: '500',
              marginTop: 8,
              textAlign: 'center'
            }}>
              View your weekly progress
            </Text>
          </View>
        </Pressable>

        {/* Guidelines Button */}
        <Pressable
          onPress={() => handleMenuPress('Guidelines')}
          style={{
            backgroundColor: '#E74C3C',
            borderRadius: 20,
            padding: 24,
            marginBottom: 16,
            minHeight: 120,
            width: '100%',
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="heart-outline" size={64} color="white" />
            <Text style={{
              color: 'white',
              fontSize: 20,
              lineHeight: 26,
              fontWeight: '700',
              marginTop: 16,
              textAlign: 'center'
            }}>
              Guidelines
            </Text>
            <Text style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 14,
              lineHeight: 18,
              fontWeight: '500',
              marginTop: 8,
              textAlign: 'center'
            }}>
              Dr. Esselstyn's heart protocol
            </Text>
          </View>
        </Pressable>

        <View style={{ marginTop: 32, paddingHorizontal: 16 }}>
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
      </ScrollView>
    </View>
  );
}