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
    IconButton,
    Box,
    Card,
    CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { styled } from '@mui/material/styles';
import questions from './quizQuestions';

const OptionButton = styled(Button)(({ isCorrect, isSelected }) => ({
    margin: '4px 0',
    backgroundColor: isCorrect ? '#d4edda' : isSelected ? '#f8d7da' : '#fff',
    color: isCorrect || isSelected ? '#721c24' : '#000',
    border: isCorrect ? '1px solid #c3e6cb' : isSelected ? '1px solid #f5c6cb' : '1px solid #ced4da',
    transition: '0.3s',
    '&:hover': {
        backgroundColor: isCorrect ? '#c3e6cb' : isSelected ? '#f5c6cb' : '#e2e3e5',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
}));

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: '20px',
    borderRadius: '8px',
    boxShadow: theme.shadows[5],
}));

const StaticQuiz = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const { userId, courseId, enrollmentId } = location.state || {};

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
    const [correctAnswers, setCorrectAnswers] = useState({});

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
        const correctAnswersMap = {};

        questions.forEach((question) => {
            if (answers[question.id] === question.answer) {
                calculatedMarks += 1;
            }
            correctAnswersMap[question.id] = question.answer; 
        });

        setMarks(calculatedMarks);
        setCorrectAnswers(correctAnswersMap); 

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

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <Container sx={{ padding: '20px', marginTop: '60px' }}>
            <IconButton onClick={handleBackClick} style={{ marginBottom: '16px', color: '#1976d2' }}>
                <ArrowBackIcon />
            </IconButton>

            <Typography variant="h4" gutterBottom sx={{ marginTop: '16px', color: '#333', fontWeight: 'bold' }}>
                Quiz
            </Typography>

            <Button variant="contained" color="secondary" onClick={handleDiscussionClick} sx={{ marginTop: '20px', marginRight: '20px',marginBottom:'30px' }}>
                Discussion
            </Button>

            <Button variant="contained" color="secondary" onClick={handleFeedbackClick} sx={{ marginTop: '20px' ,marginBottom:'30px'}}>
                Feedback
            </Button>

            {quizSubmitted ? (
                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            marginTop: '20px',
                            color: '#444',
                            textAlign: 'center', 
                            padding: '16px', 
                            backgroundColor: previousScores ? '#e0f7fa' : '#fce4ec', 
                            borderRadius: '8px', 
                            boxShadow: 2, 
                            fontWeight: '600', 
                        }}
                    >
                        {previousScores 
                            ? `You have already taken this quiz. Your score: ${previousScores.obtainedScore}` 
                            : 'Thank you for taking the test! Your score: ' + marks}
                    </Typography>

                    <Typography variant="h6" sx={{ marginTop: '20px', color: '#333',marginBottom:'20px' }}>
                        Correct Answers:
                    </Typography>
                    {questions.map((question) => (
                        <StyledCard key={question.id}>
                            <CardContent>
                                <Typography variant="h6" sx={{ marginBottom: '8px', color: '#555' }}>
                                    {question.question}
                                </Typography>
                                {question.options.map((option) => {
                                    const isCorrect = option === question.answer;
                                    const isSelected = answers[question.id] === option;

                                    return (
                                        <OptionButton 
                                            key={option} 
                                            isCorrect={isCorrect} 
                                            isSelected={isSelected}
                                            variant="outlined"
                                            disabled
                                        >
                                            {option}
                                        </OptionButton>
                                    );
                                })}
                            </CardContent>
                        </StyledCard>
                    ))}
                </Box>
            ) : (
                questions.map((question) => (
                    <StyledCard key={question.id}>
                        <CardContent>
                            <Typography variant="h6" sx={{ marginBottom: '8px', color: '#555' }}>{question.question}</Typography>
                            <RadioGroup
                                value={answers[question.id] || ''}
                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            >
                                {question.options.map((option, index) => (
                                    <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </StyledCard>
                ))
            )}

            {!quizSubmitted && (
                <Button variant="contained" color="primary" onClick={handleSubmitQuiz} sx={{ marginTop: '20px' }}>
                    Submit Quiz
                </Button>
            )}

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
