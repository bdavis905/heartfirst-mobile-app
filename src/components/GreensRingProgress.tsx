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

        {/* Progress Circle - Simple percentage-based arc */}
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
            {/* 
              Use a simple approach: show borders based on percentage ranges
              1 serving = 16.67% (show partial top)
              2 servings = 33.33% (show top + partial right)
              3 servings = 50% (show top + right)
              4 servings = 66.67% (show top + right + partial bottom)
              5 servings = 83.33% (show top + right + bottom)
              6 servings = 100% (show all)
            */}
            
            {/* Always show top border for any progress */}
            <View
              style={{
                position: 'absolute',
                width: progressCircleSize,
                height: progressCircleSize,
                borderRadius: progressCircleSize / 2,
                borderWidth: strokeWidth,
                borderColor: 'transparent',
                borderTopColor: ringColor,
                // Reduce opacity if we're at exactly 1 serving
                opacity: completed === 1 ? 0.6 : 1,
              }}
            />

            {/* Show right border for 2+ servings */}
            {completed >= 2 && (
              <View
                style={{
                  position: 'absolute',
                  width: progressCircleSize,
                  height: progressCircleSize,
                  borderRadius: progressCircleSize / 2,
                  borderWidth: strokeWidth,
                  borderColor: 'transparent',
                  borderRightColor: ringColor,
                  opacity: completed === 2 ? 0.6 : 1,
                }}
              />
            )}

            {/* Show bottom border for 3+ servings */}
            {completed >= 3 && (
              <View
                style={{
                  position: 'absolute',
                  width: progressCircleSize,
                  height: progressCircleSize,
                  borderRadius: progressCircleSize / 2,
                  borderWidth: strokeWidth,
                  borderColor: 'transparent',
                  borderBottomColor: ringColor,
                  opacity: completed === 3 ? 0.6 : 1,
                }}
              />
            )}

            {/* Show left border for 4+ servings */}
            {completed >= 4 && (
              <View
                style={{
                  position: 'absolute',
                  width: progressCircleSize,
                  height: progressCircleSize,
                  borderRadius: progressCircleSize / 2,
                  borderWidth: strokeWidth,
                  borderColor: 'transparent',
                  borderLeftColor: ringColor,
                  opacity: completed === 4 ? 0.6 : 1,
                }}
              />
            )}

            {/* For 5 servings, add a subtle additional indicator */}
            {completed === 5 && (
              <View
                style={{
                  position: 'absolute',
                  width: progressCircleSize * 0.9,
                  height: progressCircleSize * 0.9,
                  borderRadius: (progressCircleSize * 0.9) / 2,
                  borderWidth: strokeWidth / 4,
                  borderColor: 'transparent',
                  borderTopColor: ringColor,
                  top: strokeWidth / 2,
                  left: strokeWidth / 2,
                  opacity: 0.5,
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