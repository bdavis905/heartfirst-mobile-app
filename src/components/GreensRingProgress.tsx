import React from 'react';
import { View, Text } from 'react-native';

interface GreensRingProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  completed: number;
  goal: number;
}

export default function GreensRingProgress({ 
  progress, 
  size = 200, 
  strokeWidth = 16,
  completed,
  goal 
}: GreensRingProgressProps) {
  const isComplete = completed >= goal;
  const ringColor = isComplete ? '#2ECC71' : '#16A085';

  // Simple circular progress using border
  const progressCircleSize = size - strokeWidth;
  const progressAngle = (progress / 100) * 360;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ 
        width: size, 
        height: size, 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
      }}>
        {/* Background Circle */}
        <View
          style={{
            width: progressCircleSize,
            height: progressCircleSize,
            borderRadius: progressCircleSize / 2,
            borderWidth: strokeWidth,
            borderColor: '#ECF0F1',
            position: 'absolute',
          }}
        />

        {/* Progress Circle - Simple approach */}
        <View
          style={{
            width: progressCircleSize,
            height: progressCircleSize,
            borderRadius: progressCircleSize / 2,
            borderWidth: strokeWidth,
            borderColor: 'transparent',
            borderTopColor: ringColor,
            borderRightColor: progress > 25 ? ringColor : 'transparent',
            borderBottomColor: progress > 50 ? ringColor : 'transparent',
            borderLeftColor: progress > 75 ? ringColor : 'transparent',
            position: 'absolute',
            transform: [{ rotate: '-90deg' }],
          }}
        />

        {/* Center Content */}
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text
            style={{
              color: ringColor,
              fontSize: 48,
              lineHeight: 56,
              letterSpacing: -1,
              fontWeight: '300',
              textAlign: 'center',
            }}
          >
            {completed}
          </Text>
          <Text
            style={{
              color: '#7F8C8D',
              fontSize: 16,
              lineHeight: 20,
              letterSpacing: 0.1,
              fontWeight: '500',
              textAlign: 'center',
              marginTop: -4,
            }}
          >
            of {goal}
          </Text>
          <Text
            style={{
              color: '#95A5A6',
              fontSize: 12,
              lineHeight: 16,
              letterSpacing: 0.2,
              fontWeight: '500',
              textAlign: 'center',
            }}
          >
            servings
          </Text>
          
          {isComplete && (
            <View style={{ marginTop: 8 }}>
              <Text
                style={{
                  color: '#2ECC71',
                  fontSize: 14,
                  lineHeight: 18,
                  letterSpacing: 0.1,
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                Goal Complete! 🎉
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Progress Percentage */}
      <View style={{ marginTop: 16 }}>
        <Text
          style={{
            color: '#2C3E50',
            fontSize: 24,
            lineHeight: 30,
            letterSpacing: -0.2,
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          {progress}%
        </Text>
        <Text
          style={{
            color: '#7F8C8D',
            fontSize: 14,
            lineHeight: 18,
            letterSpacing: 0.1,
            fontWeight: '500',
            textAlign: 'center',
          }}
        >
          Daily Progress
        </Text>
      </View>
    </View>
  );
}