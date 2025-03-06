

// //This funtion is for voice recognition

// export const startVoiceRecognition = (setTranscript, onSpeechDetected) => {

//     //this is used for voice recognition 
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert("Your browser does not support Speech Recognition.");
//       return;
//     }
//     //this create a new instance of recognation 
//     const recognition = new SpeechRecognition();

//     //set the language to english 
//     recognition.lang = "en-US"; 

//     //start lisining to user
//     recognition.start();
  
//     //this event lisner is trigger while user stop talking 
//     recognition.onresult = async (event) => {
//       const spokenText = event.results[0][0].transcript; // Get recognized text
//       setTranscript(spokenText); // Update UI or state

       

//         // this is used for the api call to wit ai using the spokentext
//       if (onSpeechDetected) {
//         onSpeechDetected(spokenText);
//       }
//     };
  
        
    
//         //for any error in voice recognition
//     recognition.onerror = (event) => {
//       console.error("Speech Recognition Error:", event.error);
//       setTranscript("Error occurred, try again.");
//     };
//   };
  


  //this funtion is user for api call and return the response
  export const sendToWitAI = async (text, witAccessToken) => {
    try {
      const response = await fetch(`https://api.wit.ai/message?v=20230222&q=${encodeURIComponent(text)}`, {
        headers: { Authorization: `Bearer ${witAccessToken}` }
      });
  
      const data = await response.json();
      console.log("Wit.ai Response:", data);
      return data; 
    } catch (error) {
      console.error("Error calling Wit.ai:", error);
      return null;
    }
  };





export const startVoiceRecognition = () => {
  return new Promise((resolve, reject) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      reject("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // Set language

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript; // Extract spoken text
      resolve(spokenText); // Return the text using Promise
    };

    recognition.onerror = (event) => {
      reject(`Speech Recognition Error: ${event.error}`);
    };

    recognition.start(); // Start listening
  });
};
