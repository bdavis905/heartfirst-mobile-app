import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, CameraViewRef } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { cn } from '../utils/cn';

type AnalysisResult = {
  status: 'compliant' | 'not_compliant' | 'caution';
  explanation: string;
};

export default function FoodAnalyzerScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<CameraViewRef>(null);
  const insets = useSafeAreaInsets();

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

    try {
      // Haptic feedback for photo capture
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });
      
      if (photo?.uri) {
        setCapturedImage(photo.uri);
        analyzeImage(photo.base64!);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock responses for different scenarios
      const mockResponses = [
        {
          status: 'compliant' as const,
          explanation: "✅ Great choice! This food item is compliant with Dr. Esselstyn's heart disease reversal protocol. It contains no oil, dairy, meat, added sugars, or excessive sodium. This whole food, plant-based option supports heart health and disease reversal."
        },
        {
          status: 'not_compliant' as const,
          explanation: "❌ This food item is NOT compliant with Dr. Esselstyn's protocol. It contains oil and dairy, which are not allowed on the program. These ingredients can contribute to arterial plaque buildup and interfere with heart disease reversal. Consider choosing whole, plant-based alternatives."
        },
        {
          status: 'caution' as const,
          explanation: "⚠️ Caution advised with this food item. While it may not contain obvious non-compliant ingredients, it appears to have added sugars and higher sodium content. Check the ingredient list carefully and consider limiting consumption. Look for versions with no added sugars or salt."
        },
        {
          status: 'not_compliant' as const,
          explanation: "❌ This processed food contains multiple non-compliant ingredients including oil, meat, and high sodium levels. These ingredients are strictly avoided on Dr. Esselstyn's protocol as they can promote inflammation and cardiovascular disease progression."
        },
        {
          status: 'caution' as const,
          explanation: "⚠️ This item needs careful consideration. While plant-based, it may contain oils or excessive sodium. Dr. Esselstyn's protocol requires avoiding all added oils, even plant-based ones. Check labels for oil-free versions or consider making homemade alternatives."
        }
      ];

      // Randomly select a mock response
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      // Haptic feedback for result
      if (randomResponse.status === 'compliant') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (randomResponse.status === 'not_compliant') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }

      setAnalysisResult(randomResponse);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setAnalysisResult({
        status: 'caution',
        explanation: 'Unable to analyze image. Please try again.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Ionicons name="checkmark-circle" size={80} color="#10b981" />;
      case 'not_compliant':
        return <Ionicons name="close-circle" size={80} color="#ef4444" />;
      case 'caution':
        return <Ionicons name="warning" size={80} color="#f59e0b" />;
      default:
        return <Ionicons name="help-circle" size={80} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-50 border-green-200';
      case 'not_compliant':
        return 'bg-red-50 border-red-200';
      case 'caution':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (capturedImage) {
    return (
      <View className="flex-1 bg-slate-50">
        <View style={{ paddingTop: insets.top }} className="bg-white border-b border-gray-200">
          <View className="flex-row items-center justify-between px-6 py-4">
            <Pressable onPress={resetAnalysis} className="flex-row items-center">
              <Ionicons name="arrow-back" size={24} color="#374151" />
              <Text className="text-gray-700 font-medium ml-2">Back</Text>
            </Pressable>
            <Text className="text-lg font-semibold text-gray-800">Food Analysis</Text>
            <View className="w-16" />
          </View>
        </View>

        <View className="flex-1 p-6">
          <View className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6">
            <Image source={{ uri: capturedImage }} className="w-full h-48" resizeMode="cover" />
          </View>

          {isAnalyzing ? (
            <View className="bg-white rounded-2xl p-8 shadow-sm">
              <View className="items-center">
                <Ionicons name="hourglass-outline" size={64} color="#0ea5e9" />
                <Text className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                  Analyzing...
                </Text>
                <Text className="text-gray-600 text-center">
                  Checking ingredients against Dr. Esselstyn's protocol
                </Text>
              </View>
            </View>
          ) : analysisResult ? (
            <View className={cn("rounded-2xl p-8 shadow-sm border-2", getStatusColor(analysisResult.status))}>
              <View className="items-center mb-6">
                {getStatusIcon(analysisResult.status)}
              </View>
              <Text className="text-gray-800 text-base leading-relaxed text-center mb-8">
                {analysisResult.explanation}
              </Text>
              <Pressable
                onPress={resetAnalysis}
                className="bg-blue-500 rounded-xl py-4 px-6"
              >
                <Text className="text-white font-semibold text-center">
                  Scan Another Item
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
    );
  }

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
              <View className="w-12" />
              <Text className="text-white font-semibold text-lg">Food Analyzer</Text>
              <Pressable onPress={toggleCameraFacing} className="w-12 h-12 items-center justify-center">
                <Ionicons name="camera-reverse" size={24} color="white" />
              </Pressable>
            </View>
          </View>

          {/* Instructions */}
          <View className="flex-1 justify-center items-center px-6">
            <View className="bg-black/60 rounded-2xl p-6 mb-8">
              <Text className="text-white text-center font-medium mb-2">
                Point camera at food label or menu
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
    </View>
  );
}