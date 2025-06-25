const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json());
app.use(cors());

function calculateLongevityScore(data) {
  const { age, weight, height, sleep_hours, exercise_minutes } = data;
  let score = 100;

  // Penalize by age (natural aging effect)
  score -= age / 2;

  // Benefits from daily exercise
  score += exercise_minutes / 30;

  // Benefits from sleep quality
  score += sleep_hours * 2;
  
  // Calculate BMI (assuming height provided in cm)
  const heightMeters = height / 100;
  const bmi = weight / (heightMeters * heightMeters);
  
  if (bmi >= 18.5 && bmi <= 25) {
    score += 5; // Bonus for ideal BMI
  } else {
    score -= Math.abs(bmi - 22) * 0.5; // Penalty for deviating from an ideal BMI around 22
  }

  // Normalize score between 0 and 100
  if (score > 100) score = 100;
  if (score < 0) score = 0;

  return { score, bmi };
}

app.post('/api/calculate', (req, res) => {
  const { age, weight, height, sleep_hours, exercise_minutes } = req.body;
  
  if (!age || !weight || !height || !sleep_hours || exercise_minutes === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const result = calculateLongevityScore({ age, weight, height, sleep_hours, exercise_minutes });
  
  // Provide basic coaching based on the input
  let advice = [];
  if (sleep_hours < 7) {
    advice.push("Increase sleep duration for better recovery.");
  }
  if (exercise_minutes < 30) {
    advice.push("Incorporate more physical activity into your routine.");
  }
  if (result.bmi < 18.5) {
    advice.push("Consider nutritional guidance to gain healthy weight.");
  } else if (result.bmi > 25) {
    advice.push("Consider a balanced diet to manage your weight.");
  }
  
  res.json({ longevityScore: result.score, bmi: result.bmi, advice });
});

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
