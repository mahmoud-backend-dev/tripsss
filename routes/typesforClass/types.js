const validateType = require('../../models/type');

const  
     express = require('express') ,
     client = require("../../db/db"),
     router =express.Router();


     router.post("/",async (req,res)=>{
        try {
            const { error } = validateType(req.body);
            if (error) return res.status(404).json({ msg: error.details[0].message });
            const{class_id,name,description}=req.body
            await client.query("CALL insert_types($1,$2,$3);",[class_id,name,description])
            res.json({msg:"done"})
        } catch (error) {
            return  res.status(404).json({msg:error.message})
        }
     })


/// Route handler
router.get("/:classId", async (req, res) => {
  try {
      const { rows } = await client.query("SELECT * FROM get_types($1) ;",[req.params.classId]);
      res.json(rows); 
  } catch (error) {
      return res.status(404).json({ msg: error.message });
  }
});

  



     module.exports = router;