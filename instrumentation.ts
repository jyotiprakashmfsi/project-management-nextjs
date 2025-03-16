import { run } from './db/models/mongodb'
import dbConnect from './db/models/mongodb/connection'

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        await dbConnect()
    }
    // await run();
}
