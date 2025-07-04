import React, { useState } from 'react';
import WelcomeScreen, { ScanType } from './WelcomeScreen';
import FoodAnalyzerScreen from './FoodAnalyzerScreen';

export default function MainNavigator() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'camera'>('welcome');
  const [selectedScanType, setSelectedScanType] = useState<ScanType>('food_label');

  const handleScanTypeSelect = (type: ScanType) => {
    setSelectedScanType(type);
    setCurrentScreen('camera');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  if (currentScreen === 'welcome') {
    return <WelcomeScreen onScanTypeSelect={handleScanTypeSelect} />;
  }

  return (
    <FoodAnalyzerScreen 
      scanType={selectedScanType} 
      onBack={handleBackToWelcome}
    />
  );
}