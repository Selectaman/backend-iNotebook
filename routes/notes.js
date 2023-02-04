const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Note");
const { body, validationResult } = require("express-validator");
// router 1 for getting all notes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  const id = req.user.id;
  const notes = await Notes.find({ user: id });
  try {
    res.status(200).json(notes);
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: "Notes could not found" });
  }
});

// router 2 for adding a note
router.post(
  "/createnote",
  fetchuser,
  [
    body("title", "Enter a valid Title").isLength({ min: 3 }),
    body("description", "Enter a valid Description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      console.log(error);
      return res.status(400).json({ error: error.array() });
    }
    try {
      const userId = req.user.id;
      const { title, description, tag } = req.body;
      const note = await Notes.create({
        user: userId,
        title,
        description,
        tag,
      });
      await note.save();
      return res.status(200).json(note);
    } catch (e) {
      console.log(e);
      res.status(404).send(e);
    }
  }
);


// updating the note
router.put('/updatenote/:id', fetchuser, async(req, res)=> {
    const {title, description, tag} = req.body;
    const note = await Notes.findById(req.params.id);
    try {
      if(!note){
        return res.status(404).json({"error": "Note doesn't exist"});
    }

    if(note.user.toString() !== req.user.id){
        return res.status(404).json({'Error': "You are not authorised"});
    }
    let newNote = note;
    if(title){
      newNote.title = title;
    } 
    if(description){
      newNote.description = description;
    } 
    if(tag){
      newNote.tag = tag; 
    } 
    newNote = await Notes.findByIdAndUpdate(req.params.id, newNote);
    return res.status(200).json(newNote);
    } catch (error) {
      console.log(error);
      return res.status(400).json({error});
    }
    

})

//delete end point by delete api route and login required
router.delete('/deletenote/:id', fetchuser, async(req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if(!note){
        return res.status(400).send('Not found');
    }
    if(note.user.toString()!==req.user.id){
        return res.status(404).send('You are not authorised');
    }
    note = await Notes.findByIdAndDelete(req.params.id);

    res.json({'Success': 'Note has been deleted', note: note})
  } catch (e) {
    console.log(e);
    res.send('Internal Server error happened');
  }  
})

module.exports = router;
