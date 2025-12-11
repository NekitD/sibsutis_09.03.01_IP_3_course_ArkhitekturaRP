import React, { useState, useEffect, useOptimistic } from "react";
import DataSet from "./DataSet";
import AddCommentForm from "./AddCommentForm";
import DeleteButton from "./DeleteButton";



export default function Application() {

    const API_BASE = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';



    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [optimisticComments, addOptimisticComment] = useOptimistic(
        comments,
        (state, action) => {
            switch (action.type) {
                case 'add':
                    return [...state, action.comment];
                case 'delete':
                    return state.filter(comment => !action.ids.includes(comment.id));
                case 'update':
                    return state.map(comment =>
                        comment.id === action.comment.id ? action.comment : comment
                    );
                default:
                    return state;
            }
        }
    );
    const [selectedCommentIds, setSelectedCommentIds] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE}/comments`)
            .then(response => {
                if (!response.ok) throw new Error('NETWORK ERROR');
                return response.json();
            })
            .then(data => {
                setComments(data.slice(0, 50));
                setLoading(false);
                console.log(data);
            });
    }, []);
    if (loading) return <div>Загрузка...</div>;

    const handleAddComment = (newComment) => {
        const { id, ...commentWithoutId } = newComment;

        fetch(`${API_BASE}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentWithoutId)
        })
            .then(response => response.json())
            .then(serverComment => {
                setComments(prev => [...prev, serverComment]);
            });
    };

    const handleDeleteComments = (selectedIds) => {
        addOptimisticComment({ type: 'delete', ids: selectedIds });

        Promise.all(
            selectedIds.map(id =>
                fetch(`${API_BASE}/comments/${id}`, {
                    method: 'DELETE',
                })
            )
        )
            .then(responses => {
                const allOk = responses.every(response => response.ok);
                if (!allOk) throw new Error('Failed to delete some comments');
                setComments(prev => prev.filter(comment => !selectedIds.includes(comment.id)));
            })
    };

    const handleUpdateComment = (updatedComment) => {
        addOptimisticComment({ type: 'update', comment: updatedComment });

        fetch(`${API_BASE}/comments/${updatedComment.id}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedComment),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to update comment');
                return response.json();
            })
            .then(actualComment => {
                setComments(prev => prev.map(comment =>
                    comment.id === updatedComment.id ? actualComment : comment
                ));
            });
    };

    return (
        <div className="App">
            <div className="controls">
                <AddCommentForm onAdd={handleAddComment} />
                <DeleteButton
                    onDelete={handleDeleteComments}
                    selectedIds={selectedCommentIds}
                />
            </div>
            <DataSet
                objects={optimisticComments}
                onUpdate={handleUpdateComment}
                onSelectionChange={setSelectedCommentIds}
            />
        </div>
    );
}