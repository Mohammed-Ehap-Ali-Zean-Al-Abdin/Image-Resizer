import fs from 'fs'
const imagesFolder = `${process.cwd()}/images lib/`
type Image = {
    fileName: string
    width: string | undefined
    height: string | undefined
    format: string
    src: string
}
function refresher(): Image[] {
    const images = fs.readdirSync(imagesFolder)
    const dbOfImages = images.map((image) => {
        let fileName, width, height, format, src

        if (image.startsWith('original')) {
            fileName = image.slice(0, image.lastIndexOf('.'))
            format = image.slice(image.lastIndexOf('.') + 1, image.length + 1)
            src = `/${fileName}.${format}`
        } else {
            fileName = image.split('.')[0]
            width = image.split('.')[1]
            height = image.split('.')[2]
            format = image.split('.')[3]
            src = `/${fileName}_${width}*${height}.${format}`
        }

        return { fileName, width, height, format, src }
    })
    return Array.from(dbOfImages)
}
export default refresher
