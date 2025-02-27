const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';

export const hashPassword = async (pwd: string)  =>{
    const hash = bcrypt.hashSync(pwd, saltRounds);
    return hash;
}

export const checkPassword = async (pwd :string, hash: string) => {
    bcrypt.compare(myPlaintextPassword, hash, function(result: any) {
        return result==true;
    });
}