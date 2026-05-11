import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
});

export const getStaff = () => API.get('/staff');
export const createStaff = (data) => API.post('/staff', data);
export const updateStaff = (id, data) => API.put(`/staff/${id}`, data);

export const getObservations = () => API.get('/observations');
export const createObservation = (data) => API.post('/observations', data);
export const updateObservation = (id, data) => API.put(`/observations/${id}`, data);

export const getReviews = () => API.get('/reviews');
export const createReview = (data) => API.post('/reviews', data);
export const updateReview = (id, data) => API.put(`/reviews/${id}`, data);

export const getGoals = () => API.get('/goals');
export const createGoal = (data) => API.post('/goals', data);
export const updateGoal = (id, data) => API.put(`/goals/${id}`, data);
export const deleteGoal = (id) => API.delete(`/goals/${id}`);

export const getNotes = () => API.get('/notes');
export const createNote = (data) => API.post('/notes', data);
export const updateNote = (id, data) => API.put(`/notes/${id}`, data);
export const deleteNote = (id) => API.delete(`/notes/${id}`);

export const aiObservationSummary = (data) => API.post('/ai/observation-summary', data);
export const aiReviewSummary = (data) => API.post('/ai/review-summary', data);
export const aiGoalRecommendations = (data) => API.post('/ai/goal-recommendations', data);
export const aiDepartmentReport = (data) => API.post('/ai/department-report', data);
export const aiEnhanceNote = (data) => API.post('/ai/enhance-note', data);

export default API;
