import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskManager = () => {
    const [users, setUsers] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    // Fetch all users from the backend
    useEffect(() => {
        axios.get('http://localhost:5000/api/users')
            .then((response) => setUsers(response.data))
            .catch((err) => console.error('Error fetching users:', err));
    }, []);

    // Add a new task to the selected user
    const addTask = () => {
        if (!selectedUser || !newTask.trim()) return;
        axios.post(`http://localhost:5000/api/users/${selectedUser}/tasks`, { task: newTask })
            .then((response) => {
                // Update the user list after adding a task
                setUsers((prev) =>
                    prev.map((user) =>
                        user.chatId === selectedUser ? { ...user, tasks: response.data.tasks } : user
                    )
                );
                setNewTask('');
            })
            .catch((err) => console.error('Error adding task:', err));
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Task Manager</h1>

            <label>
                Select User:
                <select
                    value={selectedUser || ''}
                    onChange={(e) => setSelectedUser(e.target.value)}
                >
                    <option value="" disabled>
                        -- Select a User --
                    </option>
                    {users.map((user) => (
                        <option key={user.chatId} value={user.chatId}>
                            {user.chatId}
                        </option>
                    ))}
                </select>
            </label>

            <div style={{ marginTop: '1rem' }}>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter a new task"
                />
                <button onClick={addTask}>Add Task</button>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h2>Users and Tasks</h2>
                {users.map((user) => (
                    <div key={user.chatId}>
                        <h3>User: {user.chatId}</h3>
                        <ul>
                            {user.tasks.map((task, index) => (
                                <li key={index}>{task}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskManager;
