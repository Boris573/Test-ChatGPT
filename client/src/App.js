import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Container,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const App = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllMessages = async () => {
    const response = await axios.get('http://localhost:3001/message');
    const { data } = response;
    setMessages(data);
  };

  useEffect(() => {
    getAllMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/message', {
        prompt: input,
      });
      const { data } = response;

      setMessages([...messages, { prompt: input, response: data.response }]);
      setInput('');
    } catch (error) {
      console.error('Error while sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={styles.listWrapper}>
        {messages.map((msg, index) => (
          <Box sx={styles.messageWrapper} key={index}>
            <Box sx={styles.userMessage}>{msg.prompt}</Box>
            <Box sx={styles.aiMessage}>{msg.response}</Box>
          </Box>
        ))}
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          label=''
          placeholder='Enter text'
          variant='outlined'
          fullWidth
          multiline
          sx={styles.textField}
          rows={3}
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton disabled={loading} type='submit' color='primary'>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>
    </Container>
  );
};

const styles = {
  listWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 150px)',
    overflow: 'auto',
    margin: 2,
  },
  messageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'space-between',
  },
  userMessage: {
    padding: 2,
    borderRadius: '20px',
    width: 'fit-content',
    maxWidth: 300,
    background: '#2f2f2f',
    color: '#fff',
    margin: 1,
    alignSelf: 'flex-end',
  },
  aiMessage: {
    width: 'fit-content',
    maxWidth: 300,
    color: '#fff',
    margin: 1,
  },
  textField: {
    position: 'fixed',
    bottom: 10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60%',
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#ebebeb',
    },
    display: 'flex',
  },
};

export default App;
