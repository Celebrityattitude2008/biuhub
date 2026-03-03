// --- 1. STATE MANAGEMENT ---
let lastTopic = null; 
let memoryTimer = null;

// --- 2. THE MAIN BRAIN (Fixed: All entries are now Arrays to prevent character-splitting errors) ---
const localBrain = {
    // GREETINGS & IDENTITY
    "hi": ["Hey there! Ready to crush some courses today?", "Yo! What's the move for today?", "Greetings! How can I help you today?"],
    "hello": ["Hi! I'm the BIU Hub assistant. How can I help you navigate campus life?", "Hello! Looking for something specific on the Hub?"],
    "hey": ["Hey! What's on your mind? I'm here to help you out.", "Hey! How's the semester going?"],
    "good morning": ["Good morning! Grab some breakfast and let's get this degree.", "Morning! Ready for those 8 AMs?"],
    "who are you": ["I'm the BIU Student Hub AI. Think of me as your digital guide to CGPA, past questions, and campus survival."],
    "help": ["I can help with: 1. CGPA Calculations, 2. Library resources, 3. School fees, 4. Hostels. What do you need?"],

    // ACADEMICS
    "cgpa": ["BIU uses a 5.0 scale. To stay on First Class, you need a 4.50+. 2.1 is 3.50-4.49. Keep grinding!", "Aiming for a 5.0? You've got this!"],
    "grading": ["Our grading system: A(70-100)=5pts, B(60-69)=4pts, C(50-59)=3pts, D(45-49)=2pts, E(40-44)=1pt, F(0-39)=0pts."],
    "gpa": ["Your GPA is for one semester, while CGPA is the average of all semesters combined. Use our calculator to see your projected score!"],
    "carryover": ["Don't panic! A carry-over just means you have to retake the course. Focus on your current courses and clear it next time."],
    "it": ["Industrial Training (IT) usually happens in 300L or 400L depending on your department. Start looking for a firm early!"],
    "probation": ["If your CGPA falls below 1.50, you might be placed on academic probation. Use the hub to find study partners and level up!"],
    "result": ["Results are typically uploaded to the portal after Senate approval. Keep checking portal.biu.edu.ng."],
    "timetable": ["Timetables are usually distributed by course reps or posted on notice boards. Don't miss those 8 AMs!"],
    "exam": ["Exam season? Head to the Library section of this hub to download past questions and start prepping early."],
    "assignment": ["Stuck? Check the Hub's discussion board to see if your coursemates are brainstorming, or ask the Study AI."],
    "library": ["The University Library is the best place for deep work. It usually opens 8 AM - 9 PM. Remember, silence is golden!"],
    "fees": ["School fees should be paid through the official portal. Always save your transaction reference!", "Make sure you use portal.biu.edu.ng for all fee payments."],

    // DEPARTMENTS & FACULTIES
    "law": ["The Faculty of Law (Legacy Campus) is one of our pride and joys. Keep those robes clean and your cases sharp!"],
    "engineering": ["The Faculty of Engineering is located at the main campus. Future builders of Nigeria!"],
    "science": ["Shoutout to the Faculty of Science! From Microbiology to Computer Science, you guys are the backbone of innovation."],
    "social science": ["Economics, Mass Comm, Sociology... The Faculty of Social Sciences is always buzzing with energy."],
    "agriculture": ["Faculty of Agriculture! Feeding the nation and driving sustainable innovation. Keep up the great work."],

    // CAMPUS LOGISTICS
    "portal": ["The official portal for course registration and result checking is: https://portal.biu.edu.ng"],
    "hostel": ["Issues with your room? Visit the Student Affairs office or speak with your Hall Warden immediately."],
    "chapel": ["Chapel attendance is mandatory and vital for your growth. Check your student handbook for required credits."],
    "health center": ["The clinic is open 24/7 for students. If you're feeling unwell, don't wait—go get checked out."],
    "clinic": ["The university clinic is available 24/7. Your health comes first, please visit them if you feel sick."],
    "security": ["Stay safe! The security post is always manned. Report emergencies to the nearest officer or warden."],
    "wifi": ["Campus Wi-Fi details are usually provided during clearance. If your login fails, visit the ICT center."],

    // MONEY & FEES
    "bursary": ["The Bursary office handles all financial clearances. Make sure you get your official receipts after payment."],
    "clearance": ["Financial and academic clearance is required before exams. Start early to avoid the long queues!"],
    "scholarship": ["BIU offers various scholarships. Check the Student Affairs office for merit-based or founder's scholarship requirements."],
    "payment proof": ["Take a clear photo of your bank teller or screenshot your transfer and upload it to the 'Verify' section."],

    // FOOD & LIFESTYLE
    "food": ["Hungry? You've got the Cafeteria, the Buttery, and various kiosks. Don't skip breakfast!"],
    "buttery": ["The buttery is the go-to for quick snacks and drinks. Perfect for late-night study cravings."],
    "shuttle": ["Campus shuttles run between Heritage and Legacy campuses. Keep some change handy for the fare."],
    "clothes": ["Remember the BIU dress code! Modesty and professionalism are the standards here."],
    "stressed": ["Uni can be overwhelming. It's okay to feel stressed. Take a breather or visit the counseling unit."],
    "tired": ["Burnout is real. Rest is productive too! Make sure you are drinking water and sleeping."],

    // SMALL TALK
    "how are you": ["I'm functioning at 100%! Ready to help you graduate with honors.", "I'm great! Just processing data and waiting for your questions."],
    "thanks": ["You're welcome! Go make BIU proud.", "No problem at all! Anything else?"],
    "cool": ["I know, right? I try my best.", "Glad you think so!"],
    "benson idahosa": ["Archbishop Benson Idahosa was a pioneer of faith. He wanted leaders with 'Fire in their bones'!"],

    // TECH SUPPORT
    "developer": ["This Hub was built by Paul Adamu to make BIU life easier for everyone."],
    "errors": ["If you find a bug, please report it to the admin via the contact section."],
    "offline": ["If I'm acting slow, it might be your network. Try refreshing the page!"]
};

// --- 3. CONTEXT BRAIN (For follow-up questions) ---
const contextBrain = {
    "library": {
        "location": "The main library is centrally located, easily accessible from most faculties.",
        "time": "It's open from 8 AM to 9 PM on weekdays.",
        "link": "Check the 'Library' tab on this Hub for digital resources!"
    },
    "fees": {
        "location": "The Bursary office is in the Administration block for physical inquiries.",
        "time": "Payments are open 24/7 on the portal, but try to pay before exams!",
        "link": "https://portal.biu.edu.ng"
    },
    "clinic": {
        "location": "The University Health Center is located near the student hostels.",
        "time": "The clinic is open 24/7 for emergencies.",
        "link": "Report to your warden if it's a late-night emergency."
    }
};

// --- 4. THE CORE LOGIC ENGINE ---
function getBotResponse(userInput) {
    // Clean input: lowercase, trim, and remove punctuation for better matching
    const input = userInput.toLowerCase().replace(/[?.,!]/g, "").trim();
    
    // A. Reset the 2-minute Inactivity Timer
    clearTimeout(memoryTimer);
    memoryTimer = setTimeout(() => {
        lastTopic = null;
        console.log("Context Reset: Bot forgot previous topic.");
    }, 120000); 

    // B. Check for Contextual Follow-ups (Where, When, How)
    if (lastTopic && contextBrain[lastTopic]) {
        if (input.includes("where") || input.includes("location") || input.includes("address")) {
            return contextBrain[lastTopic].location;
        }
        if (input.includes("when") || input.includes("time") || input.includes("open") || input.includes("close")) {
            return contextBrain[lastTopic].time;
        }
        if (input.includes("link") || input.includes("website") || input.includes("url")) {
            return `You can find more here: ${contextBrain[lastTopic].link}`;
        }
    }

    // C. Keyword Search Logic with Variety
    for (let key in localBrain) {
        if (input.includes(key)) {
            lastTopic = key; // Save topic for context
            
            const responses = localBrain[key];
            // Pick a random response from the array
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    // D. Fallback if no keywords are found
    return "I'm not quite sure about that yet. Try asking about 'CGPA', 'Library', or 'Fees', or check the Student Affairs office!";
}