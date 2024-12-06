import sharp from 'sharp'
import type { FormatEnum, AvailableFormatInfo } from 'sharp'

function resize(
    path: string,
    format: keyof FormatEnum | AvailableFormatInfo,
    width: number,
    height: number,
    fileName: string
): string | Error {
    let transform = sharp(path)

    if (format) {
        transform = transform.toFormat(format)
    }

    if (width || height) {
        transform = transform.resize(width, height)
    }
    transform.toFile(
        `${process.cwd()}\\images lib\\${fileName}.${width}.${height}.${format}`,
        (err) => {
            if (err) {
                throw err
            }
        }
    )

    return `/${fileName}_${width}*${height}.${format}`
}
export default resize
