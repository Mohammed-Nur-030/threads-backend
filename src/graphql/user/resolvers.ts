import { User } from ".";
import  { createUserPayload } from "../../services/user"
import { UserService } from "../../services/user";



const queries={
    getUserToken:async(_:any,payload:{email:string,password:string}
        )=>{
        const token=await UserService.getUserToken({
            email:payload.email,
            password:payload.password
        })
        return token;
    },
    getCurrentLoggedInUser:async(_:any,parameters:any,context: any)=>{
        // console.log("context",context)
        if(context && context.user){
            const id=context.user.id;
            const user=await UserService.getUserById(id);
            console.log("user",user)
            return user
        }else{
            throw new Error("I Dont know you");
        }
        // return 'I Dont Know Who are You'
    }

};


const mutations={
    createUser:async(_:any,payload:createUserPayload)=>{
       const response =await UserService.createUser(payload);
       return response.id;
    }
}

export const resolver={queries,mutations}