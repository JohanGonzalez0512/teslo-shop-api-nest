import { existsSync } from 'fs';
import { join } from 'path';
import { Injectable, BadRequestException } from '@nestjs/common';


@Injectable()
export class FilesService {


    getStaticProductImage(id: string) {
        const path = join(__dirname, '../../static/products', id);

        if (!existsSync(path))
            throw new BadRequestException('Product image not found');

        return path;


    }
}
