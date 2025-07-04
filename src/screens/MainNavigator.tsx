import React, { useState } from 'react';
import { View, Text } from 'react-native';
import NewWelcomeScreen from './NewWelcomeScreen';
import MedicalAgreementScreen from './MedicalAgreementScreen';
import MainMenuScreen from './MainMenuScreen';
import WelcomeScreen, { ScanType } from './WelcomeScreen';
import FoodAnalyzerScreen from './FoodAnalyzerScreen';
import SubscriptionScreen from './SubscriptionScreen';
import GuidelinesScreen from './GuidelinesScreen';
import GreensTrackerScreen from './GreensTrackerScreen';
import GreensHistoryScreen from './GreensHistoryScreen';

type Screen = 'new_welcome' | 'medical_agreement' | 'main_menu' | 'scan_selection' | 'camera' | 'subscription' | 'guidelines' | 'greens_tracker' | 'greens_history';

export default function MainNavigator() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('new_welcome');
  const [selectedScanType, setSelectedScanType] = useState<ScanType>('food_label');

  const handleGetStarted = () => {
    setCurrentScreen('medical_agreement');
  };

  const handleMedicalAgreementAccept = () => {
    setCurrentScreen('main_menu');
  };

  const handleMedicalAgreementClose = () => {
    setCurrentScreen('new_welcome');
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
    setCurrentScreen('main_menu');
  };

  const handleMainMenuNavigate = (screen: string) => {
    switch (screen) {
      case 'Guidelines':
        setCurrentScreen('guidelines');
        break;
      case 'FoodAnalyzer':
        setCurrentScreen('scan_selection');
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

  if (currentScreen === 'scan_selection') {
    return (
      <WelcomeScreen 
        onScanTypeSelect={handleScanTypeSelect}
        navigation={{ goBack: handleBackToMainMenu }}
      />
    );
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