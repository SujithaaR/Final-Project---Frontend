import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
  IconButton,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const CreateCourse = () => {
  const [course, setCourse] = useState({
    title: '',
    description: '',
    topics: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleTopicChange = (index, e) => {
    const { name, value } = e.target;
    const newTopics = [...course.topics];
    newTopics[index] = { ...newTopics[index], [name]: value };
    setCourse({ ...course, topics: newTopics });
  };

  const handleAddTopic = () => {
    setCourse({ ...course, topics: [...course.topics, { title: '', subtopics: [] }] });
  };

  const handleRemoveTopic = (index) => {
    const newTopics = course.topics.filter((_, i) => i !== index);
    setCourse({ ...course, topics: newTopics });
  };

  const handleAddSubtopic = (topicIndex) => {
    const newTopics = [...course.topics];
    newTopics[topicIndex].subtopics.push({ title: '', contents: [] });
    setCourse({ ...course, topics: newTopics });
  };

  const handleRemoveSubtopic = (topicIndex, subtopicIndex) => {
    const newTopics = [...course.topics];
    newTopics[topicIndex].subtopics = newTopics[topicIndex].subtopics.filter((_, i) => i !== subtopicIndex);
    setCourse({ ...course, topics: newTopics });
  };

  const handleSubtopicChange = (topicIndex, subtopicIndex, e) => {
    const { name, value } = e.target;
    const newTopics = [...course.topics];
    newTopics[topicIndex].subtopics[subtopicIndex] = { ...newTopics[topicIndex].subtopics[subtopicIndex], [name]: value };
    setCourse({ ...course, topics: newTopics });
  };

  const handleAddContent = (topicIndex, subtopicIndex) => {
    const newTopics = [...course.topics];
    newTopics[topicIndex].subtopics[subtopicIndex].contents.push({

      content_type: 'text',
      content: '',
      completed: false
    });
    setCourse({ ...course, topics: newTopics });
  };

  const handleRemoveContent = (topicIndex, subtopicIndex, contentIndex) => {
    const newTopics = [...course.topics];
    newTopics[topicIndex].subtopics[subtopicIndex].contents = newTopics[topicIndex].subtopics[subtopicIndex].contents.filter((_, i) => i !== contentIndex);
    setCourse({ ...course, topics: newTopics });
  };

  const handleContentChange = (topicIndex, subtopicIndex, contentIndex, e) => {
    const { name, value } = e.target;
    const newTopics = [...course.topics];
    newTopics[topicIndex].subtopics[subtopicIndex].contents[contentIndex] = { ...newTopics[topicIndex].subtopics[subtopicIndex].contents[contentIndex], [name]: value };
    setCourse({ ...course, topics: newTopics });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/more', course);
      console.log('Course created:', response.data);
      setCourse({ title: '', description: '', topics: [] });
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  return (
    <Box sx={{ padding: 20 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create Course
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Course Title"
            name="title"
            value={course.title}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Course Description"
            name="description"
            value={course.description}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            multiline
            rows={4}
          />

          {course.topics.map((topic, topicIndex) => (
            <Grid container spacing={2} key={topicIndex}>
              <Grid item xs={11}>
                <TextField
                  label={`Topic Title ${topicIndex + 1}`}
                  name="title"
                  value={topic.title}
                  onChange={(e) => handleTopicChange(topicIndex, e)}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={() => handleRemoveTopic(topicIndex)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Grid>

              {topic.subtopics.map((subtopic, subtopicIndex) => (
                <Grid container spacing={2} key={subtopicIndex}>
                  <Grid item xs={11}>
                    <TextField
                      label={`Subtopic Title ${subtopicIndex + 1}`}
                      name="title"
                      value={subtopic.title}
                      onChange={(e) => handleSubtopicChange(topicIndex, subtopicIndex, e)}
                      fullWidth
                      required
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={() => handleRemoveSubtopic(topicIndex, subtopicIndex)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Grid>

                  {/* Contents handling */}
                  {subtopic.contents.map((content, contentIndex) => (
                    <Grid container spacing={2} key={contentIndex} style={{margin:'30px'}}>
                      <Grid item xs={5}>
                        <TextField
                          label="Content Type"
                          name="content_type"
                          value={content.content_type}
                          onChange={(e) => handleContentChange(topicIndex, subtopicIndex, contentIndex, e)}
                          select
                          fullWidth
                          required
                          margin="normal"
                          SelectProps={{
                            native: true,
                          }}
                        >
                          <option value="text">Text</option>
                          <option value="video">Video</option>
                          <option value="quiz">Quiz</option>
                        </TextField>
                      </Grid>
                      <Grid item xs={5}>
                        <TextField
                          label="Content"
                          name="content"
                          value={content.content}
                          onChange={(e) => handleContentChange(topicIndex, subtopicIndex, contentIndex, e)}
                          fullWidth
                          required
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton onClick={() => handleRemoveContent(topicIndex, subtopicIndex, contentIndex)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}

                  <Button
                    startIcon={<AddCircleIcon />}
                    onClick={() => handleAddContent(topicIndex, subtopicIndex)}
                    variant="outlined"
                    sx={{ margin: '16px 0' }}
                  >
                    Add Content
                  </Button>
                </Grid>
              ))}

              <Button
                startIcon={<AddCircleIcon />}
                onClick={() => handleAddSubtopic(topicIndex)}
                variant="outlined"
                sx={{ margin: '16px 0' }}
              >
                Add Subtopic
              </Button>
            </Grid>
          ))}
          
          <Button
            startIcon={<AddCircleIcon />}
            onClick={handleAddTopic}
            variant="outlined"
            sx={{ margin: '16px 0' }}
          >
            Add Topic
          </Button>

          <Button type="submit" variant="contained" color="primary" style={{marginLeft:'30px'}}>
            Create Course
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateCourse;
