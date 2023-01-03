const notes = require("express").Router();

const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require("../helper/fsUtils");
const uuid = require("../helper/uuid");

// GET Route for retrieving all the notes
notes.get("/", (req, res) => {
  console.info(`${req.method} request received for notes`);

  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

//Get Route for a specific note
notes.get("/:id", (req, res) => {
  const noteId = req.params.id;
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.note_id == noteId);
      console.log(result);
      return result.length > 0
        ? res.json(result)
        : res.json("No note with that ID");
    });
});

//POST Route for a new note
notes.post("/", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, "./db/db.json");
    res.json(`Note added successfully 🚀`);
  } else {
    res.error("Error in adding note");
  }
});

//DELETE Route for a note
notes.delete("/:id", (req, res) => {
  console.info(`${req.method} request received to delete a note`);

  const noteId = req.params.id;

  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id != noteId);

      writeToFile("./db/db.json", result);

      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

module.exports = notes;
