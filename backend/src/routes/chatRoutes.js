const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const axios = require('axios');
const User = require('../models/User');

// Models to try (Standard + Experimental)
const MODELS_TO_TRY = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-1.5-flash"
];

router.post('/', auth, async(req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ msg: "Message is required" });
    }

    try {
        // 1. Get User Data
        const userId = req.user.id;
        const user = await User.findById(userId);

        // 2. Prepare Prompt
        const contextPrompt = "System Context: You are the RationX Assistant. " +
            "User: " + user.name + ". " +
            "Quota: Rice " + (user.remainingQuota ? user.remainingQuota.riceKg : 0) + "kg, " +
            "Wheat " + (user.remainingQuota ? user.remainingQuota.wheatKg : 0) + "kg. " +
            "Last Ration: " + (user.lastDistributionMonth || "None") + ". " +
            "User Question: " + message + ". " +
            "Instructions: Answer based on the quota above. Keep it short.";

        const apiKey = process.env.GEMINI_API_KEY;
        let botReply = null;

        // 3. Loop through models until one works
        for (let i = 0; i < MODELS_TO_TRY.length; i++) {
            const modelName = MODELS_TO_TRY[i];
            try {
                console.log("Trying model: " + modelName);

                const url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey;

                const response = await axios.post(url, {
                    contents: [{ parts: [{ text: contextPrompt }] }]
                });

                // Safe Data Extraction (No special symbols)
                if (response.data &&
                    response.data.candidates &&
                    response.data.candidates.length > 0 &&
                    response.data.candidates[0].content &&
                    response.data.candidates[0].content.parts &&
                    response.data.candidates[0].content.parts.length > 0) {

                    botReply = response.data.candidates[0].content.parts[0].text;
                    break; // Stop loop if successful
                }

            } catch (err) {
                console.error("Failed with " + modelName);
            }
        }

        // 4. Send Response
        if (botReply) {
            res.json({ reply: botReply });
        } else {
            // Hardcoded Fallback if AI fails
            res.json({
                reply: "I am currently offline, but here is your data: You have " + (user.remainingQuota ? user.remainingQuota.riceKg : 0) + "kg Rice and " + (user.remainingQuota ? user.remainingQuota.wheatKg : 0) + "kg Wheat."
            });
        }

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;