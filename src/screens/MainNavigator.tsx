import React, { useState } from 'react';
import { View, Text } from 'react-native';
import NewWelcomeScreen from './NewWelcomeScreen';
import MedicalAgreementScreen from './MedicalAgreementScreen';
import SimpleMedicalAgreement from './SimpleMedicalAgreement';
import MainMenuScreen from './MainMenuScreen';
import WelcomeScreen, { ScanType } from './WelcomeScreen';
import FoodAnalyzerScreen from './FoodAnalyzerScreen';
import SubscriptionScreen from './SubscriptionScreen';
import GuidelinesScreen from './GuidelinesScreen';
import GreensTrackerScreen from './GreensTrackerScreen';
import GreensHistoryScreen from './GreensHistoryScreen';

type Screen = 'new_welcome' | 'medical_agreement' | 'main_menu' | 'camera' | 'subscription' | 'guidelines' | 'greens_tracker' | 'greens_history';

export default function MainNavigator() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('new_welcome');
  const [selectedScanType, setSelectedScanType] = useState<ScanType>('food_label');

  const handleGetStarted = () => {
    // Temporarily bypass medical agreement - go directly to main menu
    setCurrentScreen('main_menu');
  };

  const handleMedicalAgreementAccept = () => {
    setCurrentScreen('main_menu');
  };

  const handleMedicalAgreementClose = () => {
    setCurrentScreen('new_welcome');
  };

  // Simplified - no scan type selection needed, default to food_label
  const handleScanTypeSelect = () => {
    setSelectedScanType('food_label');
    setCurrentScreen('camera');
  };

  const handleBackToScanSelection = () => {
    // Go back to main menu instead of scan selection
    setCurrentScreen('main_menu');
  };

  const handleSubscriptionRequired = () => {
    setCurrentScreen('subscription');
  };

  const handleSubscriptionComplete = () => {
    setCurrentScreen('camera');
  };

  const handleBackFromSubscription = () => {
    setCurrentScreen('main_menu');
  };

  const handleMainMenuNavigate = (screen: string) => {
    switch (screen) {
      case 'Guidelines':
        setCurrentScreen('guidelines');
        break;
      case 'FoodAnalyzer':
        // Go directly to camera instead of scan selection
        setCurrentScreen('camera');
        break;
      case 'GreensTracker':
        setCurrentScreen('greens_tracker');
        break;
      case 'GreensHistory':
        setCurrentScreen('greens_history');
        break;
      default:
        setCurrentScreen('main_menu');
    }
  };

  const handleBackToMainMenu = () => {
    setCurrentScreen('main_menu');
  };

  if (currentScreen === 'new_welcome') {
    return <NewWelcomeScreen onGetStarted={handleGetStarted} />;
  }

  if (currentScreen === 'medical_agreement') {
    return (
      <MedicalAgreementScreen 
        onAccept={handleMedicalAgreementAccept}
        onClose={handleMedicalAgreementClose}
      />
    );
  }

  if (currentScreen === 'main_menu') {
    return (
      <MainMenuScreen 
        navigation={{ navigate: handleMainMenuNavigate }}
      />
    );
  }

  if (currentScreen === 'guidelines') {
    return (
      <GuidelinesScreen 
        navigation={{ goBack: handleBackToMainMenu }}
      />
    );
  }

  if (currentScreen === 'greens_tracker') {
    return (
      <GreensTrackerScreen 
        navigation={{ goBack: handleBackToMainMenu }}
      />
    );
  }

  if (currentScreen === 'greens_history') {
    return (
      <GreensHistoryScreen 
        navigation={{ goBack: handleBackToMainMenu }}
      />
    );
  }

  // Removed scan_selection screen - now goes directly to camera

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