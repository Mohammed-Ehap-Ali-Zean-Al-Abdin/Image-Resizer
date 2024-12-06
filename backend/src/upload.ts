import { Request } from 'express'
import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
    ): void {
        cb(null, `${process.cwd()}/images lib/`)
    },
    filename: function (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
    ): void {
        if(file.mimetype.split('/')[0] !== 'image'){
            cb(new Error('Only images are allowed'), '')
        }
        cb(null, `original_${req.params.name}.${file.mimetype.split('/')[1]}`)
    },
})
const upload = multer({ storage })
export default upload
