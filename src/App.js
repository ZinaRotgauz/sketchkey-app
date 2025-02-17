import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import WelcomeScreen from './screens/WelcomeScreen';
import LoadingScreen from './screens/LoadingScreen'
import OutputSelectionScreen from './screens/OutputSelectionScreen'
import StartAgainScreen from './screens/StartAgainScreen'

// etc.

export default function App() {
  const [step, setStep] = useState(0);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(0, prev - 1));
  const onYes = () => setStep(1);
  const onNo = () => setStep(0);
  
  

  let content;
  switch (step) {
    case 0:
      content = <WelcomeScreen onNext={nextStep} />;
      break;
    case 1:
      content = <OutputSelectionScreen  onNext={nextStep} onBack={prevStep} />;
      break;
    
    case 2:
      content = <LoadingScreen   onNext={nextStep} onBack={prevStep} />;
      break;
    case 3:
      content = <StartAgainScreen onYes={onYes} onNo={onNo} />;
      break;
    default:
      content = <WelcomeScreen onNext={nextStep} />;
  }

  return <View style={styles.outerContainer}><View style={styles.card}>{content}</View></View>;
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#E69C6D',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px',
    margin:'0',
    minHeight:'100vh'
  },
  /** Centered white “card” for consistent layout across screens */
  card: {
    backgroundColor: '#FFF',
    maxWidth: '90vh',
    paddingVertical: 30,
    paddingHorizontal: 50,
    borderRadius: 12,
    minheight: '50vh'
  },
});
