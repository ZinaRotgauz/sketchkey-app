import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function WelcomeScreen({ onNext }) {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Let’s create together</Text>
        <Text style={styles.subheader}>
          Hi, I am SketchKey! I will help you make your ideas come true
        </Text>
        <TouchableOpacity style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>Let’s start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#E69C6D',
        alignItems: 'center',
        justifyContent: 'center',
        
      },
      /** White card centered in the middle */
      card: {
        backgroundColor: '#FFF',
        width: 'full',
        paddingVertical: 40,
        paddingHorizontal: 60,
        alignItems: 'center',
        minHeight:'50vh',
        justifyContent: 'center',
      },
      title: {
        fontSize: 48,
        marginBottom: 24,
        fontWeight: 'semi-bold'
        
      },
      subheader: {
        fontSize: 30,
        marginBottom: 24,
        textAlign: 'center',
        fontWeight: 'thin'
      },
      button: {
        marginTop:'5em',
        backgroundColor: '#F3C6A2',
        borderRadius: 40,
        paddingVertical: 12,
        paddingHorizontal: 24,
        width: '15em',
        height: '5em',
        alignItems: 'center',
        justifyContent: 'center'
      },
      buttonText: {
        fontSize: 24,
        fontWeight:'medium',
      },
});
