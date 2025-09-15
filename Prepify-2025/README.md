# Prepify

Prepify is an AI-powered interview preparation platform for students. It generates customized interview questions based on selected topics, evaluates answers, and provides detailed feedback and performance analytics.

## Features

- Topic-based question generation
- Support for theory and programming questions
- Real-time answer evaluation with scores and feedback
- Comprehensive performance analytics
- Modern, responsive UI design

## Tech Stack

- Frontend: Vanilla JavaScript, HTML, CSS
- Backend: Node.js, Express
- AI Integration: Together AI API (Llama-3.3-70B-Instruct-Turbo-Free)
- Data Visualization: Chart.js

## Prerequisites

- Node.js (v14+)
- npm
- Together AI API key

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/prepify.git
   cd prepify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   TOGETHER_AI_API_KEY=your_together_ai_api_key_here
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser and go to `http://localhost:3000`

## How to Use

1. Select topics for your interview preparation
2. Choose question type (theory, programming, or mixed)
3. Set the number of questions
4. Start the interview
5. Answer each question to the best of your ability
6. Receive detailed feedback on your answers
7. View your performance summary at the end

## Alternative AI Models

Besides the default Llama-3.3-70B-Instruct-Turbo-Free model, you can also use:

- DeepSeek-R1-Distill-Llama-70B-free

To switch models, modify the `DEFAULT_MODEL` variable in `server.js`.

## Ollama Integration (Future)

Support for local models via Ollama is planned for future releases, allowing users to run custom models locally.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. 