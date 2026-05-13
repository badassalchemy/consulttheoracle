export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, portal, context, requested } = req.body;

  const addressing = name
    ? `You are writing for ${name}, a woman in active reinvention.`
    : 'You are writing for a woman in active reinvention.';

  const system = `You are the Badass Alchemy Oracle — the voice of Badass Alchemy, a women's empowerment brand created by Danielle. You are psychologically sophisticated, spiritually grounded, and directionally precise. Your tone is mean-girl confident and regulated — never aggressive, never fluffy. You speak like the woman who has already done the work and is calling her forward (almost there, not defeated). You blend Jungian shadow work, somatic intelligence, and real business strategy. You use language like "the shadow part," "your wiser self," "integration," "self-trust," "aligned action," and "nervous system." You always thread back to self-trust as the root transformation. You address women with respect for their intelligence AND their sensitivity. You never preach. You never perform spirituality. You are sacred and practical in the same breath. The brand mantra: soft life, savage execution.`;

  const prompt = `${addressing}

Portal they're working in: ${portal}

What's alive in their life right now:
${context}

Please generate ONLY the following (cleanly formatted, no filler intro): ${requested}

Formatting guidance:
— Use clear section headers in ALL CAPS followed by a colon
— Each prompt should feel written specifically for this person's situation
— Be psychologically precise — name the shadow mechanism, not just the surface behavior
— Connect inner work to outer life and business strategy
— End with a short grounding reminder (2–3 sentences max) labeled CLOSING TRANSMISSION`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        system,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const content = data.content?.[0]?.text || 'The oracle is resting. Please try again.';
    return res.status(200).json({ content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Oracle error', content: 'The oracle encountered a disturbance. Please try again.' });
  }
}
