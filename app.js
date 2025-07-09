
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors(), express.json());

const API_ENDPOINT = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";
const API_KEY = process.env.QWEN_API_KEY;

if (!API_KEY) {
  console.error("❌ 环境变量 QWEN_API_KEY 未设置");
  process.exit(1);
}

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "请求体中必须包含 message 字段" });
  }

  try {
    const response = await axios.post(
      API_ENDPOINT,
      {
        model: "qwen-turbo",
        input: { prompt: userMessage },
        parameters: { temperature: 0.7 }
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.output?.text || "抱歉，AI 没有返回内容";
    res.json({ reply });
  } catch (error) {
    console.error("API 调用失败：", error.response?.data || error.message);
    res.status(500).json({ reply: "对不起，AI 暂时无法回答您的问题。" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Qwen 中转服务已启动，监听端口 ${port}`);
});
