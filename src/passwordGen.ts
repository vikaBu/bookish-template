import { client, createNewUser } from './querySelector'
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import randomBytes from 'crypto-js'
import * as crypto from "crypto";

export const passwordFunction = (password : string, salt: string) => {
    let valueToHash = password + salt;
    return crypto
    .createHash('sha256')
    .update(valueToHash)
    .digest('base64')
   

}

export const addNewUser = (newUser: any) => {
    let lengthOfSalt = 100
    let salt = crypto.randomBytes(lengthOfSalt).toString('base64');
    const hashedValue = passwordFunction( newUser.password, salt);

    return client('library_user')
        .insert({ user_name: newUser.user_name, phone_number: newUser.phone_number, email: newUser.email, address: newUser.address, saltpassword: salt, hpassword: hashedValue })

}

export const signIn = async (userInput: any) => {

    await client.transaction(async (transaction) => {

        await client('library_users')
            .where('user_name', userInput.user_name)
            .select('salt')

        await client('library_user')

    })

}
export const getMemberByUsername = (username: string) => {
    return client('library_user')
        .where('user_name', username)
        .select()
        .first()
}

interface MatchHash {
    username: string;
    password: string;
}

export const matchHash = async (username: string, password: string) => {
    const memberResult = await getMemberByUsername(username);

    const hashedValue = passwordFunction( password, memberResult.saltpassword);
    if (hashedValue == memberResult.hpassword) {
        return memberResult;  
    }
    else {
        return false;
    }
}