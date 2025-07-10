import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import FloatingMenu from '../components/FloatingMenu';
import FloatingChatButton from '../components/FloatingChatButton';

interface MainMenuScreenProps {
  navigation: any;
}

type MenuNavigationType = 'guidelines' | 'greens_tracker' | 'home' | 'history';

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
      'home': 'Home', // This will stay on main menu
      'history': 'GreensHistory'
    };
    
    if (screen === 'home') {
      // Already on main menu, do nothing or close menu
      return;
    }
    
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
      
      {/* Floating Chat Button */}
      <FloatingChatButton />
      
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
        
        {/* Guidelines Button */}
        <Pressable
          onPress={() => handleMenuPress('Guidelines')}
          style={{
            backgroundColor: '#E74C3C',
            borderRadius: 20,
            padding: 20,
            marginBottom: 12,
            minHeight: 90,
            width: '100%',
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="heart-outline" size={48} color="white" />
            <Text style={{
              color: 'white',
              fontSize: 18,
              lineHeight: 22,
              fontWeight: '700',
              marginTop: 12,
              textAlign: 'center'
            }}>
              Guidelines
            </Text>
            <Text style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 12,
              lineHeight: 16,
              fontWeight: '500',
              marginTop: 4,
              textAlign: 'center'
            }}>
              Dr. Esselstyn's heart protocol
            </Text>
          </View>
        </Pressable>

        {/* Food Scanner Button */}
        <Pressable
          onPress={() => handleMenuPress('FoodAnalyzer')}
          style={{
            backgroundColor: '#3498DB',
            borderRadius: 20,
            padding: 20,
            marginBottom: 12,
            minHeight: 90,
            width: '100%',
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="camera-outline" size={48} color="white" />
            <Text style={{
              color: 'white',
              fontSize: 18,
              lineHeight: 22,
              fontWeight: '700',
              marginTop: 12,
              textAlign: 'center'
            }}>
              Food Scanner
            </Text>
            <Text style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 12,
              lineHeight: 16,
              fontWeight: '500',
              marginTop: 4,
              textAlign: 'center'
            }}>
              Open camera to scan any food item
            </Text>
          </View>
        </Pressable>

        {/* Daily Greens Button */}
        <Pressable
          onPress={() => handleMenuPress('GreensTracker')}
          style={{
            backgroundColor: '#16A085',
            borderRadius: 20,
            padding: 20,
            marginBottom: 12,
            minHeight: 90,
            width: '100%',
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="leaf-outline" size={48} color="white" />
            <Text style={{
              color: 'white',
              fontSize: 18,
              lineHeight: 22,
              fontWeight: '700',
              marginTop: 12,
              textAlign: 'center'
            }}>
              Daily Greens
            </Text>
            <Text style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 12,
              lineHeight: 16,
              fontWeight: '500',
              marginTop: 4,
              textAlign: 'center'
            }}>
              Track your 6 daily servings
            </Text>
          </View>
        </Pressable>

        <View style={{ marginTop: 32, paddingHorizontal: 16, paddingBottom: 60 }}>
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