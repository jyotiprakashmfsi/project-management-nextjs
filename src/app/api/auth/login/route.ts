import { User } from "@/app/db/models/users"

export const POST = async (req: Request, res: Response) => {
    const body = await req.json()
    const { email, password } = body

    const user = await User.findAll()
    return new Response(JSON.stringify(user))
}