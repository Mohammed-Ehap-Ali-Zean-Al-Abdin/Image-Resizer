import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import refresher from './db'
import cors from 'cors'
import path from 'path';
import type {
    RequestImageParams,
    RequestImageBody,
    RequestBody,
    RequestParams,
    ResponseBody,
    RequestQuery,
} from './types'

import upload from './upload'
const app = express()
import resize from './resize'


app.use(express.json())

app.use(cors({ origin: '*' }))

app.use(
    (req: Request, res: Response, next: NextFunction) => {
        next()
    },
    cors({ origin: '*' })
)
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
    return res.render("/index.html")
})

// Resize One Image Per Time
app.post(
    '/image/resize/:name/:width/:height/:format',
    (
        req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
        res: Response
    ) => {
        try {
            const requestValue = {
                widthString: req.params.width,
                heightString: req.params.height,
                format: req.params.format,
            }
            const { widthString, heightString, format } = { ...requestValue }
            const width: number = parseInt(widthString)
            const height: number = parseInt(heightString)

            const fileName =
                req.params.name.slice(9, req.params.name.length + 1) ??
                `${Date.now()}`
            if (isNaN(width) || isNaN(height))
                throw new Error('Please enter correct parameters')
            if (
                format != 'png' &&
                format != 'jpg' &&
                format != 'jpeg' &&
                format != 'gif'
            )
                throw new Error('Please enter correct parameters')
            // Check resized image
            const images = refresher()
            const image = images.filter(
                (img) => img.src == `/${fileName}_${width}*${height}.${format}`
            )
            if (image.length > 0) {
                const src = `/${fileName}_${width}*${height}.${format}`
                return res.send({ data: { image: src } })
            }
            const path =
                process.cwd() + `\\images lib\\${req.body.image.split('/')[4]}`
            const src = resize(path, format, width, height, fileName)
            return res.send({ data: { image: src } })
        } catch {
            return res.status(404).send({ error: 'Please enter correct parameters' })
        }
    }
)

// Upload One Image Per Time
app.post(
    '/image/upload/:name',
    upload.single('file'),
    (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(404).send({ data: { msg: 'No file uploaded' } })
        }
        return res.status(200).send({ data: { msg: 'file uploaded successfully!' } })
    }
)

// Get One Image
app.get(
    '/image/:src',
    (
        req: Request<
            RequestImageParams,
            ResponseBody,
            RequestImageBody,
            RequestQuery
        >,
        res: Response
    ) => {
        try {
            const images = refresher()
            const image = images.filter(
                (img) => img.src == `/${req.params.src}`
            )
            if (image.length == 0) {
                return res.status(404).send({
                    error: 'Please enter correct parameters',
                })
            }
            if (req.params.src.startsWith('original')) {
                return res.sendFile(
                    process.cwd() +
                    `/images lib/${image[0].fileName}.${image[0].format}`
                )

            }
            return res.sendFile(
                process.cwd() +
                `/images lib/${image[0].fileName}.${image[0].width}.${image[0].height}.${image[0].format}`
            )
        } catch {
            return res.status(404).send({ error: 'Please enter correct parameters' })
        }
    }
)

// Get All Images
app.get('/images', (req: Request, res: Response) => {
    const images = refresher()
    const originalImages = images.filter((img) =>
        img.fileName.startsWith('original')
    )
    return res.send({ data: originalImages })
})

export default app
