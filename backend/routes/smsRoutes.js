// backend/routes/smsRoutes.js (FIXED RAW AXIOS IMPLEMENTATION)
const express = require("express");
const router = express.Router();
const axios = require("axios");

// Example: send SMS
router.post("/send", async (req, res) => {
    // This line is CORRECT and looks for 'mobile'
    const { mobile, message } = req.body; 

    // ... (rest of the configuration and logic is fine)
    
    try {
        // ...
        const requestBody = {
            // This is CORRECT
            To: mobile, 
            From: SENDER_ID, 
            Body: message 
        };
        // ...
    } catch (err) {
        // ...
    }
});

module.exports = router;