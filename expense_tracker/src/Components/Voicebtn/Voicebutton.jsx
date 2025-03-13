
import { useState } from "react";
import { startVoiceRecognition, extractTransactionDetails } from "../../useVoice";
import styles from "./style"; 
import {useContext} from "react"
import { expenseTrackerContex } from '../../Context/Context'
import {v4 as uuidv4} from 'uuid';

export default function Voicebutton() {
   
    const {addTransaction,transaction}=useContext(expenseTrackerContex);
    
    
    const [transcript, setTranscript] = useState("working on this feature is on , till then add manually");
    const handleSpeechDetected = async (spokenText) => {
        const data = await extractTransactionDetails(spokenText);
        // console.log("Processed by gemini:", data);

        const transaction={
          id:uuidv4(),
          amount:Number(data.amount),
          category:data.category,
          type:data.type,
          date:data.date
        }
        // console.log(transaction);
        
        addTransaction(transaction);
        
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
