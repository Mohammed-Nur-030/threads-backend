import { prisma } from "../lib/db"
import { createHmac, randomBytes} from 'node:crypto'
import * as  jwt  from "jsonwebtoken"

const jwtSecret='Superman@123'
export interface createUserPayload{
    firstName:string
    lastName:string
    email:string
    password:string
}
export interface getUserTokenPayload{
    email:string,
    password:string,
}

 export class UserService{

    private static generateHash(salt:string,password:string){
        const hashedPassword=createHmac('sha256',salt).update(password).digest("hex");
        return hashedPassword;
    }



    public static createUser(payload:createUserPayload){
        const {firstName,lastName,email,password}=payload
        const salt=randomBytes(32).toString('hex');
      const hashedPassword=UserService.generateHash(salt,password);
            return prisma.user.create({
                data:{
                    firstName,
                    lastName,
                    email,
                    password:hashedPassword,
                    salt,
                }
            });
    }

    public static  async getUserByEmail(email:string){
        return prisma.user.findUnique({where:{email}});   
    }

    public static getUserById(id:string){
        return prisma.user.findUnique({where:{id}})
    }
   
    
    public static async getUserToken(payload: getUserTokenPayload){
        const {email,password}=payload;

        const user= await UserService.getUserByEmail(email);
        // console.log("User",user)
        if(!user){
            throw new Error("User Not Found");
        }
        const usersalt=user.salt
        const userHashedPassword=UserService.generateHash(usersalt,password)
        
        if(userHashedPassword!==user.password){
            throw new Error("InCorrect Password");
        }

        //Generate Token
        const token=jwt.sign({id:user.id,email:user.email},jwtSecret);
        // console.log("token",token)
        return token;

    
    }

    public static decodeJWTToken(token:string){
        return jwt.verify(token,jwtSecret);
    }

}

