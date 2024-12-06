import type { FormatEnum, AvailableFormatInfo } from 'sharp'
interface RequestImageParams {
    src: string
}
interface RequestImageBody {}

interface RequestParams {
    width: string
    height: string
    format: keyof FormatEnum | AvailableFormatInfo
    name: string
}

interface ResponseBody {}

interface RequestBody {
    image: string
}

interface RequestQuery {}
export {
    RequestImageParams,
    RequestImageBody,
    RequestParams,
    ResponseBody,
    RequestBody,
    RequestQuery,
}
