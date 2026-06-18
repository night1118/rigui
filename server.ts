import express from "express";
import path from "path";
import dns from "dns";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parser for API requests
app.use(express.json());

// API route: Gemini Custom Generation
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { termName, promptType, userContext } = req.body;

    if (!termName) {
      return res.status(400).json({ error: "Missing required parameter 'termName'" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // Return a beautiful graceful alternative message so the app never crashes
      let mockContent = "";
      if (promptType === "poem") {
        mockContent = `【模拟诗意生成】（提示：如需使用真实 AI，请在 Settings 中的 Secrets 面板配置您的 GEMINI_API_KEY）\n\n《${termName}吟怀》\n竹摇轻影动清池，正是${termName}初候时。\n最是人间风物好，幽怀寄与一枝丝。`;
      } else if (promptType === "wisdom") {
        mockContent = `【模拟节气养生】（提示：如需使用真实 AI，请在 Settings 中的 Secrets 面板配置您的 GEMINI_API_KEY）\n\n在${termName}时节，人体阳气正处于微妙的转化中。建议多饮温开水，保持心情舒畅，饮食以清淡甘平为主，多食当季新鲜时蔬，避免熬夜和大汗淋漓，适当到户外踏青、漫步。`;
      } else {
        mockContent = `【模拟人文故事】（提示：如需使用真实 AI，请在 Settings 中的 Secrets 面板配置您的 GEMINI_API_KEY）\n\n关于${termName}的民间故事：相传古时候有位行医的隐士，在每逢${termName}的日子里便会登高采药，制成凉茶赠予路人消暑祛寒、祛病强身。久而久之，乡亲们也养成了在${termName}这天互赠温煦心意的习俗。`;
      }
      return res.json({ content: mockContent, isMock: true });
    }

    // Lazy initialization of GoogleGenAI as required
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    let systemPrompt = "你是一位精通中国传统二十四节气、古典文学及传统养生智慧的儒雅国学大师。字里行间要有华丽、典雅、宁静的东方美学质感。";
    let prompt = "";

    if (promptType === "poem") {
      prompt = `请为二十四节气中的“${termName}”创作一首华美的现代诗或古典格律诗辞，展现出该节气独特的自然风物、光影美学及人文情怀。另外可以融入用户提供的信息：${userContext || "随心而作"}。请直接给出诗歌内容，并附带简短的赏析。`;
    } else if (promptType === "wisdom") {
      prompt = `请针对二十四节气中的“${termName}”，结合当今现代生活节奏，提供一份科学与传统结合的养生调理秘笈（包括膳食推荐、作息调摄、穴位按摩或情绪调节等）。另外结合用户提供的信息：${userContext || "不限"}。请排版精美自然。`;
    } else {
      prompt = `请为二十四节气中的“${termName}”撰写一段优雅的、极具画面感的自然散文或民间传说典故。描绘日晷上手影、日光随时间的微妙流转，给人带来宁静而深邃的体验。另外可以结合：${userContext || "不限"}。`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      }
    });

    res.json({ content: response.text, isMock: false });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error?.message || "服务器生成内容时出错，请稍后重试" });
  }
});

// Configure Vite middleware or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static dist files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully booted and running on http://localhost:${PORT}`);
  });
}

startServer();
