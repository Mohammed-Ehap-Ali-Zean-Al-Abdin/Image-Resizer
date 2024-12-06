import resize from '../resize'
import sharp from 'sharp'

// Mock the `sharp` library
jest.mock('sharp', () =>
    jest.fn().mockReturnValue({
        toFormat: jest.fn().mockReturnThis(),
        resize: jest.fn().mockReturnThis(),
        toFile: jest.fn().mockImplementation((outputPath, callback) => {
            callback?.(null)
        }),
    })
)

describe('resize function', () => {
    const mockFilePath = `${process.cwd()}\\images lib\\`

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should resize an image and return the new path', async () => {
        const result = resize(
            '\\images lib\\original_computer.jpeg',
            'jpg',
            100,
            100,
            'computer'
        )

        expect(sharp).toHaveBeenCalledWith(
            '\\images lib\\original_computer.jpeg'
        )
        expect(sharp().toFormat).toHaveBeenCalledWith('jpg')
        expect(sharp().resize).toHaveBeenCalledWith(100, 100)
        expect(sharp().toFile).toHaveBeenCalledWith(
            `${mockFilePath}computer.100.100.jpg`,
            expect.any(Function)
        )
        expect(result).toBe('/computer_100*100.jpg')
    })

    it('should throw an error if `sharp` fails', async () => {
        ;(sharp().toFile as jest.Mock).mockImplementationOnce(
            (outputPath, callback) => {
                callback(new Error('sharp error'))
            }
        )

        expect(() =>
            resize(
                '\\images lib\\original_computer.jpeg',
                'jpg',
                100,
                100,
                'computer'
            )
        ).toThrow('sharp error')
    })

    it('should not call resize if width and height are not provided', () => {
        resize('\\images lib\\original_computer.jpeg', 'jpg', 0, 0, 'computer')

        expect(sharp().resize).not.toHaveBeenCalled()
    })
})
