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

  // Calculate actual progress based on completed servings
  const actualProgress = Math.round((completed / goal) * 100);
  const progressCircleSize = size - strokeWidth;

  // More granular progress segments (every ~16.67% = 1 serving out of 6)
  const segmentSize = 100 / goal; // Each serving is worth this percentage
  
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

        {/* Progress Circle - Only show green when there's actual progress */}
        {completed > 0 && (
          <View
            style={{
              width: progressCircleSize,
              height: progressCircleSize,
              borderRadius: progressCircleSize / 2,
              position: 'absolute',
              transform: [{ rotate: '-90deg' }],
              overflow: 'hidden',
            }}
          >
            {/* Create individual segments for each serving */}
            {Array.from({ length: completed }, (_, index) => (
              <View
                key={index}
                style={{
                  position: 'absolute',
                  width: progressCircleSize,
                  height: progressCircleSize,
                  borderRadius: progressCircleSize / 2,
                  borderWidth: strokeWidth,
                  borderColor: 'transparent',
                  borderTopColor: ringColor,
                  transform: [{ rotate: `${index * 60}deg` }], // 360/6 = 60 degrees per serving
                }}
              />
            ))}
          </View>
        )}

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
          {actualProgress}%
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