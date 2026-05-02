import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const PRIORITIES = ["all", "high", "medium", "low"];
const FILTERS = ["all", "active", "completed"];

const priorityColor = { high: "#f87171", medium: "#fbbf24", low: "#3ecf8e" };
const priorityBg = { high: "rgba(248,113,113,0.1)", medium: "rgba(251,191,36,0.1)", low: "rgba(62,207,142,0.1)" };

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [priority, setPriority] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium" });
  const [submitting, setSubmitting] = useState(false);

  const fetchTodos = async () => {
    try {
      const { data } = await axios.get("/api/todos");
      setTodos(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTodos(); }, []);

  const openAdd = () => { setEditTodo(null); setForm({ title: "", description: "", priority: "medium" }); setShowModal(true); };
  const openEdit = (todo) => { setEditTodo(todo); setForm({ title: todo.title, description: todo.description, priority: todo.priority }); setShowModal(true); };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      if (editTodo) {
        const { data } = await axios.put(`/api/todos/${editTodo._id}`, form);
        setTodos(todos.map(t => t._id === editTodo._id ? data : t));
      } else {
        const { data } = await axios.post("/api/todos", form);
        setTodos([data, ...todos]);
      }
      setShowModal(false);
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const toggleComplete = async (todo) => {
    try {
      const { data } = await axios.put(`/api/todos/${todo._id}`, { completed: !todo.completed });
      setTodos(todos.map(t => t._id === todo._id ? data : t));
    } catch (err) { console.error(err); }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) { console.error(err); }
  };

  const filtered = todos.filter(t => {
    const matchFilter = filter === "all" || (filter === "completed" ? t.completed : !t.completed);
    const matchPriority = priority === "all" || t.priority === priority;
    return matchFilter && matchPriority;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    high: todos.filter(t => t.priority === "high" && !t.completed).length,
  };

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.nav}>
        <span style={s.navLogo}>⚡ TaskFlow</span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={s.navUser}>👋 {user?.name}</span>
          <button className="btn-ghost" onClick={logout} style={{ padding: "6px 16px", fontSize: 13 }}>Logout</button>
        </div>
      </nav>

      <div style={s.container}>
        {/* Stats */}
        <div style={s.stats}>
          {[
            { label: "Total Tasks", value: stats.total, color: "#6c63ff" },
            { label: "Completed", value: stats.completed, color: "#3ecf8e" },
            { label: "High Priority", value: stats.high, color: "#f87171" },
            { label: "Pending", value: stats.total - stats.completed, color: "#fbbf24" },
          ].map(stat => (
            <div key={stat.label} style={s.statCard}>
              <div style={{ ...s.statVal, color: stat.color }}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Header + filters */}
        <div style={s.toolbar}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ ...s.chip, ...(filter === f ? s.chipActive : {}) }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <div style={s.divider} />
            {PRIORITIES.map(p => (
              <button key={p} onClick={() => setPriority(p)}
                style={{ ...s.chip, ...(priority === p ? { ...s.chipActive, borderColor: p !== "all" ? priorityColor[p] : "#6c63ff", color: p !== "all" ? priorityColor[p] : "#6c63ff" } : {}) }}>
                {p === "all" ? "All Priority" : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={openAdd} style={{ whiteSpace: "nowrap" }}>+ Add Task</button>
        </div>

        {/* Todo List */}
        {loading ? (
          <div style={s.empty}>Loading tasks...</div>
        ) : filtered.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <div>No tasks found. Add one!</div>
          </div>
        ) : (
          <div style={s.list}>
            {filtered.map(todo => (
              <div key={todo._id} style={{ ...s.todoCard, opacity: todo.completed ? 0.6 : 1 }} className="fade-in">
                <div style={s.todoLeft}>
                  <button onClick={() => toggleComplete(todo)} style={{ ...s.check, ...(todo.completed ? s.checkDone : {}) }}>
                    {todo.completed ? "✓" : ""}
                  </button>
                  <div>
                    <div style={{ ...s.todoTitle, textDecoration: todo.completed ? "line-through" : "none" }}>
                      {todo.title}
                    </div>
                    {todo.description && <div style={s.todoDesc}>{todo.description}</div>}
                    <span style={{ ...s.badge, background: priorityBg[todo.priority], color: priorityColor[todo.priority] }}>
                      {todo.priority}
                    </span>
                  </div>
                </div>
                <div style={s.todoActions}>
                  <button style={s.iconBtn} onClick={() => openEdit(todo)} title="Edit">✏️</button>
                  <button style={s.iconBtn} onClick={() => deleteTodo(todo._id)} title="Delete">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()} className="fade-in">
            <h3 style={s.modalTitle}>{editTodo ? "Edit Task" : "New Task"}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={s.label}>Title *</label>
                <input className="input-field" placeholder="Task title..." value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} autoFocus />
              </div>
              <div>
                <label style={s.label}>Description</label>
                <textarea className="input-field" placeholder="Optional description..." value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3} style={{ resize: "vertical" }} />
              </div>
              <div>
                <label style={s.label}>Priority</label>
                <select className="input-field" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button className="btn-ghost" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button className="btn-primary" onClick={handleSubmit} disabled={submitting} style={{ flex: 1 }}>
                  {submitting ? "Saving..." : editTodo ? "Update" : "Add Task"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#0a0a0f" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", borderBottom: "1px solid #2a2a38", background: "#111118", position: "sticky", top: 0, zIndex: 100 },
  navLogo: { fontFamily: "Syne", fontSize: 20, fontWeight: 800, color: "#6c63ff" },
  navUser: { color: "#9090b8", fontSize: 14 },
  container: { maxWidth: 860, margin: "0 auto", padding: "32px 20px" },
  stats: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 },
  statCard: { background: "#111118", border: "1px solid #2a2a38", borderRadius: 12, padding: "18px 20px", textAlign: "center" },
  statVal: { fontFamily: "Syne", fontSize: 32, fontWeight: 800, lineHeight: 1 },
  statLabel: { color: "#7070a0", fontSize: 12, marginTop: 6 },
  toolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" },
  chip: { background: "transparent", border: "1px solid #2a2a38", color: "#7070a0", padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", transition: "all 0.2s" },
  chipActive: { background: "rgba(108,99,255,0.12)", borderColor: "#6c63ff", color: "#6c63ff" },
  divider: { width: 1, height: 20, background: "#2a2a38", alignSelf: "center" },
  list: { display: "flex", flexDirection: "column", gap: 10 },
  todoCard: { background: "#111118", border: "1px solid #2a2a38", borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, transition: "border-color 0.2s" },
  todoLeft: { display: "flex", alignItems: "flex-start", gap: 14, flex: 1 },
  check: { width: 22, height: 22, borderRadius: 6, border: "2px solid #2a2a38", background: "transparent", color: "transparent", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, cursor: "pointer", transition: "all 0.2s" },
  checkDone: { background: "#3ecf8e", borderColor: "#3ecf8e", color: "white" },
  todoTitle: { fontSize: 15, fontWeight: 500, color: "#f0f0f8", marginBottom: 4 },
  todoDesc: { fontSize: 13, color: "#7070a0", marginBottom: 6 },
  badge: { fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 0.5 },
  todoActions: { display: "flex", gap: 8 },
  iconBtn: { background: "transparent", border: "none", cursor: "pointer", fontSize: 16, padding: 4, borderRadius: 6, transition: "background 0.2s" },
  empty: { textAlign: "center", padding: "60px 20px", color: "#7070a0", fontSize: 15 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" },
  modal: { background: "#111118", border: "1px solid #2a2a38", borderRadius: 16, padding: "28px 28px", width: "100%", maxWidth: 460 },
  modalTitle: { fontFamily: "Syne", fontSize: 20, fontWeight: 700, marginBottom: 20 },
  label: { display: "block", fontSize: 13, color: "#9090b8", fontWeight: 500, marginBottom: 6 },
};
