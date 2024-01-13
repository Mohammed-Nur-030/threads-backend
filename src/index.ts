import express from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4'


async function init() {


    const app = express()
    const PORT = Number(process.env.PORT) || 8000
    app.use(express.json())

    //create GraphQL Server
    const server = new ApolloServer({
        typeDefs: `
        type Query{
            hello:String
        }
        `,
        resolvers: {
            Query:{
                hello:()=>`YOYOYO`,
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