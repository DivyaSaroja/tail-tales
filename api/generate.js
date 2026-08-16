export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { dogName, breed, habit, genre } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `Write a short, fun ${genre} story (around 150 words) told from the first-person perspective of a dog named ${dogName}, a ${breed}. The dog has a quirky habit: ${habit}. Make it playful and full of personality.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    const story = data.candidates[0].content.parts[0].text;

    res.status(200).json({ story });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate story' });
  }
}