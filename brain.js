// --- 1. STATE MANAGEMENT ---
let lastTopic = null; 
let memoryTimer = null;

// --- 2. THE MAIN BRAIN (With Variety Arrays) ---
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
    "library": ["The University Library is the best place for deep work. It usually opens 8 AM - 9 PM. Remember, silence is golden!"],
    "fees": ["School fees should be paid through the official portal. Always save your transaction reference!", "Make sure you use portal.biu.edu.ng for all fee payments."],
    "result": ["Results are typically uploaded to the portal after Senate approval. Keep checking portal.biu.edu.ng."],
    
    // SMALL TALK (Added for "Chat-like" feel)
    "how are you": ["I'm functioning at 100%! Ready to help you graduate with honors.", "I'm great! Just processing data and waiting for your questions."],
    "thanks": ["You're welcome! Go make BIU proud.", "No problem at all! Anything else?"],
    "cool": ["I know, right? I try my best.", "Glad you think so!"],

    // --- DEPARTMENTS & FACULTIES ---

    "law": "The Faculty of Law (Legacy Campus) is one of our pride and joys. Keep those robes clean and your cases sharp!",

    "engineering": "The Faculty of Engineering is located at the main campus. Future builders of Nigeria!",

    "science": "Shoutout to the Faculty of Science! From Microbiology to Computer Science, you guys are the backbone of innovation.",

    "social science": "Economics, Mass Comm, Sociology... The Faculty of Social Sciences is always buzzing with energy.",

    "agriculture": "Faculty of Agriculture! Feeding the nation and driving sustainable innovation. Keep up the great work.",

    // --- FOOD, LIFESTYLE & WELLNESS ---

    "food": "Hungry? You've got the Cafeteria, the Buttery, and various kiosks around the hostels. Don't skip breakfast before an 8 AM class!",

    "buttery": "The buttery is the go-to for quick snacks and drinks. Perfect for those late-night study cravings.",

    "shuttle": "Campus shuttles run between the Heritage and Legacy campuses. Keep some change handy for the fare.",

    "clothes": "Remember the BIU dress code! Modesty and professionalism are the standards here. Check your handbook for specifics.",

    "sports": "Need a break from books? Check out the sports complex for football, basketball, and other activities to keep you active.",

    "stressed": "University can be overwhelming. It's okay to feel stressed. Take a breather, talk to a friend, or visit the counseling unit at Student Affairs.",

    "tired": "Burnout is real. Make sure you are drinking water, getting enough sleep, and not just living on snacks. Rest is productive too!",

    // --- THE BIU LEGACY ---

    "benson idahosa": "Archbishop Benson Idahosa was a pioneer of faith. His vision for BIU was to produce leaders with 'Fire in their bones and a vision in their spirits.'",

    "vision": "BIU's vision is to be a leading Christian university known for academic excellence and godly character.",

    "motto": "The BIU motto: 'Academic Excellence with Godly Character.'",

    // --- TECH SUPPORT & HUB INFO ---

    "developer": "This Hub was built by Paul Adamu to make BIU life easier for everyone.",

    "errors": "If you find a bug or something isn't working, please report it to the admin via the contact section.",

    "how to use": "Click on the GPA tab to calculate your score, the Library tab for materials, or just chat with me here!",

    "offline": "If I'm acting slow, it might be your network. Try refreshing the page!",

    "password": "Forgot a password? For the Hub, use the reset link on the login page. For the BIU Portal, you'll need to use the portal's recovery option or visit ICT.",

    "admission": "For admission inquiries, visit the admissions office at the Heritage campus or check the main BIU website.",

    "id card": "Lost your ID card? Report it to Student Affairs and Security immediately so they can process a replacement.",

    "wifi": "Campus Wi-Fi details are usually provided during clearance. If your login isn't working, visit the ICT center.",
};

// --- 3. CONTEXT BRAIN (For follow-up questions) ---
// This stores specific details for "Where is it?" or "When?"
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
    const input = userInput.toLowerCase().trim();
    
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
    return "I'm not quite sure about that yet. Try asking about 'CGPA', 'Library', or 'Fees', or visit the Student Affairs office!";
}