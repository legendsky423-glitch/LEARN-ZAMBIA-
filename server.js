const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Learn Zambia AI Tutor Server is running!");
});

app.post("/api/chat", async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "AI API key is not configured."
      });
    }

    const messages = req.body.messages || [
      {
        role: "user",
        content: req.body.question || req.body.message || ""
      }
    ];

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are Learn Zambia AI Tutor. Teach students using clear, friendly explanations suitable for the Zambian school curriculum. Help students understand concepts step by step."
            },
            ...messages
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "AI request failed."
      });
    }

    const reply = data.choices[0].message.content;

    res.json({
      reply: reply,
      answer: reply
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Could not connect to the AI tutor."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Learn Zambia server running on port ${PORT}`);
});
