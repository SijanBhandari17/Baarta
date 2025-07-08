const {Readable} = require('stream')
const cloudinary = require('../config/cloudinaryConfig')
const uploadToCloudinary = (buffer , options = {})=>{
    return new Promise((resolve , reject)=>{
        const stream  = Readable.from(buffer) 
        const uploadStream = cloudinary.uploader.upload_stream({
            folder : 'uploads',
            resource_type : 'auto',
            ...options
        },
        (error , result)=>{
            if(error) reject(error)
            else resolve(result)
        }
    ) 
    stream.pipe(uploadStream)
    })
}
const handleProfilePic = async (req, res)=>{
     try{
        if(!req?.file){
            return res.status(400).json({
                error:'No file uploaded'
            })
        }
        const publicId = `${Date.now()}-${req.file.originalname.replace(/\.[^/.]+$/, "")}`
        const result = await uploadToCloudinary(req.file.buffer ,{
            public_id : publicId,
            folder : 'uploads',
            resource_type : 'auto'
        } 
        
        )
         res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        public_id: result.public_id,
        url: result.secure_url,
        original_filename: req.file.originalname,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        created_at: result.created_at,
        type: result.resource_type
      }
    })
    }
    catch(err){
    console.error('Upload error: ' , err)     
    res.status(500).json({error : err.message});
    }
}
module.exports  = handleProfilePic