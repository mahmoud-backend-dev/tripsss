const validateClass = require('../../models/class');

const  
     express = require('express') ,
     client = require("../../db/db"),
     router =express.Router();


     router.post("/",async (req,res)=>{
        try {
            const { error } = validateClass(req.body);
            if (error) return res.status(404).json({ msg: error.details[0].message });
            const{name,description}=req.body
            await client.query("CALL insert_class($1,$2);",[name,description])
            res.json({msg:"done"})
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }
     })


/// Route handler
router.get("/", async (req, res) => {
  try {
      const { rows } = await client.query("SELECT * FROM get_classes() ;");
      res.json(rows); 
  } catch (error) {
      return res.status(404).json({ msg: error.message });
  }
});

  
router.delete("/:id",async(req,res)=>{
    try {
        await client.query("CALL delete_class($1) ;",[req.params.id]);
        res.json({msg:"one class Deleted"})
    } catch (error) {
        return res.status(404).json({ msg: error.message });
    }
})




     module.exports = router;