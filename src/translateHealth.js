import fetch from "isomorphic-unfetch";

const translateToSQL = async (query, apiKey) => {
  const prompt = `#SQLITE SQL
  Table rDistanceSwimming, columns = [startDate, endDate, value, creationDate]
  - Column value is a numerical column, Unit is meter
  - Column startDate is a DATETIME column with format like 2022-03-16 12:39:57 +0800
  - Column endDate is a DATETIME column with format like 2022-03-16 12:39:57 +0800
  - Column creationDate is a DATETIME column with format like 2022-03-16 12:39:57 +0800
  Let's think step by step, use best practice of writing SQL,
  Translate this natural language query into SQLITE SQL: ${query}
  SQL Query:
  `;
  console.log(prompt);
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

export default translateToSQL;
