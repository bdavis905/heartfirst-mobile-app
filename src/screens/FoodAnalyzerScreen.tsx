import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, CameraViewRef } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { cn } from '../utils/cn';
import { ScanType } from './WelcomeScreen';
import { useSubscriptionStore } from '../state/subscriptionStore';
import { LinearGradient } from 'expo-linear-gradient';

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
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
      
      let mockResponse: AnalysisResult;

      if (scanType === 'restaurant_menu') {
        // Restaurant menu responses with suggestions and modifications
        const menuResponses = [
          {
            status: 'caution' as const,
            explanation: "🍽️ This menu has several options that can be modified for Dr. Esselstyn's protocol. Most dishes contain oil, dairy, or meat, but many can be adapted.",
            suggestions: [
              "Garden salad without dressing",
              "Steamed vegetables (ask for no butter)",
              "Baked potato without toppings",
              "Fruit bowl or fresh berries"
            ],
            modifications: [
              "Ask for all dressings and sauces on the side",
              "Request no oil, butter, or cheese on any dish",
              "Substitute oil-based cooking with steaming or dry sautéing",
              "Ask for extra vegetables instead of meat or cheese"
            ]
          },
          {
            status: 'caution' as const,
            explanation: "🥗 This restaurant appears to have some plant-based options, but most will need modifications to be fully compliant with the protocol.",
            suggestions: [
              "Mediterranean bowl without feta and dressing",
              "Vegetable soup (confirm no oil or cream)",
              "Grilled vegetables (request no oil)",
              "Brown rice or quinoa bowl"
            ],
            modifications: [
              "Request no oil in preparation",
              "Ask for lemon or vinegar instead of oil-based dressings",
              "Substitute dairy cheese with extra vegetables",
              "Ask for herbs and spices instead of salt"
            ]
          }
        ];
        mockResponse = menuResponses[Math.floor(Math.random() * menuResponses.length)];
      } else {
        // Barcode and food label responses (binary compliance)
        const binaryResponses = [
          {
            status: 'compliant' as const,
            explanation: scanType === 'barcode' ? 
              "✅ Great choice! This product is compliant with Dr. Esselstyn's protocol. The barcode indicates a whole food, plant-based item with no oil, dairy, meat, added sugars, or excessive sodium." :
              "✅ Excellent! This food label shows full compliance with Dr. Esselstyn's protocol. All ingredients are whole food, plant-based with no prohibited items."
          },
          {
            status: 'not_compliant' as const,
            explanation: scanType === 'barcode' ? 
              "❌ This product is NOT compliant with Dr. Esselstyn's protocol. The barcode indicates it contains oil and dairy, which are strictly avoided on the program." :
              "❌ This food label shows non-compliant ingredients including oil, dairy, and high sodium. These ingredients interfere with heart disease reversal."
          },
          {
            status: 'caution' as const,
            explanation: scanType === 'barcode' ? 
              "⚠️ Caution with this product. While mostly plant-based, it contains added sugars and higher sodium than recommended for optimal heart health." :
              "⚠️ This label shows some concerning ingredients. While no obvious non-compliant items, the added sugars and sodium levels may be too high for the protocol."
          }
        ];
        mockResponse = binaryResponses[Math.floor(Math.random() * binaryResponses.length)];
      }
      
      // Haptic feedback for result
      if (mockResponse.status === 'compliant') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (mockResponse.status === 'not_compliant') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }

      setAnalysisResult(mockResponse);
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

  const getScanTypeTitle = () => {
    switch (scanType) {
      case 'barcode':
        return 'Barcode Scanner';
      case 'food_label':
        return 'Food Label Scanner';
      case 'restaurant_menu':
        return 'Menu Scanner';
      default:
        return 'Food Analyzer';
    }
  };

  const getScanTypeInstructions = () => {
    switch (scanType) {
      case 'barcode':
        return 'Point camera at the barcode';
      case 'food_label':
        return 'Point camera at the nutrition label';
      case 'restaurant_menu':
        return 'Point camera at the menu';
      default:
        return 'Point camera at food item';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Ionicons name="checkmark-circle" size={80} color="#2ECC71" />;
      case 'not_compliant':
        return <Ionicons name="close-circle" size={80} color="#E74C3C" />;
      case 'caution':
        return <Ionicons name="warning" size={80} color="#E67E22" />;
      default:
        return <Ionicons name="help-circle" size={80} color="#95A5A6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-background-success border-success/20';
      case 'not_compliant':
        return 'bg-error/5 border-error/20';
      case 'caution':
        return 'bg-warning/5 border-warning/20';
      default:
        return 'bg-background-secondary border-background-tertiary';
    }
  };

  if (capturedImage) {
    return (
      <View className="flex-1 bg-slate-50">
        <View style={{ paddingTop: insets.top }} className="bg-white border-b border-gray-200">
          <View className="flex-row items-center justify-between px-6 py-4">
            <Pressable onPress={onBack} className="flex-row items-center">
              <Ionicons name="arrow-back" size={24} color="#374151" />
              <Text className="text-gray-700 font-medium ml-2">Back</Text>
            </Pressable>
            <Text className="text-lg font-semibold text-gray-800">{getScanTypeTitle()}</Text>
            <View className="w-16" />
          </View>
        </View>

        <ScrollView className="flex-1 p-6">
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
                  {scanType === 'restaurant_menu' ? 
                    'Finding compliant options and modifications' : 
                    "Checking ingredients against Dr. Esselstyn's protocol"
                  }
                </Text>
              </View>
            </View>
          ) : analysisResult ? (
            <View className={cn("rounded-2xl p-8 shadow-sm border-2", getStatusColor(analysisResult.status))}>
              <View className="items-center mb-6">
                {getStatusIcon(analysisResult.status)}
              </View>
              <Text className="text-gray-800 text-base leading-relaxed text-center mb-6">
                {analysisResult.explanation}
              </Text>

              {/* Restaurant Menu Suggestions */}
              {scanType === 'restaurant_menu' && analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                <View className="mb-6">
                  <Text className="text-lg font-semibold text-gray-800 mb-3">
                    ✅ Recommended Options:
                  </Text>
                  {analysisResult.suggestions.map((suggestion, index) => (
                    <View key={index} className="flex-row items-start mb-2">
                      <Ionicons name="checkmark-circle" size={16} color="#10b981" style={{ marginTop: 2 }} />
                      <Text className="text-gray-700 ml-2 flex-1">
                        {suggestion}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Restaurant Menu Modifications */}
              {scanType === 'restaurant_menu' && analysisResult.modifications && analysisResult.modifications.length > 0 && (
                <View className="mb-8">
                  <Text className="text-lg font-semibold text-gray-800 mb-3">
                    🔄 Ask for These Modifications:
                  </Text>
                  {analysisResult.modifications.map((modification, index) => (
                    <View key={index} className="flex-row items-start mb-2">
                      <Ionicons name="swap-horizontal" size={16} color="#0ea5e9" style={{ marginTop: 2 }} />
                      <Text className="text-gray-700 ml-2 flex-1">
                        {modification}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <Pressable
                onPress={resetAnalysis}
                className="bg-blue-500 rounded-xl py-4 px-6 mb-2"
              >
                <Text className="text-white font-semibold text-center">
                  Scan Another Item
                </Text>
              </Pressable>
              
              <Pressable
                onPress={onBack}
                className="bg-gray-200 rounded-xl py-4 px-6"
              >
                <Text className="text-gray-700 font-semibold text-center">
                  Choose Different Scan Type
                </Text>
              </Pressable>
            </View>
          ) : null}
        </ScrollView>
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
    </View>
  );
}