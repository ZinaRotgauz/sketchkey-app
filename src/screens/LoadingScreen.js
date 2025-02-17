import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

export default function LoadingScreen({ onNext }) {
  const [loading, setLoading] = useState(true);
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    // 30-second loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 30000);

    // Animate progress bar from 0% to 100% in 30 seconds
    Animated.timing(progress, {
      toValue: 1,
      duration: 30000,
      useNativeDriver: false,
    }).start();

    return () => clearTimeout(timer);
  }, [progress]);

  // Interpolate the width from 0% to 100%
  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  function handlePerfect() {
    onNext();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your ideas being executed</Text>

      {/* Grey progress bar container */}
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBarFill,
            { width: progressWidth },
          ]}
        />
      </View>

      <Text style={styles.loadingText}>{loading ? 'Loading your commands...' : 'Picture is loaded. '}</Text>
      <Text style={styles.loadingText}>{loading ? '' : ' SketchKey starts to draw!'}</Text>

      {/* "Continue" button is disabled if loading = true */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handlePerfect}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth:'100vh'
  },
  title: {
    fontSize: 40,
    marginBottom: 20,
  },
  progressBarContainer: {
    width: 600,
    height: 20,
    backgroundColor: '#D3D3D3', // Light grey container
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 30,
    marginTop: 30,
    padding: 2
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#E69C6D', // Orange progress bar
    borderRadius: 10,
  },
  loadingText: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 36,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
