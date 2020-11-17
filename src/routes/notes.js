const router = require("express").Router();
const Note = require('../models/Note');


router.get('/notes/add',(req,res) =>{
    res.render('notes/new-note');
});

router.post('/notes/new-note',async (req,res)=>{
    console.log(req.body)
    const {title,description} = req.body
    const errors = [];
    
    if(!title){
        errors.push({text : "please write a title"})
    }
    
    if(!description){
        errors.push({text : "please write a description"})
    }
    
    if(errors.length > 0){
        res.render('notes/new-note',{
            errors,
            title,
            description
        })
    }
    else
    {
        const newNote = new Note({title,description})
        await newNote.save();
        req.flash('success_msg','Note added successfully')
        res.redirect('/notes');
    }
})

 router.get('/notes', async (req, res) => {
    const note = await Note.find().lean();
    res.render('notes/all-notes', { notes: {...note}}) 
 })


 router.get('/notes/edit/:id',async(req,res)=>{  
  const documentos = await Note.findById(req.params.id).lean()
  //encontrar una forma de ordenar por fecha el contexto
  res.render('notes/edit-notes',{ note: {...documentos}});
 })
 
 router.put('/notes/edit-notes/:id',async(req,res)=>{
    const {title,description} = req.body;
    await Note.findByIdAndUpdate(req.params.id,{title,description});
    req.flash('success_msg','Note Updated successfully')
    res.redirect('/notes');
 })

router.delete('/notes/delete/:id',async(req,res)=>{
    await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg','Note Deleted successfully')
    res.redirect('/notes');
})

module.exports = router; 