import app from '../app'
import request from 'supertest'
import path from 'path'

describe('Express App', () => {
    describe('GET /', () => {
        it('should return a welcome message', async () => {
            const response = await request(app).get('/')
            expect(response.status).toBe(200)
            expect(response.text).toBe('Hello, TypeScript Node Express!')
        })
    })

    describe('POST /image/resize/:name/:width/:height/:format', () => {
        it('should resize an image and return the new image path', async () => {
            const response = await request(app)
                .post('/image/resize/original_computer/100/100/jpg')
                .send({
                    image: '/image/original_computer.jpeg',
                })
            expect(response.status).toBe(200)
            expect(response.body.data.image).toEqual('/computer_100*100.jpg')
        })

        it('should return an error for invalid parameters', async () => {
            const response = await request(app)
                .post('/image/resize/original_computer/invalid/invalid/jpg')
                .send({ image: 'original_computer.jpeg' })
            expect(response.status).toBe(404)
            expect(response.body.error).toBe('Please enter correct parameters')
        })
    })

    describe('POST /image/upload/:name', () => {
        it('should upload an image and return a success message', async () => {
            const response = await request(app)
                .post('/image/upload/asus')
                .attach('file', path.join(__dirname, '/testFiles/asus.jpg'))
            expect(response.status).toBe(200)
            expect(response.body.data.msg).toBe('file uploaded successfully!')
        })

        it('should return an error if no file is uploaded', async () => {
            const response = await request(app).post('/image/upload/test-image')
            expect(response.status).toBe(404)
            expect(response.body.data.msg).toBe('No file uploaded')
        })
    })

    describe('GET /image/:src', () => {
        it('should return the requested image', async () => {
            const response = await request(app).get('/image/original_asus.jpeg')
            expect(response.status).toBe(200)
        })

        it('should return an error for invalid image source', async () => {
            const response = await request(app).get('/image/invalid.png')
            expect(response.status).toBe(404)
            expect(response.body.error).toEqual(
                'Please enter correct parameters'
            )
        })
    })

    describe('GET /images', () => {
        it('should return all images', async () => {
            const response = await request(app).get('/images')
            expect(response.status).toBe(200)
            expect(response.body.data).toBeInstanceOf(Array)
        })
    })
})
