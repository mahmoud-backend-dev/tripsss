const 
  cloadinary = require("cloudinary") ;

  cloadinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
  })

  //cloadinary uploadimage

  const cloadinaryUploadImage = async (filetoUpload)=>{
    try {
        const data = await cloadinary.uploader.upload(filetoUpload,{
            resource_type:'auto'
        })
        return data
    } catch (error) {
        return error
    }
  }

  
  //cloadinary removeimage

  const cloadinaryRemoveImage = async (publicid)=>{
    try {
        const result =await cloadinary.uploader.destroy(publicid);
         return result ;
    } catch (error) {
        return error
    }
  }

  module.exports = {cloadinaryUploadImage,cloadinaryRemoveImage}