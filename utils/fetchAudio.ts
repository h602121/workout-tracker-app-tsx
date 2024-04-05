import { EXPO_PUBLIC_MY_ENDPOINT } from "@env";
const fetchAudio = async (text: string) => {
  const response = await fetch(EXPO_PUBLIC_MY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  return await response.blob();
};

export default fetchAudio;
