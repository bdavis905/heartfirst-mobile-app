import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

interface GreensRingProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  completed: number;
  goal: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function GreensRingProgress({ 
  progress, 
  size = 200, 
  strokeWidth = 16,
  completed,
  goal 
}: GreensRingProgressProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const circleRef = useRef<any>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const center = size / 2;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      if (circleRef.current) {
        const strokeDashoffset = circumference - (circumference * value) / 100;
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });

    return () => animatedValue.removeListener(listener);
  }, [circumference]);

  const isComplete = completed >= goal;
  const ringColor = isComplete ? '#2ECC71' : '#16A085';
  const glowColor = isComplete ? '#2ECC7130' : '#16A08530';

  return (
    <View className="items-center justify-center">
      <View style={{ width: size, height: size }} className="items-center justify-center">
        <Svg width={size} height={size} className="absolute">
          <G rotation="-90" origin={`${center}, ${center}`}>
            {/* Background Circle */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#ECF0F1"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            
            {/* Progress Circle */}
            <AnimatedCircle
              ref={circleRef}
              cx={center}
              cy={center}
              r={radius}
              stroke={ringColor}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0px 0px 8px ${glowColor})`,
              }}
            />
          </G>
        </Svg>

        {/* Center Content */}
        <View className="absolute items-center justify-center">
          <Text
            className="font-light text-center"
            style={{
              color: ringColor,
              fontSize: 48,
              lineHeight: 56,
              letterSpacing: -1,
            }}
          >
            {completed}
          </Text>
          <Text
            className="font-medium text-center"
            style={{
              color: '#7F8C8D',
              fontSize: 16,
              lineHeight: 20,
              letterSpacing: 0.1,
              marginTop: -4,
            }}
          >
            of {goal}
          </Text>
          <Text
            className="font-medium text-center"
            style={{
              color: '#95A5A6',
              fontSize: 12,
              lineHeight: 16,
              letterSpacing: 0.2,
            }}
          >
            servings
          </Text>
          
          {isComplete && (
            <View className="mt-2">
              <Text
                className="font-semibold text-center"
                style={{
                  color: '#2ECC71',
                  fontSize: 14,
                  lineHeight: 18,
                  letterSpacing: 0.1,
                }}
              >
                Goal Complete! 🎉
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Progress Percentage */}
      <View className="mt-4">
        <Text
          className="font-semibold text-center"
          style={{
            color: '#2C3E50',
            fontSize: 24,
            lineHeight: 30,
            letterSpacing: -0.2,
          }}
        >
          {progress}%
        </Text>
        <Text
          className="font-medium text-center"
          style={{
            color: '#7F8C8D',
            fontSize: 14,
            lineHeight: 18,
            letterSpacing: 0.1,
          }}
        >
          Daily Progress
        </Text>
      </View>
    </View>
  );
}