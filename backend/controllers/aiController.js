import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import fs from "fs/promises";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse/lib/pdf-parse.js");
const LLM_MODEL =
  process.env.LLM_MODEL || process.env.GROQ_MODEL || "llama-3.1-8b-instant";

const getProviderErrorMessage = (error) => {
  if (error?.status === 404) {
    return "Configured Groq model is not available. Set a valid LLM_MODEL or GROQ_MODEL in backend/.env.";
  }
  if (error?.status === 429) {
    return "Groq API quota/rate limit reached. Please retry later.";
  }
  if (error?.status === 401 || error?.status === 403) {
    return "Groq API key is invalid or does not have required permission.";
  }
  return error?.message || "Request failed";
};

const getAIClient = () => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing GROQ_API_KEY. Set GROQ_API_KEY in backend/.env."
    );
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });
};

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await getAIClient().chat.completions.create({
      model: LLM_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({
      success: true,
      content,
    });
  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: getProviderErrorMessage(error),
    });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await getAIClient().chat.completions.create({
      model: LLM_MODEL,
      messages: [
        {
          role: "system",
          content: "Generate one concise blog title.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 100,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({
      success: true,
      content,
    });
  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: getProviderErrorMessage(error),
    });
  }
};

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLIPDROP_API_KEY },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(data, "binary").toString("base64")}`;
    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
    `;

    res.json({
      success: true,
      content: secure_url,
    });
  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [{ effect: "background_removal" }],
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove background from image', ${secure_url}, 'remove-background')
    `;

    res.json({
      success: true,
      content: secure_url,
    });
  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const removeObjectFromImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const { object } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    if (!image?.path) {
      return res.json({
        success: false,
        message: "Please upload an image.",
      });
    }

    if (!object?.trim()) {
      return res.json({
        success: false,
        message: "Please provide the object name to remove.",
      });
    }

    const sanitizedObject = object.trim().replace(/\s+/g, "_");
    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [{ effect: `gen_remove:prompt_${sanitizedObject}` }],
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Remove "${object}" from image`}, ${secure_url}, 'remove-object')
    `;

    res.json({
      success: true,
      content: secure_url,
    });
  } catch (error) {
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const reviewResume = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resumeFile = req.file;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    if (!resumeFile?.path) {
      return res.json({
        success: false,
        message: "Please upload a resume PDF.",
      });
    }

    const buffer = await fs.readFile(resumeFile.path);
    const parsed = await pdfParse(buffer);
    const resumeText = (parsed.text || "").trim();

    if (!resumeText) {
      return res.json({
        success: false,
        message: "Could not read text from this PDF. Try another file.",
      });
    }

    const response = await getAIClient().chat.completions.create({
      model: LLM_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert ATS and recruiter reviewer. Give concise actionable resume feedback with sections: Summary, Strengths, Gaps, Improvements, ATS Score (0-100).",
        },
        {
          role: "user",
          content: `Review this resume text and provide feedback:\n\n${resumeText.slice(0, 15000)}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 1200,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Resume review', ${content}, 'review-resume')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({
      success: true,
      content,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: getProviderErrorMessage(error),
    });
  }
};

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();

    const creations = await sql`
      SELECT id, prompt, content, type, created_at, publish
      FROM creations
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    res.json({
      success: true,
      creations,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.params;

    const deleted = await sql`
      DELETE FROM creations
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING id
    `;

    if (!deleted.length) {
      return res.json({
        success: false,
        message: "Creation not found.",
      });
    }

    res.json({
      success: true,
      message: "Creation deleted successfully.",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};