import { GoogleGenerativeAI } from "@google/generative-ai";

const apikey = "AIzaSyBAbgG_-phkCUZm2NHfQie2owigiM0H2Gw";
const genAI = new GoogleGenerativeAI(apikey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
    You are an AI assistant that extracts structured transaction details from a given text. Your task is to identify the type, category, amount, and date of the transaction, along with generating a unique ID. 

    Follow these guidelines:

    - **Type:** Identify whether the transaction is "income" or "expense".  
    - **Category:** Extract the category mentioned (e.g., "business", "food", "entertainment", etc.).  
    - **Amount:** Extract the numerical value representing the transaction amount. If the currency is mentioned, ignore it but retain the numeric value.  
    - **Date:** If a date is mentioned, use it. If no date is provided, use the current date. Format the date as "YYYY-MM-DD".  
    - **Unique ID:** Generate a random alphanumeric string of 10 characters for each transaction.  

    Return only a valid JSON object with no extra formatting.
  `
});

  //this funtion is user for api call and return the response
  export async function extractTransactionDetails(prompt) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response.text(); 
      const cleanedResponse = response.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanedResponse); 
    } catch (error) {
      console.error("Error generating content:", error);
      return null;
    }
  }





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
