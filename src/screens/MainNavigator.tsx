import React, { useState } from 'react';
import WelcomeScreen, { ScanType } from './WelcomeScreen';
import FoodAnalyzerScreen from './FoodAnalyzerScreen';
import SubscriptionScreen from './SubscriptionScreen';

type Screen = 'welcome' | 'camera' | 'subscription';

export default function MainNavigator() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedScanType, setSelectedScanType] = useState<ScanType>('food_label');

  const handleScanTypeSelect = (type: ScanType) => {
    setSelectedScanType(type);
    setCurrentScreen('camera');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const handleSubscriptionRequired = () => {
    setCurrentScreen('subscription');
  };

  const handleSubscriptionComplete = () => {
    setCurrentScreen('camera');
  };

  const handleBackFromSubscription = () => {
    setCurrentScreen('welcome');
  };

  if (currentScreen === 'welcome') {
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

  return (
    <FoodAnalyzerScreen 
      scanType={selectedScanType} 
      onBack={handleBackToWelcome}
      onSubscriptionRequired={handleSubscriptionRequired}
    />
  );
}