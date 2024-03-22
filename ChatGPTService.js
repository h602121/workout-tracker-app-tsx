import axios from "axios";
import { OPENAI_KEY } from "@env";

export const getAnswerFromGpt = async (prompt) => {
  try {
    const client = axios.create({
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const response = await client.post(API_URL, {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "assistant",
          content: prompt,
        },
      ],
    });

    const answer = response.data?.choices[0]?.message?.content;
    return Promise.resolve({ success: true, data: answer });
  } catch (error) {
    return Promise.resolve({ success: false, msg: error.message });
  }
};
