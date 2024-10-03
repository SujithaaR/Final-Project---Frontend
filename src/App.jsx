// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './pages/Login'; 
import Register from './pages/Register'; 
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import Quiz from './components/Quiz';
import Discussion from './components/Discussion';
import Feedback from './components/Feedback';
import Admin from './pages/Admin';
import AdminFeedback from './pages/AdminFeedback';
import AdminComments from './pages/AdminComments';
import ScorePage from './pages/Score';
import AdminCourse from './pages/AdminCourse';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:courseId" element={<CourseDetail />} /> 
                <Route path="/quiz/:courseId" element={<Quiz />} />
                <Route path="/discussion" element={<Discussion />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/Admin" element={<Admin/>}/>
                <Route path="/admin/feedback" element={<AdminFeedback />} />
                <Route path="/admin/comments" element={<AdminComments />} />
                <Route path="/admin/scores" element={<ScorePage/>}/>
                <Route path="/admin-course" element={<AdminCourse/>}/>
            </Routes>
        </Router>
    );
};

export default App;

