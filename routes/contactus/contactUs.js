

const  
     express = require('express') ,
     client = require("../../db/db"),
     validateContact = require('../../models/contactus'),
     router =express.Router();


router.post("/",async(req,res)=>{
    try {
        const { error } = validateContact(req.body);
        if (error) return res.status(404).json({ msg: error.details[0].message });
        let{
            name,
            mail,
            description
        }=req.body;
        await client.query("CALL insert_contactus($1,$2,$3);",[name,mail,description])
        res.json({msg:"one contact us inserted "});
    } catch (error) {
        return  res.status(404).json({msg:error.message})
    }
})

router.get("/",async(req,res)=>{
    try {
        let result = await client.query("SELECT * FROM get_contactus() ;")
        res.json(result.rows)
    } catch (error) {
        return  res.status(404).json({msg:error.message})
    }
})

router.delete("/:id",async(req,res)=>{
    try {
        let {id}=req.params;
        await client.query("CALL delete_contactus($1);",[id]);
        res.json({"msg":"one contact us is deleted "});
    } catch (error) {
        return  res.status(404).json({msg:error.message})
    }
})



















     module.exports = router