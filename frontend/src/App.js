import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    sleep_hours: '',
    exercise_minutes: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/calculate', {
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
        sleep_hours: Number(formData.sleep_hours),
        exercise_minutes: Number(formData.exercise_minutes)
      });
      setResult(res.data);
      setError(null);
    } catch (err) {
      setError("Error processing data. Please ensure all fields are filled correctly.");
      setResult(null);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Longevity Coaching App</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Age: </label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} required />
        </div>
        <div>
          <label>Weight (kg): </label>
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
        </div>
        <div>
          <label>Height (cm): </label>
          <input type="number" name="height" value={formData.height} onChange={handleChange} required />
        </div>
        <div>
          <label>Sleep Hours per Day: </label>
          <input type="number" name="sleep_hours" step="0.1" value={formData.sleep_hours} onChange={handleChange} required />
        </div>
        <div>
          <label>Exercise Minutes per Day: </label>
          <input type="number" name="exercise_minutes" value={formData.exercise_minutes} onChange={handleChange} required />
        </div>
        <button type="submit">Calculate Longevity Score</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div>
          <h2>Your Longevity Score: {result.longevityScore}</h2>
          <p>Your BMI: {result.bmi.toFixed(2)}</p>
          <h3>Coaching Advice:</h3>
          <ul>
            {result.advice.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
