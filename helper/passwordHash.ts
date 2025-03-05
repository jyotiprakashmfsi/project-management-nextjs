import bcrypt from "bcryptjs";
const saltRounds = 10;

export const hashPassword = async (pwd: string)  =>{
    const hash = bcrypt.hashSync(pwd, saltRounds);
    return hash;
}

export const checkPassword = async (pwd :string, hash: string) => {
    return bcrypt.compareSync(pwd, hash);
}