const multer = require('multer')
const storage = multer.memoryStorage() 
const uploads = multer({
    storage ,
    limits : {
        fileSize : 10*1024*1024
    },
    fileFilter : (req , file , cb)=>{
        const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'video/mp4',
      'video/quicktime',
      'video/webm'
        ]
    if(allowedMimes.includes(file.mimetype)){
        cb(null , true)
    }
    else{
        cb(new Error('Invalid file type.'))
    }
    }
})
module.exports = uploads.single('postImage')