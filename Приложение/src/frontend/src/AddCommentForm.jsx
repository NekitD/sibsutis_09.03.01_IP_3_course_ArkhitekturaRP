import React, { useState } from "react";
import "./AddCommentForm.css";

export default function AddCommentForm({ onAdd }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        body: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...formData,
            postId: 1
        });
        setFormData({ name: '', email: '', body: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="add-form">
            <input className="field-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
            />
            <input className="field-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
            />
            <textarea className="field-body"
                name="body"
                value={formData.body}
                onChange={handleChange}
                placeholder="Comment body"
                required
            />
            <button type="submit">Add Comment</button>
        </form>
    );
}