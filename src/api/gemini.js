export const callGemini = async (prompt) => {
  const apiKey = "AIzaSyA_npFVY5JFLru4eyoav9bTb9kqMQquAIU";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data?.candidates?.length > 0) {
      return { text: data.candidates[0].content.parts[0].text };
    } else {
      console.error('Gemini API Error:', data);
      return {
        text: data?.error?.message || 'Gemini API returned no candidates.',
      };
    }
  } catch (error) {
    console.error('Gemini API Request Failed:', error);
    return {
      text: 'Failed to fetch from Gemini API. Check your internet connection or API key.',
    };
  }
};


