export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { dogName, breed, habit, genre } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY');
      return res.status(500).json({ error: 'Server misconfigured: missing API key' });
    }

   const genreGuidance = {
  mystery: "Include a small 'crime' to solve and a satisfying, silly resolution.",
  comedy: "Make it laugh-out-loud absurd, with comedic timing and an unexpected punchline.",
  heartwarming: "Focus on a tender, loving moment between the dog and their human. End on an emotional high note.",
  thriller: "Build tension with short, punchy sentences, and end with a genuine twist."
};

  const prompt = `Write a short story (150-200 words) narrated in first person by a dog named ${dogName}, a ${breed}.

  The dog has this quirky habit: ${habit}.

  Genre: ${genre}. ${genreGuidance[genre] || ''}

    Guidelines:
    - Write entirely from the dog's point of view, with a distinct, charming voice
    - Give the dog's inner thoughts real personality — confident, a little silly, endearing
    - Weave the quirky habit naturally into the plot, not just as a mention
    - End with a strong final line that leaves the reader smiling`;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', JSON.stringify(data));
      return res.status(500).json({ error: 'Gemini API error', details: data });
    }

    const story = data.candidates[0].content.parts[0].text;
    res.status(200).json({ story });

  } catch (error) {
    console.error('Function crashed:', error.message);
    res.status(500).json({ error: 'Failed to generate story', details: error.message });
  }
}