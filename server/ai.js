import 'openai/shims/node';
import OpenAI from 'openai';
import { Stream } from 'openai/streaming';

const CHATGPT_MODEL = process.env.CHATGPT_MODEL || 'gpt-3.5-turbo-1106';
const PROMPT =
"You are a knowledgeable wine advisor. Provide detailed wine recommendations based on the user's preferences, including tasting notes, ideal pairings, and occasion suitability."

const settings = {
  model: CHATGPT_MODEL,
  stream: false,
};

const send = async (wines) => {
  const openai = new OpenAI({
    timeout: 10000,
    maxRetries: 3,
  });
  settings.messages = [
    {
      role: 'system',
      content: PROMPT,
    },
    {
      role: 'user',
      content: `${wines}? I'm interested in its tasting notes, grape varieties used, the winemaking process, recommended food pairings, ideal serving temperature, and any notable awards or recognitions it has received.`,
    },
  ];
  const completion = await openai.chat.completions.create(settings);
  return completion;
};

export default {
  send,
};