import express from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4'
import {User} from './user'

export async function createApolloGraphQLServer(){
        //create GraphQL Server
        const server = new ApolloServer({
            typeDefs:`
            ${User.typeDefs}
            type Query{
                ${User.queries}
                getContext: String
            }
            type Mutation{
                ${User.mutations}
            }
            `,
            resolvers: {
                Query:{
                    ...User.resolver.queries,
                    getContext:(_:any,parameters:any,context)=>{
                        console.log("context",context)
                        return "OK"
                    }
                },
                Mutation:{
                    ...User.resolver.mutations,
                }
               
            }
        })
    
        //Start the GraphQl Server
        await server.start();

       
        // Return the ApolloServer instance
        return server; 
    
}