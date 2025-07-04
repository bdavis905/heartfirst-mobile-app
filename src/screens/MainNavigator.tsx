import React, { useState } from 'react';
import { View, Text } from 'react-native';
import NewWelcomeScreen from './NewWelcomeScreen';
import WelcomeScreen, { ScanType } from './WelcomeScreen';
import FoodAnalyzerScreen from './FoodAnalyzerScreen';
import SubscriptionScreen from './SubscriptionScreen';

type Screen = 'new_welcome' | 'scan_selection' | 'camera' | 'subscription';

export default function MainNavigator() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('new_welcome');
  const [selectedScanType, setSelectedScanType] = useState<ScanType>('food_label');

  const handleGetStarted = () => {
    setCurrentScreen('scan_selection');
  };

  const handleScanTypeSelect = (type: ScanType) => {
    setSelectedScanType(type);
    setCurrentScreen('camera');
  };

  const handleBackToScanSelection = () => {
    setCurrentScreen('scan_selection');
  };

  const handleSubscriptionRequired = () => {
    setCurrentScreen('subscription');
  };

  const handleSubscriptionComplete = () => {
    setCurrentScreen('camera');
  };

  const handleBackFromSubscription = () => {
    setCurrentScreen('scan_selection');
  };

  if (currentScreen === 'new_welcome') {
    return <NewWelcomeScreen onGetStarted={handleGetStarted} />;
  }

  if (currentScreen === 'scan_selection') {
    return <WelcomeScreen onScanTypeSelect={handleScanTypeSelect} />;
  }

  if (currentScreen === 'subscription') {
    return (
      <SubscriptionScreen 
        onBack={handleBackFromSubscription}
        onSubscribe={handleSubscriptionComplete}
      />
    );
  }

  if (currentScreen === 'camera') {
    return (
      <FoodAnalyzerScreen 
        scanType={selectedScanType} 
        onBack={handleBackToScanSelection}
        onSubscriptionRequired={handleSubscriptionRequired}
      />
    );
  }

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text>Loading...</Text>
    </View>
  );
}