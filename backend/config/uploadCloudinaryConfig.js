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
module.exports  = uploadToCloudinary