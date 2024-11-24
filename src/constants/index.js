//constants
import path from 'node:path';

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const GENDER = {
    WOMAN: 'woman',
    MAN: 'man',
};

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');