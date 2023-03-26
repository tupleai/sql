import fetch from "isomorphic-unfetch";

const swimmingSchema = `
Table rDistanceSwimming, columns = [value, creationDate]
- Column value is a numerical column, Unit is meter
- Column creationDate is a DATETIME type and represents the time when the swimming record was created. An example of the data in this column is "2022-03-16 12:39:57 +0800"
- This Table is used to store swimming records where each data record represents one episode of swimming, and a person may swim multiple times in a day.
- must use strftime and substr to handle all the DATETIME type, like strftime('%Y-%m-%d %H:%M:%S', substr(original_string, 1, 19))
`;

const translateToSQL = async (query, apiKey, tableSchema = swimmingSchema) => {
  const prompt = `#SQLITE SQL
  ${tableSchema}
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
