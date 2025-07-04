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

        {/* Progress Circle - Show precise segments */}
        {completed > 0 && (
          <View
            style={{
              width: progressCircleSize,
              height: progressCircleSize,
              borderRadius: progressCircleSize / 2,
              position: 'absolute',
              transform: [{ rotate: '-90deg' }],
            }}
          >
            {/* Segment 1 (0-60 degrees) */}
            {completed >= 1 && (
              <View
                style={{
                  position: 'absolute',
                  width: progressCircleSize,
                  height: progressCircleSize,
                  borderRadius: progressCircleSize / 2,
                  borderWidth: strokeWidth,
                  borderColor: 'transparent',
                  borderTopColor: ringColor,
                  borderRightColor: 'transparent',
                  borderBottomColor: 'transparent',
                  borderLeftColor: 'transparent',
                  transform: [{ rotate: '0deg' }],
                }}
              />
            )}

            {/* Segment 2 (60-120 degrees) */}
            {completed >= 2 && (
              <View
                style={{
                  position: 'absolute',
                  width: progressCircleSize,
                  height: progressCircleSize,
                  borderRadius: progressCircleSize / 2,
                  borderWidth: strokeWidth,
                  borderColor: 'transparent',
                  borderTopColor: 'transparent',
                  borderRightColor: ringColor,
                  borderBottomColor: 'transparent',
                  borderLeftColor: 'transparent',
                  transform: [{ rotate: '0deg' }],
                }}
              />
            )}

            {/* Segment 3 (120-180 degrees) */}
            {completed >= 3 && (
              <View
                style={{
                  position: 'absolute',
                  width: progressCircleSize,
                  height: progressCircleSize,
                  borderRadius: progressCircleSize / 2,
                  borderWidth: strokeWidth,
                  borderColor: 'transparent',
                  borderTopColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottomColor: ringColor,
                  borderLeftColor: 'transparent',
                  transform: [{ rotate: '0deg' }],
                }}
              />
            )}

            {/* Segment 4 (180-240 degrees) */}
            {completed >= 4 && (
              <View
                style={{
                  position: 'absolute',
                  width: progressCircleSize,
                  height: progressCircleSize,
                  borderRadius: progressCircleSize / 2,
                  borderWidth: strokeWidth,
                  borderColor: 'transparent',
                  borderTopColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottomColor: 'transparent',
                  borderLeftColor: ringColor,
                  transform: [{ rotate: '0deg' }],
                }}
              />
            )}

            {/* Segments 5 & 6 - Split the remaining 120 degrees */}
            {completed >= 5 && (
              <View
                style={{
                  position: 'absolute',
                  width: progressCircleSize,
                  height: progressCircleSize,
                  borderRadius: progressCircleSize / 2,
                  borderWidth: strokeWidth,
                  borderColor: 'transparent',
                  borderTopColor: ringColor,
                  borderRightColor: 'transparent',
                  borderBottomColor: 'transparent',
                  borderLeftColor: 'transparent',
                  transform: [{ rotate: '240deg' }], // Start at 240 degrees
                }}
              />
            )}

            {completed >= 6 && (
              <View
                style={{
                  position: 'absolute',
                  width: progressCircleSize,
                  height: progressCircleSize,
                  borderRadius: progressCircleSize / 2,
                  borderWidth: strokeWidth,
                  borderColor: 'transparent',
                  borderTopColor: 'transparent',
                  borderRightColor: ringColor,
                  borderBottomColor: 'transparent',
                  borderLeftColor: 'transparent',
                  transform: [{ rotate: '240deg' }], // Complete the final segment
                }}
              />
            )}
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