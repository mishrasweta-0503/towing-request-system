import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [form, setForm] = useState({
    customer_name: '',
    location: '',
    note: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch towing requests from backend when component loads
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/requests');
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching towing requests:', error);
    }
    setLoading(false);
  };

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
        fetchRequests(); // Refresh list after submitting new request
      } else {
        const errorData = await res.json();
        setSuccessMessage(`Error: ${errorData.message || 'Failed to submit'}`);
      }
    } catch (error) {
      setSuccessMessage('Error submitting request.');
      console.error(error);
    }
  };

  // Accept request - send PUT to backend
  const acceptRequest = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/requests/${id}/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        alert('Request accepted!');
        fetchRequests(); // Refresh list after accepting
      } else {
        alert('Failed to accept request.');
      }
    } catch (error) {
      alert('Error accepting request.');
      console.error(error);
    }
  };

  return (
    <div className="App" style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Towing Request Form</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
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

      {successMessage && <p style={{ color: 'green', marginBottom: '20px' }}>{successMessage}</p>}

      <h2>Existing Towing Requests</h2>
      {loading ? (
        <p>Loading requests...</p>
      ) : (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {requests.map((req) => (
            <li key={req.id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
              <strong>{req.customer_name}</strong><br />
              Location: {req.location}<br />
              Note: {req.note || 'N/A'}<br />
              Status: {req.status || 'pending'}<br />
              {req.status !== 'assigned' && (
                <button
                  style={{ marginTop: 10, backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer' }}
                  onClick={() => acceptRequest(req.id)}
                >
                  Accept Request
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
