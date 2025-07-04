import React, { useState } from 'react';
import { View, Text } from 'react-native';
import NewWelcomeScreen from './NewWelcomeScreen';
import MedicalAgreementScreen from './MedicalAgreementScreen';
import WelcomeScreen, { ScanType } from './WelcomeScreen';
import FoodAnalyzerScreen from './FoodAnalyzerScreen';
import SubscriptionScreen from './SubscriptionScreen';

type Screen = 'new_welcome' | 'medical_agreement' | 'scan_selection' | 'camera' | 'subscription';

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