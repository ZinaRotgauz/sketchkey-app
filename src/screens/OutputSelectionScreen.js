import React from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {useState, useEffect, useCallback} from 'react';
import {MicrophoneIcon} from 'react-native-heroicons/solid';
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import { Image } from 'react-native';

export default function OutputSelectionScreen({onNext}) {
    // Track which output (“sketch” or “text”) the user selected
    const [selectedOutput, setSelectedOutput] = useState(null);

    // Show step 2 (“What style…”) only after choosing Sketch or Text
    const [showStyleStep, setShowStyleStep] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState(null); //track which style was chosen

    const styleImages= {
        Sketchy: require('../assests/Sketchy.png'),
        Flow: require('../assests/Flow.png'),
        Angle: require('../assests/Angle.png'),
        Handwritten: require('../assests/Handwritten.png')
    }

    const [micActive, setMicActive] = useState(false);

    const [showPromptStep, setShowPromptStep] = useState(false);
    const [prompt, setPrompt] = useState('');

    const {transcript, listening, resetTranscript, browserSupportsSpeechRecognition} = useSpeechRecognition();
    const [forceStopTimeout, setForceStopTimeout] = useState(null);

    useEffect(() => {
        console.log("🟢 Auto-starting speech recognition for Step 1...");
        SpeechRecognition.startListening({continuous: true, language: 'en-US'});
        setMicActive(true);

        // ✅ Set a timeout to force stop the mic after 5 seconds
        const timeout = setTimeout(() => {
            console.log("⏳ Auto-stopping microphone after 5 seconds...");
            SpeechRecognition.stopListening();
            setMicActive(false);
        }, 5000);

        setForceStopTimeout(timeout); // Save the timeout reference


        return () => {
            console.log("🔴 Cleaning up Step 1 - Stopping speech recognition...");
            SpeechRecognition.stopListening();
            setMicActive(false);
            clearTimeout(timeout);
            resetTranscript();
        };
    }, [resetTranscript]);

    useEffect(() => {
        // Only run this if user actually selected "sketch" => showStyleStep === true
        if (showStyleStep && !selectedStyle) {
            console.log('🟢 Auto-starting mic for Step 2 (style) ...');
            resetTranscript();
            SpeechRecognition.startListening({continuous: true, language: 'en-US'});
            setMicActive(true);

            const timeout = setTimeout(() => {
                console.log('⏳ Auto-stopping mic for Step 2 after 5s...');
                SpeechRecognition.stopListening();
                setMicActive(false);
            }, 5000);

            setForceStopTimeout(timeout);

            return () => {
                console.log('🔴 Cleaning up Step 2...');
                SpeechRecognition.stopListening();
                setMicActive(false);
                clearTimeout(timeout);
                resetTranscript();
            };
        }
    }, [showStyleStep, selectedStyle, resetTranscript]);

    const handleVoiceCommand = useCallback(
        (command) => {
            console.log('🎙 Recognized Command:', command);

            // STEP 1: If we haven't chosen an output yet
            if (!selectedOutput) {
                if (command.includes('sketch')) {
                    console.log("🖌 Voice selected 'Sketch'");
                    handleSelectOutput('sketch');
                } else if (command.includes('text')) {
                    console.log("✏️ Voice selected 'Text'");
                    handleSelectOutput('text');
                }
                // otherwise unrecognized
            }
            // STEP 2: If user chose "sketch" but style not selected
            else if (showStyleStep && !selectedStyle) {
                const styles = ['sketchy', 'flow', 'angle', 'handwritten'];
                const foundStyle = styles.find((s) => command.includes(s));
                if (foundStyle) {
                    console.log(`🎨 Voice selected '${foundStyle}'`);
                    handleSelectStyle(foundStyle);
                }
            }

            // Stop listening after we recognized something (or not)
            console.log('🎤 Stopping mic after recognition...');
            SpeechRecognition.stopListening();
            setMicActive(false);
            clearTimeout(forceStopTimeout);

            // Clear transcript so we don’t reuse old text
            resetTranscript();
        },
        [
            selectedOutput,
            selectedStyle,
            showStyleStep,
            forceStopTimeout,
            resetTranscript
        ]
    );

    useEffect(() => {
        console.log(`🎤 Listening: ${listening}`);
        console.log(`📢 Transcript: ${transcript}`);
        
        if(transcript.length>0) setPrompt(transcript);
        if (!listening && transcript) {
            handleVoiceCommand(transcript.toLowerCase().trim());
        }
    }, [transcript, listening, handleVoiceCommand]);

    function handleSelectOutput(type) {
        setSelectedOutput(type);

        if (type === 'text') {
            console.log("✏️ Voice selected 'Text'");
            setShowStyleStep(false);  // Hide styles for text
            setShowPromptStep(true);  // Directly show prompt
            setSelectedStyle(null);
        } else if (type === 'sketch') {
            console.log("🖌 Voice selected 'Sketch'");
            setShowStyleStep(true);   // Show styles first
            setShowPromptStep(false); // Don't show prompt yet
            setSelectedStyle(null);
        }
    }

    function handleSelectStyle(style) {
        console.log(`✅ Style chosen: ${style}`);
        setSelectedStyle(style);
        setShowPromptStep(true);
        setShowStyleStep(true);
    }

    function handleGenerate() {

        callPython(prompt, selectedStyle, selectedOutput)
        onNext()
    }

    async function callPython(a, b, c) {
        const output = b;
        const prompt = c;
        const style = a;
        try {
            const queryParams = new URLSearchParams({output, prompt, style}).toString();
            const res = await fetch(`http://localhost:3001/run-python?${queryParams}`);
            const data = await res.text();
            console.log("Response from Python:", data);
        } catch (err) {
            console.error("Error calling Python:", err);
        }
    }

    function handleMicPress() {
        resetTranscript();
        if (!micActive) {
            SpeechRecognition.startListening({continuous: true, language: 'en-US'});
        } else {
            SpeechRecognition.stopListening();
        }
        setMicActive(!micActive);
        SpeechRecognition.stopListening();
    }


    if (!browserSupportsSpeechRecognition) {
        return <Text style={styles.errorText}>Your browser does not support voice input.</Text>;
    }

    return (
        <View style={{minHeight: '50vh'}}>
            {/* Title */}
            <Text style={styles.mainHeading}>What is your goal for today</Text>

            {/* Step 1 */}
            <View style={styles.stepRow}>
                <View style={styles.stepCircle}>
                    <Text style={styles.stepNumber}>1</Text>
                </View>
                <Text style={styles.subHeading}>
                    Do you want to create an sketch or generate text
                </Text>
            </View>
            <View style={styles.outputRow}>
                <TouchableOpacity
                    style={[
                        styles.outputButton,
                        selectedOutput === 'sketch' && styles.outputButtonSelected
                    ]}
                    onPress={() => handleSelectOutput('sketch')}
                >
                    <Text style={styles.outputButtonText}>Sketch</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={true}
                    style={[
                        styles.outputButtontText,
                        selectedOutput === 'text' && styles.outputButtonSelected
                    ]}
                    onPress={() => handleSelectOutput('text')}
                >
                    <Text style={styles.outputButtonText}>Text</Text>
                </TouchableOpacity>
            </View>

            {/* Step 2 (shown only if user selected Sketch) */}
            {showStyleStep && (
                <>
                    <View style={styles.stepRow}>
                        <View style={styles.stepCircle}>
                            <Text style={styles.stepNumber}>2</Text>
                        </View>
                        <Text style={styles.subHeading}>What style do you prefer</Text>
                    </View>

                    <View style={styles.stylesRow}>
                        {['Sketchy', 'Flow', 'Angle', 'Handwritten'].map((style) => (
                            <TouchableOpacity
                                key={style}
                                style={[
                                    styles.styleBox,
                                    selectedStyle === style && styles.styleBoxSelected
                                ]}
                                onPress={() => handleSelectStyle(style)}
                            ><Image source={styleImages[style]} style={styles.styleImage}>

                            </Image>
                                <Text style={{fontSize: 18}}>{style}</Text>
                            </TouchableOpacity>
                            
                        ))}
                    </View>
                </>
            )}
            {showPromptStep && (
                <>
                    <View style={styles.stepRow}>
                        <View style={styles.stepCircle}>
                            <Text style={styles.stepNumber}>{selectedOutput === 'text' ? '2' : '3'}</Text>
                        </View>
                        <Text style={styles.subHeading}>
                            {selectedOutput === 'text' ? 'Now it’s time for your ideas! Tell Us your ideas on writing' : 'Now it’s time for your ideas! \n Tell Us what art object you want to see, be creative and detailed'}

                        </Text>
                    </View>

                    <View style={styles.promptRow}>
                        {/* Microphone button (tap to toggle green) */}
                        <TouchableOpacity
                            style={micActive ? styles.micButtonActive : styles.micButton}
                            onPress={handleMicPress}
                        >
                            <MicrophoneIcon color={micActive ? '#48742C' : '#B2A8D2'} size={50}/>
                        </TouchableOpacity>

                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 'A smiley cat' or 'A flower pattern'"
                            value={prompt}
                            onChangeText={setPrompt}
                        />
                    </View>
                    <View style={styles.promptRow}>
                        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
                            <Text style={styles.generateButtonText}>Generate</Text>
                        </TouchableOpacity>
                    </View>
                    
                </>
            )}

        </View>
    );
}

const styles = StyleSheet.create({

    mainHeading: {
        fontSize: 56,
        marginBottom: 35,
        textAlign: 'center',
        fontWeight: 'medium'
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal:'3em'
    },
    micButton: {
        marginVertical: 12,
        backgroundColor: '#FCF0FB',
        borderRadius: 100,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '10em',
        height: '10em'
    },
    micButtonActive: {
        marginVertical: 12,
        backgroundColor: '#C4F8B1',
        borderRadius: 100,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '10em',
        height: '10em'
    },
    stepCircle: {
        width: 70,
        height: 70,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'silver',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    stepNumber: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subHeading: {
        fontSize: 30,
        paddingHorizontal: '1em',
        marginTop:'1em'
    },
    outputRow: {
        flexDirection: 'row',
        marginVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    outputButton: {
        backgroundColor: '#ccc',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 24,
        marginHorizontal: 10,
        height: '3em',
        width: '7em',
        alignItems: 'center'
    },
    outputButtontText: {
        backgroundColor: '#E8E5E4',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 24,
        marginHorizontal: 10,
        height: '3em',
        width: '7em',
        alignItems: 'center',
        opacity: '0.5'
    },
    outputButtonSelected: {
        backgroundColor: '#bbb',
    },
    outputButtonText: {
        fontSize: 20,
    },
    stylesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
        marginHorizontal: 50,
        paddingHorizontal: '7em',
        
    },
    styleBox: {
        width: '10em',
        height: '10em',
        backgroundColor: '#eee',
        marginHorizontal: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18
    },
    styleBoxSelected:{
        backgroundColor: '#bbb',
    },
    styleImage: {
        width: 90,
        height: 90,
        marginBottom: 20
    },
    promptRow: {
        flexDirection: 'column',
        marginVertical: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        width: 220,
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    generateButton: {
        backgroundColor: '#ccc',
        borderRadius: 25,
        width: '20em',
        height: 'em',
        paddingVertical: 12,
        paddingHorizontal: 22,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    generateButtonText: {
        fontSize: 36,
    },
    continueButton: {
        backgroundColor: '#ccc',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginHorizontal: '20em',
        alignItems: 'center',
        justifyContent: 'center'
    },
    continueButtonText: {
        fontSize: 16,
        textAlign: 'center',
    },
});