import { NextApiRequest, NextApiResponse } from "next";
import generateQuestions from "../../src/generateQuestions";

if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "OPENAI_API_KEY is not defined in .env file. Please add it there (see README.md for more details)."
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await generateQuestions(process.env.OPENAI_API_KEY);
    // console.log(res);
    res.status(200).json(JSON.parse(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error translating to SQL" });
  }
}
