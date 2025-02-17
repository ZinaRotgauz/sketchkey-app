import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function StartAgainScreen({ onYes, onNo }) {
    
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Want to create more</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={onYes}>
          <Text style={styles.buttonText}>Yes !</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onNo}>
          <Text style={styles.buttonText}>That’s it thanks</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight:'medium',
    marginBottom: 50,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
  },
});
