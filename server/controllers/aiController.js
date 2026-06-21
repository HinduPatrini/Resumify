const { Groq } = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// @desc    Improve a resume bullet point using Groq Llama-3 AI
// @route   POST /api/ai/improve-bullet
const improveBullet = async (req, res) => {
  try {
    const { bullet } = req.body;

    if (!bullet || !bullet.trim()) {
      return res.status(400).json({ message: 'Bullet point text is required.' });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an elite executive resume writer. Your job is to improve the user\'s resume bullet point. Rewrite it to start with a strong action verb, highlight measurable impact or technical complexity, and make it sound highly professional and concise. Keep it as a single bullet point. Do NOT wrap it in quotation marks, do NOT add bullet symbols (e.g. • or -), and do NOT add intro/outro comments. Return ONLY the improved bullet string.'
        },
        {
          role: 'user',
          content: bullet.trim()
        }
      ],
      model: 'llama-3.1-8b-instant',
    });

    const improvedBullet = completion.choices[0]?.message?.content?.trim() || bullet;
    res.json({ improvedBullet });
  } catch (error) {
    console.error('Groq AI API execution failed:', error.message);
    res.status(500).json({ message: 'Failed to contact AI service. Please try again.' });
  }
};

module.exports = {
  improveBullet,
};
