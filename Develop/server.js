const express = require('express');
const path = require('path');
const router = express.Router();
const notesData = require('./db/db.json');
const uuid = require('./helpers/uuid');
const fs = require('fs');

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

app.get('/api/notes', (req, res) => res.json(notesData));

app.post('/api/notes', (req, res) => {
    console.log("POST success");

    let storedNotes = fs.readFileSync("./db/db.json", "utf-8");
    let parsedNotes = JSON.parse(storedNotes);

    const {title, text} = req.body;

    const newNote = {
        title,
        text,
        id: uuid(),
    };

    parsedNotes.push(newNote);

    storedNotes = JSON.stringify(parsedNotes);

    fs.writeFileSync("./db/db.json", storedNotes, "utf-8");
});

app.delete(`/api/notes/:id`, (req, res) => {
    console.log("DELETE success");
    console.log(req.params.id);

    const requestedDelete = req.params.id;

    let storedNotes = fs.readFileSync("./db/db.json", "utf-8");
    let parsedNotes = JSON.parse(storedNotes);
    console.log(parsedNotes);

    for(let i = 0; i < parsedNotes.length; i++){
        if(requestedDelete == parsedNotes[i].id){
            console.log("found match");
            parsedNotes.splice(i, 1);
            console.log(parsedNotes);
        }
    }

    storedNotes = JSON.stringify(parsedNotes);

    fs.writeFileSync("./db/db.json", storedNotes, "utf-8");
});

app.listen(PORT, () =>
    console.log(`http://localhost:${PORT}`)
);