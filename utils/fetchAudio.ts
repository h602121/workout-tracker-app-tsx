import { EXPO_PUBLIC_MY_ENDPOINT } from "@env";
export const fetchAudio = async (text: string) => {
  console.log("TESTETSTSTSTSTSTSTST");
  console.log(EXPO_PUBLIC_MY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const response = await fetch(EXPO_PUBLIC_MY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  //uncomment this for audio response
  //const result = await response.blob();
  const result = await response.text();
  console.log(result);

  return result;
};

export default fetchAudio;
