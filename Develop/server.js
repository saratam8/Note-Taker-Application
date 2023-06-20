const express = require('express');
const path = require('path');
const router = express.Router();
const notesData = require('./db/db.json');

// const api = require('./routes/index');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join('public')));

// app.use('/api', api);

var publicPath = path.join(__dirname, 'public');

app.get('/', (req, res) => 
    res.sendFile(path.join(_dirname, './public/index.html'))
);

app.get('/notes', (req, res) => 
    res.sendFile(publicPath +  '/notes.html')
);

app.listen(PORT, () =>
    console.log(`http://localhost:${PORT}`)
);