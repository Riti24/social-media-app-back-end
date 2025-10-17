import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/ai/help-me-write', async (req, res) => {
  try {
    const { prompt, lang } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const systemPrompt =
      lang === 'ar'
        ? 'أنت مساعد كتابة يتحدث العربية فقط. يجب أن تكتب الرد باللغة العربية الفصحى الحديثة، بأسلوب رسمي، محترم وواضح. اكتب الفقرة وكأن المتقدم هو الذي يكتبها بنفسه، مستخدماً ضمير المتكلم (مثل "أنا"). لا تستخدم اللغة الإنجليزية أبداً.'
        : 'You are a writing assistant that responds only in English. Write in first person (using "I") as if the applicant is describing their own situation politely and respectfully.';

    const userPrompt =
      lang === 'ar'
        ? `اكتب فقرة مناسبة باللغة العربية الفصحى، مستخدماً ضمير المتكلم، بناءً على الطلب التالي:\n${prompt}`
        : `Write a polite, first-person paragraph based on the following request:\n${prompt}`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept-Language': lang === 'ar' ? 'ar' : 'en',
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content?.trim();
    res.json({ reply });
  } catch (error) {
    console.error('AI error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate AI suggestion' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
