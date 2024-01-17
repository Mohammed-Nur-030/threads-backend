import express from 'express'
import { expressMiddleware } from '@apollo/server/express4'
import { createApolloGraphQLServer } from './graphql';
import { UserService } from './services/user';

async function init() {

    const app = express()
    const PORT = Number(process.env.PORT) || 8080
    app.use(express.json())


    const gqlServer=await createApolloGraphQLServer()
    app.use('/graphql', expressMiddleware(gqlServer,
        { context:async({req,res})=>{
        //@ts-ignore
        const token=req.headers['token']
        try{
           
            const user=UserService.decodeJWTToken(token as string);
            return {user};

        }catch(err){
            return{};
        }
    }}));
    
    app.get('/', (req, res) => {
        res.json(
            {
                message: "Server is Up and Running"
            }
        )
    })

    app.listen(PORT, () => console.log(`Server Running at port ${PORT}`))


}
init();