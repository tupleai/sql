import fetch from "isomorphic-unfetch";

const swimmingSchema = `
Table rDistanceSwimming, columns = [startDate, endDate, value, creationDate]
- Column value is a numerical column, Unit is meter
- Column startDate is a DATETIME type and represents the time when I started swimming. An example of the data in this column is "2022-03-16 12:39:57 +0800".
- Column endDate is a DATETIME type and represents the time when I finished swimming. An example of the data in this column is "2022-03-16 12:39:57 +0800".
- Column creationDate is a DATETIME type and represents the time when the swimming record was created. An example of the data in this column is "2022-03-16 12:39:57 +0800".
- This Table is used to store swimming records where each data record represents one episode of swimming, and a person may swim multiple times in a day.
`;
const generateQuestions = async (apiKey, tableSchema = swimmingSchema) => {
  const seed = Math.random();
  const prompt = `#SQLITE SQL
  ${tableSchema}

  Question {title: string}
  seed: ${seed}
  
  Please generate 6 distinct questions based on the given information
  These questions should be easy to answer with a SQL query and less than 25 words. Do not show perspective or sql or classification.
  Let's think step by step, generate the Question array to the questions.json using compressed JSON format.
  ---
  questions.json
  ---
  
  `;
  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt,
      temperature: 0.5,
      max_tokens: 2048,
      n: 1,
      stop: "\\n",
      model: "text-davinci-003",
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
      logprobs: 10,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.log(response);
    throw new Error(data.error || "Error translating to SQL.");
  }

  return data.choices[0].text.trim();
};

export default generateQuestions;
