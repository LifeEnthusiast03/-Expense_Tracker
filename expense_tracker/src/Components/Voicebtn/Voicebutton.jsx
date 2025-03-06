import { useState } from "react";
import { startVoiceRecognition, sendToWitAI } from "../../useVoice";
import styles from "./style"; // Import the styles

export default function Voicebutton() {
    const witAccessToken = "ZSBSXUG25Q3ZCRVZAYPOB6MG3KEXP4YL";
    const [transcript, setTranscript] = useState("Click the button and speak...");
    const handleSpeechDetected = async (spokenText) => {
        const witResponse = await sendToWitAI(spokenText, witAccessToken);
        console.log("Processed by Wit.ai:", witResponse);
        // Extracting intent
    const intent = witResponse?.intents?.[0]?.name;
    console.log("Intent:", intent); // Example: "add_expense"

    // Extracting amount
    const amount = witResponse?.entities?.amount?.[0]?.value;
    console.log("Amount:", amount); // Example: 500

    // Extracting category
    const category = witResponse?.entities?.category?.[0]?.value;
    console.log("Category:", category); // Example: "food"
        
    };


    const handleStartListening = async () => {
        try {
          const text = await startVoiceRecognition();
          console.log("You said:", text);
          setTranscript(text);
          handleSpeechDetected(text);
        } catch (error) {
          console.error(error);
        }
      };





    return (
        <div >
           
            <button 
                onClick={handleStartListening}
                style={styles.button}
            >
                Start Listening
            </button>
            <p style={styles.text}>{transcript}</p>
        </div>
    );
}
