const Post = require('../models/postModel')
const User = require('../models/userModel')
const uploadToCloudinary = require('../config/uploadCloudinaryConfig')
const uploadPost  = async (req , res) =>{
    if (!req.body) return res.status(400).json({"error" : "response header missing"})
    const userEmail = req.user?.email
    if (!userEmail) return res.status(400).json({"error" : "email missing in the request header"}) 
    const foundUser = await User.findOne({email : userEmail}).exec()
    if (!foundUser) return res.status(404).json({"error" : "no user with such email found"})
    const req_val_obj = checkForMisses(req)
    const allowed_genre = ['Question' , 'Announcement' , 'Event']
    if(!req_val_obj.title || !req_val_obj.content_text || !req_val_obj.genre || allowed_genre.indexOf(req_val_obj.genre) === -1 ) return res.status(400).json(req_val_obj)

    let imgSrc= ''
    try{
        if(req.file){
            const publicId = `${Date.now()}-${req.file.originalname.replace(/\.[^/.]+$/, "")}`
            const result = await uploadToCloudinary(req.file.buffer ,{
                public_id : publicId,
                folder : 'uploads',
                resource_type : 'auto'
            })

            imgSrc = result.secure_url
        }
    }        
    catch(err)
    {
       return res.status(500).json({"error" : `err was ${err.name}`})
    }

    const result = await Post.create({
        title : req_val_obj.title,
        content : {
            text : req_val_obj.content_text,
            location : req.location ||  null ,
            image : imgSrc || null
        }
        ,
        author_id : foundUser._id,
        genre  : req_val_obj.genre
    })
    console.log(result) 
    res.status(201).json({
        "message" : "success post insetion",
        "body" : result
    })
    
}

const deletePost = async (req , res)=>{

}


function checkForMisses(req){
    const title = req.body.title
    const content_text = req.body.content_text
    const genre = req.body.genre
    return {title , content_text , genre}
}
module.exports = {uploadPost}