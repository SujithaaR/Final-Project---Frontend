import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import {
    Container,
    Typography,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    Snackbar,
    Alert,
    IconButton, // Import IconButton for the back arrow
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import back arrow icon
import questions from './quizQuestions';

const StaticQuiz = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const { userId, courseId, enrollmentId } = location.state || {};

    // Ensure required parameters are available
    if (!userId || !courseId || !enrollmentId) {
        console.error('Required parameters are missing:', { userId, courseId, enrollmentId });
        return <div>Error: Required parameters are missing.</div>;
    }

    const [marks, setMarks] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [previousScores, setPreviousScores] = useState(null);

    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchPreviousScores = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/quiz/results', {
                    params: { userId, courseId, enrollmentId },
                });

                if (response.data) {
                    setPreviousScores(response.data); 
                    setMarks(response.data.obtainedScore); 
                    setQuizSubmitted(true);
                }
            } catch (error) {
                console.error('Error fetching previous quiz results:', error);
                setSnackbarMessage('Quiz not taken');
                setSnackbarOpen(true);
            }
        };

        fetchPreviousScores();
    }, [userId, courseId, enrollmentId]);

    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: selectedOption,
        }));
    };

    const handleSubmitQuiz = async () => {
        let calculatedMarks = 0;

        questions.forEach((question) => {
            if (answers[question.id] === question.answer) {
                calculatedMarks += 1;
            }
        });

        setMarks(calculatedMarks);

        try {
            const response = await axios.post('http://localhost:3000/api/quiz/submit-quiz', {
                userId,
                courseId,
                enrollmentId,
                totalScore: questions.length,
                obtainedScore: calculatedMarks,
            });

            setSnackbarMessage(response.data.message);
            setQuizSubmitted(true);
        } catch (error) {
            console.error('Error submitting quiz:', error);
            setSnackbarMessage('Error submitting quiz');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleDiscussionClick = () => {
        navigate('/discussion', { state: { userId, courseId, enrollmentId } });
    };

    const handleFeedbackClick = () => {
        navigate('/feedback', { state: { userId, courseId, enrollmentId } });
    };

    // Function to handle back navigation
    const handleBackClick = () => {
        navigate(-1); // Navigate back to the previous page
    };

    return (
        <Container>
            <IconButton onClick={handleBackClick} style={{ marginBottom: '16px' }}>
                <ArrowBackIcon />
            </IconButton>

            <Typography variant="h4" gutterBottom>Quiz</Typography>

            {quizSubmitted ? (
                <Typography variant="h6" style={{ marginTop: '20px' }}>
                    {previousScores 
                        ? `You have already taken this quiz. Your score: ${previousScores.obtainedScore}` 
                        : 'Thank you for taking the test! Your score: ' + marks}
                </Typography>
            ) : (
                questions.map((question) => (
                    <div key={question.id}>
                        <Typography variant="h6">{question.question}</Typography>
                        <RadioGroup
                            value={answers[question.id] || ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        >
                            {question.options.map((option, index) => (
                                <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                            ))}
                        </RadioGroup>
                    </div>
                ))
            )}

            {!quizSubmitted && (
                <Button variant="contained" color="primary" onClick={handleSubmitQuiz}>
                    Submit Quiz
                </Button>
            )}

            <Button variant="contained" color="secondary" onClick={handleDiscussionClick} style={{ marginTop: '20px' }}>
                Discussion
            </Button>

            <Button variant="contained" color="secondary" onClick={handleFeedbackClick} style={{ marginTop: '20px' }}>
                Feedback
            </Button>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarMessage.includes('Error') ? 'error' : 'success'}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default StaticQuiz;
