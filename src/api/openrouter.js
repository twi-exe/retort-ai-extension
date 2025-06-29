
// const API_URL = "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-0528-Qwen3-8B"; // or any public model

// const headers = {
//   Authorization: "Bearer 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"
// };

// export async function getAIReply(prompt) {
//   const response = await fetch(API_URL, {
//     method: "POST",
//     headers: {
//       ...headers,
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ inputs: prompt })
//   });

//   if (!response.ok) throw new Error("❌ Hugging Face fetch failed");

//   const result = await response.json();
//   return result[0]?.generated_text || "No reply generated.";
// }


const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = "Bearer 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";
const MODEL = "mistralai/mixtral-8x22b-instruct"

export async function getAIReply(prompt) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": OPENROUTER_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL, // ✅ Free-tier model
      messages: [
        { role: "system", content: "Your goal is to generate helpful, context-aware, and grammatically correct replies to online messages. Use the following: 1. **Context**: This is the ongoing conversation or visible message on the screen. \n2. **User Intent**: This is what the user wants to reply or express.\n3. **Tone/Style** (Optional): The user may ask to change the tone (e.g., friendly, professional, witty, sarcastic). \nOnly return the suggested reply. Do not include explanations or any extra text." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 256
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error("❌ OpenRouter fetch failed: " + errText);
  }

  const result = await response.json();
  return result.choices?.[0]?.message?.content || "No reply generated.";
}



