import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const roles = [
  { id: 'under18', label: 'Women Under 18' },
  { id: 'women18plus', label: 'Women 18+' },
  { id: 'doctor', label: 'Doctors' },
  { id: 'nurse', label: 'Nurses' }
];

function App() {
  const [activeRole, setActiveRole] = useState('under18');
  const [roleId, setRoleId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchQuestions(activeRole);
  }, [activeRole]);

  const fetchQuestions = async (role) => {
    try {
      const res = await axios.get(`${API_BASE}/questions/${role}`);
      setQuestions(res.data.questions);
      setRoleId(res.data.role_id);
      // reset answers
      const initial = {};
      res.data.questions.forEach(q => {
        if (q.question_type === 'checkbox') initial[q.id] = [];
        else initial[q.id] = '';
      });
      setAnswers(initial);
      setSubmitted(false);
    } catch (error) {
      console.error('Error fetching questions', error);
    }
  };

  const handleInputChange = (qId, value, type) => {
    if (type === 'checkbox') {
      const current = answers[qId] || [];
      if (current.includes(value)) {
        setAnswers({ ...answers, [qId]: current.filter(v => v !== value) });
      } else {
        setAnswers({ ...answers, [qId]: [...current, value] });
      }
    } else {
      setAnswers({ ...answers, [qId]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleId) {
      alert("Role ID not found. Please refresh.");
      return;
    }
    // submit each answer
    for (const qId of Object.keys(answers)) {
      const answer = answers[qId];
      if (answer === '' || (Array.isArray(answer) && answer.length === 0)) continue;
      const payload = {
        role_id: roleId,
        question_id: parseInt(qId),
        answer: Array.isArray(answer) ? answer.join(', ') : answer
      };
      await axios.post(`${API_BASE}/submit`, payload);
    }
    setSubmitted(true);
    alert('Thank you for your response!');
  };

  const renderQuestion = (q) => {
    const value = answers[q.id] || '';
    return (
      <div key={q.id} className="question">
        <p className="question-text">{q.question_text}</p>
        {q.description && <p className="question-description">{q.description}</p>}
        {renderInput(q, value)}
      </div>
    );
  };

  const renderInput = (q, value) => {
    switch (q.question_type) {
      case 'radio':
        return (
          <div className="options">
            {Array.isArray(q.options) && q.options.map(opt => (
              <label key={opt}>
                <input
                  type="radio"
                  name={`q${q.id}`}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => handleInputChange(q.id, e.target.value, 'radio')}
                />
                {opt}
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="options">
            {Array.isArray(q.options) && q.options.map(opt => (
              <label key={opt}>
                <input
                  type="checkbox"
                  value={opt}
                  checked={Array.isArray(value) && value.includes(opt)}
                  onChange={(e) => handleInputChange(q.id, e.target.value, 'checkbox')}
                />
                {opt}
              </label>
            ))}
          </div>
        );
      default:
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(q.id, e.target.value, 'text')}
            rows="3"
          />
        );
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Navya Wellness Survey</h1>
        <nav>
          {roles.map(role => (
            <button
              key={role.id}
              className={activeRole === role.id ? 'active' : ''}
              onClick={() => setActiveRole(role.id)}
            >
              {role.label}
            </button>
          ))}
        </nav>
      </header>
      <main>
        {submitted ? (
          <p className="thanks">Responses recorded. Thank you!</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {questions.map(q => renderQuestion(q))}
            <button type="submit">Submit</button>
          </form>
        )}
      </main>
    </div>
  );
}

export default App;
