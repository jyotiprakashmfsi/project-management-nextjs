import * as filestack from 'filestack-js';

export const client = filestack.init(process.env.NEXT_PUBLIC_FILESTACK_SECRET || '');