import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function MasterProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [master, setMaster] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        axios.get(`/api/Master/${id}`).then(res => setMaster(res.data));
        axios.get(`/api/Review/master/${id}`).then(res => setReviews(res.data));
    }, [id]);

    const getAverageRating = () => {
        if (reviews.length === 0) return '—';
        const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
        return avg.toFixed(1);
    };

    if (!master) return <p>Загрузка...</p>;

    return (
        <div className="master-profile">
            <button className="back-btn" onClick={() => navigate(-1)}>← Назад</button>
            <div className="profile-header">
                <div className="avatar">{master.name[0]}</div>
                <div>
                    <h2>{master.name}</h2>
                    <p>Почта: {master.email}</p>
                    <p>Средняя оценка: <strong>{getAverageRating()} ⭐️</strong></p>
                </div>
            </div>

            <div className="reviews">
                <h3>Отзывы клиентов:</h3>
                {reviews.length === 0 ? (
                    <p>Отзывов пока нет.</p>
                ) : (
                    reviews.map((r) => (
                        <div key={r.id} className="review-card">
                            <p><strong>{r.user.email}</strong> — {r.rating}⭐</p>
                            <p>{r.text}</p>
                            <p className="date">{new Date(r.datePosted).toLocaleDateString()}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
