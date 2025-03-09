import { useState } from "react";
import { startVoiceRecognition, sendToWitAI } from "../../useVoice";
import styles from "./style"; // Import the styles
import {useContext} from "react"
import { expenseTrackerContex } from '../../Context/Context'

export default function Voicebutton() {
    const witAccessToken = "ZSBSXUG25Q3ZCRVZAYPOB6MG3KEXP4YL";
    const intialstate={
        amount:"",
        category:"",
        type:"",
        date:new Date()
      }
    const [state,setstate]=useState(intialstate);
    const {addTransaction}=useContext(expenseTrackerContex);
    const [transcript, setTranscript] = useState("Click the button and speak...");
    const handleSpeechDetected = async (spokenText) => {
        const data = await sendToWitAI(spokenText, witAccessToken);
        console.log("Processed by Wit.ai:", data);
        const type =data.entities["Type:Type"]?.[0]?.value; // "income"
        const amount =data.entities["amount:amount"]?.[0]?.value; // "50"
        const category = data.entities["catagory:catagory"]?.[0]?.value; // "Bill"

        console.log("Type:", type);
        console.log("Amount:", amount);
        console.log("Category:", category);


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
