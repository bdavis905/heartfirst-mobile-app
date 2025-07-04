import React, { useState } from 'react';
import { View, Text } from 'react-native';
import NewWelcomeScreen from './NewWelcomeScreen';
import MedicalAgreementScreen from './MedicalAgreementScreen';
import WelcomeScreen, { ScanType } from './WelcomeScreen';
import FoodAnalyzerScreen from './FoodAnalyzerScreen';
import SubscriptionScreen from './SubscriptionScreen';
import GuidelinesScreen from './GuidelinesScreen';
import GreensTrackerScreen from './GreensTrackerScreen';
import FloatingMenu from '../components/FloatingMenu';

type Screen = 'new_welcome' | 'medical_agreement' | 'scan_selection' | 'camera' | 'subscription' | 'guidelines' | 'greens_tracker';

export default function MainNavigator() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('new_welcome');
  const [selectedScanType, setSelectedScanType] = useState<ScanType>('food_label');

  const handleGetStarted = () => {
    setCurrentScreen('medical_agreement');
  };

  const handleMedicalAgreementAccept = () => {
    setCurrentScreen('scan_selection');
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
    setCurrentScreen('scan_selection');
  };

  const handleMenuNavigate = (screen: 'guidelines' | 'greens_tracker' | 'scanner') => {
    if (screen === 'scanner') {
      setCurrentScreen('scan_selection');
    } else {
      setCurrentScreen(screen);
    }
  };

  const shouldShowMenu = currentScreen !== 'new_welcome' && currentScreen !== 'medical_agreement';

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

  if (currentScreen === 'guidelines') {
    return (
      <View className="flex-1">
        <GuidelinesScreen />
        {shouldShowMenu && <FloatingMenu onNavigate={handleMenuNavigate} />}
      </View>
    );
  }

  if (currentScreen === 'greens_tracker') {
    return (
      <View className="flex-1">
        <GreensTrackerScreen />
        {shouldShowMenu && <FloatingMenu onNavigate={handleMenuNavigate} />}
      </View>
    );
  }

  if (currentScreen === 'scan_selection') {
    return (
      <View className="flex-1">
        <WelcomeScreen onScanTypeSelect={handleScanTypeSelect} />
        {shouldShowMenu && <FloatingMenu onNavigate={handleMenuNavigate} />}
      </View>
    );
  }

  if (currentScreen === 'subscription') {
    return (
      <View className="flex-1">
        <SubscriptionScreen 
          onBack={handleBackFromSubscription}
          onSubscribe={handleSubscriptionComplete}
        />
        {shouldShowMenu && <FloatingMenu onNavigate={handleMenuNavigate} />}
      </View>
    );
  }

  if (currentScreen === 'camera') {
    return (
      <View className="flex-1">
        <FoodAnalyzerScreen 
          scanType={selectedScanType} 
          onBack={handleBackToScanSelection}
          onSubscriptionRequired={handleSubscriptionRequired}
        />
        {shouldShowMenu && <FloatingMenu onNavigate={handleMenuNavigate} />}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text>Loading...</Text>
    </View>
  );
}