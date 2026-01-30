import * as ai from '../services/ai.service.js';

export const getAIResult = async (req, res) => {
    const { prompt } = req.query;
    try {
        const result = await ai.generateAIResponse(prompt);
        res.send({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}