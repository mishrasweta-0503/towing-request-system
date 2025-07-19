import React, { useState } from 'react';
import './App.css';

function App() {
  const [form, setForm] = useState({
    customer_name: '',
    location: '',
    note: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccessMessage('Request submitted successfully!');
        setForm({
          customer_name: '',
          location: '',
          note: '',
        });
      } else {
        const errorData = await res.json();
        setSuccessMessage(`Error: ${errorData.message || 'Failed to submit'}`);
      }
    } catch (error) {
      setSuccessMessage('Error submitting request.');
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h2>Towing Request Form</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', margin: 'auto' }}>
        <input
          type="text"
          name="customer_name"
          placeholder="Customer Name"
          value={form.customer_name}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px', padding: '8px' }}
        />
        <textarea
          name="note"
          placeholder="Note (optional)"
          value={form.note}
          onChange={handleChange}
          style={{ marginBottom: '10px', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>Submit Request</button>
      </form>
      {successMessage && <p style={{ color: 'green', marginTop: '20px' }}>{successMessage}</p>}
    </div>
  );
}

export default App;
