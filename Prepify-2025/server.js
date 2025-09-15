const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Together AI API Configuration
const TOGETHER_AI_API_KEY = process.env.TOGETHER_AI_API_KEY;
const TOGETHER_AI_API_URL = 'https://api.together.xyz/v1/chat/completions';
const DEFAULT_MODEL = 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free';

// Routes
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { topics, questionType, questionCount } = req.body;
    
    if (!topics || !topics.length || !questionType || !questionCount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const prompt = `
      Generate ${questionCount} ${questionType} questions for a student interview preparation on the following topics: ${topics.join(', ')}.
      
      Each question should be challenging but fair for a student preparing for an interview.
      
      Format the response as a JSON array with the following structure:
      [
        {
          "id": 1,
          "question": "The question text goes here",
          "type": "${questionType}",
          "topic": "The specific topic this question relates to",
          "difficulty": "A difficulty rating (easy, medium, hard)"
        },
        ...
      ]
      
      For programming questions, include clear requirements and examples if appropriate.
      Don't provide answers in this response.
    `;

    const response = await axios.post(
      TOGETHER_AI_API_URL,
      {
        model: DEFAULT_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOGETHER_AI_API_KEY}`
        }
      }
    );

    // Extract and parse the response
    const content = response.data.choices[0].message.content;
    // Try to parse the JSON from the content
    try {
      // Find JSON in the response (in case there's any extra text)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      const questions = JSON.parse(jsonStr);
      res.json(questions);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      res.status(500).json({ 
        error: 'Failed to parse AI response', 
        rawContent: content 
      });
    }
  } catch (error) {
    console.error('Error generating questions:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

app.post('/api/evaluate-answer', async (req, res) => {
  try {
    const { question, userAnswer } = req.body;
    
    if (!question || !userAnswer) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const prompt = `
      Evaluate the following answer for an interview question. 
      
      Question: ${question.question}
      Topic: ${question.topic}
      Type: ${question.type}
      
      User's Answer: ${userAnswer}
      
      Provide a comprehensive evaluation with:
      1. A score out of 10
      2. Detailed feedback explaining strengths and weaknesses
      3. Suggestions for improvement
      
      Format the response as a JSON object with the following structure:
      {
        "score": <numerical_score>,
        "feedback": "Detailed feedback here",
        "suggestions": "Improvement suggestions here"
      }
    `;

    const response = await axios.post(
      TOGETHER_AI_API_URL,
      {
        model: DEFAULT_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.3
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOGETHER_AI_API_KEY}`
        }
      }
    );

    // Extract and parse the response
    const content = response.data.choices[0].message.content;
    try {
      // Find JSON in the response (in case there's any extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      const evaluation = JSON.parse(jsonStr);
      res.json(evaluation);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      res.status(500).json({ 
        error: 'Failed to parse AI response', 
        rawContent: content 
      });
    }
  } catch (error) {
    console.error('Error evaluating answer:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 