require('dotenv').config();
require('./auth/passport');
const connectToMongo=require('./dbSetup');
const express=require('express');
const session = require('express-session');
const passport = require('passport');
const cors=require('cors');
const app=express();
const port=process.env.PORT;
const { OpenAI } = require('openai');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(express.json())
app.use(cors())

app.use('/auth',require('./routes/authRoutes'))
app.use('/user',require('./routes/user'))
app.use('/item',require('./routes/item'))

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ASSISTANT_ID = 'asst_LLt5MMcLzHJSlJe6HArNZJ22'; // Replace with your actual Assistant ID

let threadId = null;

app.get('/',(req,res)=>{
    res.send("Hello!")
})

app.post('/send-message', async (req, res) => {
  const { message } = req.body;

  try {

    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
    }

    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.ASSISTANT_ID,
    });

    let completed = false;
    while (!completed) {
      const runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      console.log('Run Status:', runStatus);
      if (runStatus.status === 'completed') {
        completed = true;
      } else if (runStatus.status === 'failed') {
        return res.status(500).json({ reply: '❌ Assistant failed to respond.' });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    const messages = await openai.beta.threads.messages.list(threadId);
    const lastMessage = messages.data[0].content[0].text.value;

    res.json({ reply: lastMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: '❌ Error talking to assistant.' });
  }
});


app.listen(port,()=>{
    console.log(`App running on port ${port}`)
})
connectToMongo();