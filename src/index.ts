import express from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4'
import { prisma } from './lib/db';


async function init() {


    const app = express()
    const PORT = Number(process.env.PORT) || 8080
    app.use(express.json())

    //create GraphQL Server
    const server = new ApolloServer({
        typeDefs: `
        type Query{
            hello:String
        }
        type Mutation{
            createUser(firstName:String!, lastName:String!,email: String!,password:String!):Boolean
        }
        `,
        resolvers: {
            Query:{
                hello:()=>`YOYOYO`,
            },
            Mutation: {
                createUser: async(_,
                    {
                        firstName,lastName,email,password
                    }:{
                        firstName: string;lastName: string;email: string;password: string})=>{
                            await prisma.user.create({
                                data:{
                                    email,
                                    firstName,
                                    lastName,
                                    password,
                                    salt:"asdfasdasdasdasdas"
                                }
                            })
                            return true;
                        }
            }
        }
    })

    //Start the GraphQl Server
    await server.start();


    app.get('/', (req, res) => {
        res.json(
            {
                message: "Server is Up and Running"
            }
        )
    })
    app.listen(PORT, () => console.log(`Server Running at port ${PORT}`))
    app.use('/graphql', expressMiddleware(server));


}
init();