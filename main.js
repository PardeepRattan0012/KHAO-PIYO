import { GoogleGenerativeAI } from "@google/generative-ai";

const businessInfo = `
Drinks
MOJITO: Our classic drink of lemon Soda - ₹100.99
Shakes: Extra creamy shakes of different flavour - ₹21.99
Chai: Different types of chai with herbal ingredients - ₹39.99
Coffee: Enjoy different types of Coffee like cold, hot etc. - ₹50
Burgers & Sandwiches
Zinger Burger: Spicy, crispy fillet with lettuce and special sauce - ₹40.99
Double Down: Bacon, sauce and cheese between fillets - ₹100.99
Tower Burger: Zinger fillet with hash brown, cheese, lettuce and tomato - ₹150.99
Sides & Snacks
Mashed Potatoes: Creamy mashed potatoes with our signature gravy - ₹30.99
Coleslaw: Fresh, crispy, and creamy classic coleslaw - ₹320.49
Fries: Golden, crispy French fries - ₹220.99
Corn on the Cob: Sweet corn, buttered to perfection - ₹223.29
Your Favorite KHAO PIYO Locations 

LPU Oven Express:
Address: Front LPU Food Court
Description: Your most frequently visited Khao Piyo location!
Recent Orders:
Original Recipe Bucket + Coleslaw (Feb 28, 2025)
Zinger Burger Combo (Feb 15, 2025)
Family Feast (Jan 22, 2025)
Best for Mood: When you’re in a hurry or want something familiar and convenient (frequently visited location).
BUZZ:
Address: Near Apartment, LPU
Description: One of your favorite weekend spots!
Recent Orders:
Hot & Spicy gravy + Fries (Mar 2, 2025)
Double Down Combo (Jan 31, 2025)
Best for Mood: When you’re feeling relaxed or want a weekend vibe (highlighted as a weekend spot).
Kitchen Itte:
Address: Near Apartment, LPU
Description: Perfect for thalli's!
Recent Orders:
Zinger Tower Meal (Feb 20, 2025)
3pc Strips + Mashed Potatoes (Jan 15, 2025)
Popcorn Box (Dec 28, 2024)
Best for Mood: When you’re craving a specific meal like thalli or want something unique (specialty noted in description).

"In a hurry? Try LPU Oven Express—it’s your go-to spot!"
"Feeling relaxed this weekend? Head to BUZZ for a great vibe."
"Craving thalli? Kitchen Itte is perfect for you!"
Special Deals

Family Deal: 16 pieces of Burgers, 4 large sides, and 8 biscuits - ₹440.99
Lunch Special: 2 pieces of Burger, 1 side, and a drink - ₹300.99
Game Day Bundle: 20 Hot Wings, 8 pieces of Burgers, and 2 large sides - ₹350.99

Locations
The "Locations" section provides a comprehensive list of all Khao Piyo outlets, including addresses, phone numbers, and operating hours. This allows the chatbot to assist users in finding nearby locations or checking hours.

LPU Food Court:
Address: 123 Main Street, City Center
Phone: 123123-4567
Hours: 10 AM - 11 PM Daily
Jalandhar Cantt Chaupati:
Address: Jalandhar Cantt, near Lovely Sweets
Phone: 2345234-5678
Hours: 10 AM - 12 AM Daily
Eastwood Village:
Address: Jalandhar - Phagwara Highway
Phone: 555345-6789
Hours: 10 AM - 10 PM Daily
Kitchen Itte:
Address: LPU Food Court, Near Apartment
Phone: 102456-7890
Hours: 10 AM - 11 PM Daily
Oven Express:
Address: LPU Food Court, Near Front Gate
Phone: 555567-8901
Hours: 10 AM - 10 PM Daily
Bee Burg:
Address: Rama Mandi, Near Green Valley
Phone: 555678-9012
Hours: 9 AM - 9 PM Daily

Our Story

Our Story:
KHAO PIYO was founded by two students of LPU (PARDEEP RATTAN, ISHAN ARORA), an entrepreneur who began selling food from his roadside restaurant in LPU and Jalandhar, during the Great Depression. The idea of this website is inspired by our real-life incidents. KHAO PIYO popularized in the fast-food industry, diversifying the market by challenging the established dominance of the hamburger.
Our Mission:
At KHAO PIYO, our mission is to spread the joy of our world-famous foods to food lovers everywhere. We strive to:
Serve high-quality, great-tasting food at affordable prices
Provide exceptional customer service in a clean, welcoming environment
Be a positive force in our communities through job creation and community involvement
Our Commitment to Quality:
Every KHAO PIYO meal is prepared with real items, raised by trusted farmers who follow our strict quality and welfare standards. Our food is freshly prepared in-store by trained cooks. We're proud to say that we still follow hygiene and the best practices for pure items for our food.
`;

const API_KEY = "AIzaSyAaiwPcPoNTsFejtkAfcEhLpoWxYV-mNrk";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: businessInfo
});

let messages = {
    history: [],
}

async function sendMessage() {

    console.log(messages);
    const userMessage = document.querySelector(".chat-window input").value;
    
    if (userMessage.length) {

        try {
            document.querySelector(".chat-window input").value = "";
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="user">
                    <p>${userMessage}</p>
                </div>
            `);

            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="loader"></div>
            `);

            const chat = model.startChat(messages);

            let result = await chat.sendMessageStream(userMessage);
            
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="model">
                    <p></p>
                </div>
            `);
            
            let modelMessages = '';

            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              modelMessages = document.querySelectorAll(".chat-window .chat div.model");
              modelMessages[modelMessages.length - 1].querySelector("p").insertAdjacentHTML("beforeend",`
                ${chunkText}
            `);
            }

            messages.history.push({
                role: "user",
                parts: [{ text: userMessage }],
            });

            messages.history.push({
                role: "model",
                parts: [{ text: modelMessages[modelMessages.length - 1].querySelector("p").innerHTML }],
            });

        } catch (error) {
            console.error("Error sending message:", error);
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="error">
                    <p>The message could not be sent. Please try again.</p>
                </div>
            `);
        }

        document.querySelector(".chat-window .chat .loader").remove();
        
    }
}

document.querySelector(".chat-window .input-area button")
.addEventListener("click", ()=>sendMessage());

document.querySelector(".chat-button")
.addEventListener("click", ()=>{
    document.querySelector("body").classList.add("chat-open");
});

document.querySelector(".chat-window button.close")
.addEventListener("click", ()=>{
    document.querySelector("body").classList.remove("chat-open");
});

