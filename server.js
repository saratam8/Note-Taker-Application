// Importing the needed files and libraries
const express = require('express');
const path = require('path');
const notesData = require('./db/db.json');
const uuid = require('./helpers/uuid');
const fs = require('fs');

// Setting up the port and express
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static assests
app.use(express.static(path.join('public')));

// Setting up the path for the webpage
var publicPath = path.join(__dirname, 'public');

app.get('/', (req, res) => 
    res.sendFile(path.join(_dirname, './public/index.html'))
);

app.get('/notes', (req, res) => 
    res.sendFile(publicPath +  '/notes.html')
);

// GET to notes page so that notes in db.json can be used
app.get('/api/notes', (req, res) => res.json(notesData));

app.post('/api/notes', (req, res) => {
    console.log("POST success");

    // Reading db.json and storing the existing notes into parsedNotes
    let storedNotes = fs.readFileSync("./db/db.json", "utf-8");
    let parsedNotes = JSON.parse(storedNotes);

    //Destructuring the request
    const {title, text} = req.body;

    // Setting up the new note
    const newNote = {
        title,
        text,
        id: uuid(),
    };

    // Adding the new note to the previously existing notes and creating new db.json file
    parsedNotes.push(newNote);

    storedNotes = JSON.stringify(parsedNotes, null, 4);
    res.redirect('/notes');

    fs.writeFileSync("./db/db.json", storedNotes, "utf-8");
});

app.delete(`/api/notes/:id`, (req, res) => {
    console.log("DELETE success");

    // Get the id of the note that a DELETE request was sent for
    const requestedDelete = req.params.id;

    // Read db.json for the existing notes and storing it into parsedNotes
    let storedNotes = fs.readFileSync("./db/db.json", "utf-8");
    let parsedNotes = JSON.parse(storedNotes);

    // Iterate through the existing notes to find the note with the same id as the DELETE request
    // Once the matching note is found, it is spliced out of the parsedNotes data
    for(let i = 0; i < parsedNotes.length; i++){
        if(requestedDelete == parsedNotes[i].id){
            console.log("found match");
            parsedNotes.splice(i, 1);
            console.log(parsedNotes);
        }
    }

    // Writing the new notes list to a new db.json 
    storedNotes = JSON.stringify(parsedNotes, null, 4);
    res.redirect('/notes');

    fs.writeFileSync("./db/db.json", storedNotes, "utf-8");
});

// Listen to the port
app.listen(PORT, () =>
    console.log(`http://localhost:${PORT}`)
);