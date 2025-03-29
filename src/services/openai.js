const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const generateContent = async (prompt, options = {}) => {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key is missing. Using mock data instead.');
    return mockGenerateContent(prompt, options);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: options.model || 'gpt-3.5-turbo-instruct',
        prompt,
        max_tokens: options.maxTokens || 300,
        temperature: options.temperature || 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      return mockGenerateContent(prompt, options);
    }
    
    return data.choices[0].text.trim();
  } catch (error) {
    console.error('Failed to generate content with OpenAI:', error);
    return mockGenerateContent(prompt, options);
  }
};

// Mock function implementation...
