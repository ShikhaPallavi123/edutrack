const express = require('express');
const router = express.Router();

async function callClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await res.json();
  return data.content[0].text;
}

// generate observation summary
router.post('/observation-summary', async (req, res) => {
  const { staffName, gradeSubject, scores, strengths, growthAreas } = req.body;
  const prompt = `You are an expert instructional coach. Write a 3-sentence professional observation summary for ${staffName} teaching ${gradeSubject}. Domain scores: ${JSON.stringify(scores)}. Strengths: ${strengths}. Growth areas: ${growthAreas}. Be specific and constructive.`;
  const summary = await callClaude(prompt);
  res.json({ summary });
});

// generate review summary
router.post('/review-summary', async (req, res) => {
  const { staffName, department, rating, scores } = req.body;
  const prompt = `Write a professional performance review summary for ${staffName}, ${department} teacher, rated ${rating}. Scores: ${JSON.stringify(scores)}. Include strengths, areas for improvement, and 2 professional development recommendations. 3 paragraphs, constructive tone.`;
  const summary = await callClaude(prompt);
  res.json({ summary });
});

// generate goal recommendations
router.post('/goal-recommendations', async (req, res) => {
  const { staffName, observationData, currentGoals } = req.body;
  const prompt = `Based on observation data for ${staffName}: ${observationData}. Current goals: ${currentGoals}. Suggest 3 specific professional development goals with measurable success criteria. Format as numbered list.`;
  const recommendations = await callClaude(prompt);
  res.json({ recommendations });
});

// generate department report
router.post('/department-report', async (req, res) => {
  const { department, avgScore, staffCount, obsComplete, goalProgress } = req.body;
  const prompt = `Generate a concise department performance report for the ${department} department. Staff: ${staffCount}, Average score: ${avgScore}/5, Observations complete: ${obsComplete}%, Goal progress: ${goalProgress}%. Include summary, 2 strengths, 2 improvements, 1 PD recommendation. Under 200 words, professional tone.`;
  const report = await callClaude(prompt);
  res.json({ report });
});

// enhance note
router.post('/enhance-note', async (req, res) => {
  const { content } = req.body;
  const prompt = `Review this admin coaching note and provide: 1) A 2-sentence professional summary, 2) 2 suggested follow-up action items. Note: "${content.substring(0, 600)}"`;
  const enhancement = await callClaude(prompt);
  res.json({ enhancement });
});

module.exports = router;
