import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/students";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function loadStudents() {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
      setError("");
    } catch {
      setError("Cannot load students. Check the backend and MongoDB connection.");
    }
  }

  useEffect(() => {
    axios.get(API_URL)
      .then((response) => setStudents(response.data))
      .catch(() => setError("Cannot load students. Check the backend and MongoDB connection."));
  }, []);

  function clearForm() {
    setName("");
    setCourse("");
    setAge("");
    setEditingId(null);
  }

  async function saveStudent(event) {
    event.preventDefault();
    if (!name.trim() || !course.trim() || !age || Number(age) < 1 || !Number.isInteger(Number(age))) {
      setError("Please enter a name, course, and valid age.");
      return;
    }

    const student = { name: name.trim(), course: course.trim(), age: Number(age) };
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, student);
      } else {
        await axios.post(API_URL, student);
      }
      clearForm();
      await loadStudents();
    } catch {
      setError("Unable to save student. Please check your backend connection.");
    }
  }

  function editStudent(student) {
    setEditingId(student._id);
    setName(student.name);
    setCourse(student.course);
    setAge(String(student.age));
    setError("");
  }

  async function deleteStudent(id) {
    if (!window.confirm("Delete this student?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      if (editingId === id) clearForm();
      await loadStudents();
    } catch {
      setError("Unable to delete student. Please check your backend connection.");
    }
  }

  return (
    <div style={{ padding: "24px 18px" }}>
      <h1>Student Management System</h1>

      <h2>{editingId ? "Edit Student" : "Add Student"}</h2>
      <form onSubmit={saveStudent} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 30 }}>
        <input aria-label="Name" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} required style={{ padding: 9 }} />
        <input aria-label="Course" placeholder="Course" value={course} onChange={(event) => setCourse(event.target.value)} required style={{ padding: 9 }} />
        <input aria-label="Age" placeholder="Age" type="number" min="1" step="1" value={age} onChange={(event) => setAge(event.target.value)} required style={{ padding: 9, width: 85 }} />
        <button type="submit" style={{ padding: "9px 12px" }}>{editingId ? "Update Student" : "Add Student"}</button>
        {editingId && <button type="button" onClick={clearForm} style={{ padding: "9px 12px" }}>Cancel</button>}
      </form>

      {error && <p role="alert" style={{ marginBottom: 16, color: "#d23d3d" }}>{error}</p>}

      <h2>Students</h2>
      {students.length === 0 && <p>No students found.</p>}
      {students.map((student) => (
        <div key={student._id} style={{ margin: "16px auto", padding: 14, border: "1px solid var(--border)", borderRadius: 6, maxWidth: 520 }}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 10 }}>
            <button type="button" onClick={() => editStudent(student)}>Edit</button>
            <button type="button" onClick={() => deleteStudent(student._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
