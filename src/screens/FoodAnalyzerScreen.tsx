import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, CameraViewRef } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { cn } from '../utils/cn';
import { ScanType } from './WelcomeScreen';
import { useSubscriptionStore } from '../state/subscriptionStore';
import ImageChatModal from '../components/ImageChatModal';
// import { LinearGradient } from 'expo-linear-gradient';

type AnalysisResult = {
  status: 'compliant' | 'not_compliant' | 'caution';
  explanation: string;
  suggestions?: string[];
  modifications?: string[];
};

interface FoodAnalyzerScreenProps {
  scanType: ScanType;
  onBack: () => void;
  onSubscriptionRequired: () => void;
}

export default function FoodAnalyzerScreen({ scanType, onBack, onSubscriptionRequired }: FoodAnalyzerScreenProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showImageChat, setShowImageChat] = useState(false);
  const cameraRef = useRef<CameraViewRef>(null);
  const insets = useSafeAreaInsets();
  
  const { 
    useScan, 
    getRemainingScans, 
    getSubscriptionStatus,
    isSubscribed,
    maxFreeScans,
    freeScansUsed 
  } = useSubscriptionStore();

  if (!permission) {
    return <View className="flex-1 bg-slate-50" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-8 shadow-sm">
          <Ionicons name="camera-outline" size={64} color="#0ea5e9" className="self-center mb-4" />
          <Text className="text-xl font-semibold text-gray-800 text-center mb-4">
            Camera Access Required
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            We need access to your camera to analyze food labels and menus.
          </Text>
          <Pressable
            onPress={requestPermission}
            className="bg-blue-500 rounded-xl py-4 px-6"
          >
            <Text className="text-white font-semibold text-center">Grant Permission</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const capturePhoto = async () => {
    if (!cameraRef.current) return;

    // Check if scan is allowed
    const canScan = useScan();
    if (!canScan) {
      // Show subscription screen
      onSubscriptionRequired();
      return;
    }

    try {
      // Haptic feedback for photo capture
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false, // Don't need base64 here, ImageChatModal will handle it
      });
      
      if (photo?.uri) {
        setCapturedImage(photo.uri);
        setShowImageChat(true); // Open the image chat modal immediately
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const handleImageChatClose = () => {
    setShowImageChat(false);
    setCapturedImage(null);
  };

  const getScanTypeTitle = () => {
    return 'Food Scanner'; // Simplified since we removed scan type selection
  };

  const getScanTypeInstructions = () => {
    return 'Point camera at any food item';
  };



  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
      >
        <View className="absolute top-0 left-0 right-0 bottom-0 z-10">
          {/* Header */}
          <View style={{ paddingTop: insets.top }} className="bg-black/20 backdrop-blur-sm">
            <View className="flex-row items-center justify-between px-6 py-4">
              <Pressable onPress={onBack} className="w-12 h-12 items-center justify-center">
                <Ionicons name="arrow-back" size={24} color="white" />
              </Pressable>
              <Text className="text-white font-semibold text-lg">{getScanTypeTitle()}</Text>
              <Pressable onPress={toggleCameraFacing} className="w-12 h-12 items-center justify-center">
                <Ionicons name="camera-reverse" size={24} color="white" />
              </Pressable>
            </View>
            
            {/* Scan Counter */}
            <View className="mx-6 mb-4">
              <View className="bg-black/60 rounded-full px-4 py-2 self-center">
                <Text className="text-white text-sm font-medium">
                  {isSubscribed ? 
                    `${getRemainingScans()} scans left this month` : 
                    `${getRemainingScans()} free scans left`
                  }
                </Text>
              </View>
            </View>
          </View>

          {/* Instructions */}
          <View className="flex-1 justify-center items-center px-6">
            <View className="bg-black/60 rounded-2xl p-6 mb-8">
              <Text className="text-white text-center font-medium mb-2">
                {getScanTypeInstructions()}
              </Text>
              <Text className="text-white/80 text-center text-sm">
                Tap the button below to capture and analyze
              </Text>
            </View>
          </View>

          {/* Capture Button */}
          <View style={{ paddingBottom: insets.bottom }} className="bg-black/20 backdrop-blur-sm">
            <View className="items-center py-8">
              <Pressable
                onPress={capturePhoto}
                className="w-20 h-20 bg-white rounded-full items-center justify-center shadow-lg"
              >
                <Ionicons name="camera" size={32} color="#0ea5e9" />
              </Pressable>
            </View>
          </View>
        </View>
      </CameraView>

      {/* Image Chat Modal */}
      <ImageChatModal 
        visible={showImageChat}
        imageUri={capturedImage}
        onClose={handleImageChatClose}
      />
    </View>
  );
}