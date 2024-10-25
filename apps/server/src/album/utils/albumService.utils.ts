import { HttpException } from "@nestjs/common"

export const isValidMongoId = (id: string): Boolean => {
    return !!id.match(/^[0-9a-fA-F]{24}$/)
}