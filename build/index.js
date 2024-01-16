"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const db_1 = require("./lib/db");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const PORT = Number(process.env.PORT) || 8080;
        app.use(express_1.default.json());
        //create GraphQL Server
        const server = new server_1.ApolloServer({
            typeDefs: `
        type Query{
            hello:String
        }
        type Mutation{
            createUser(firstName:String!, lastName:String!,email: String!,password:String!):Boolean
        }
        `,
            resolvers: {
                Query: {
                    hello: () => `YOYOYO`,
                },
                Mutation: {
                    createUser: (_, { firstName, lastName, email, password }) => __awaiter(this, void 0, void 0, function* () {
                        yield db_1.prisma.user.create({
                            data: {
                                email,
                                firstName,
                                lastName,
                                password,
                                salt: "asdfasdasdasdasdas"
                            }
                        });
                        return true;
                    })
                }
            }
        });
        //Start the GraphQl Server
        yield server.start();
        app.get('/', (req, res) => {
            res.json({
                message: "Server is Up and Running"
            });
        });
        app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));
        app.use('/graphql', (0, express4_1.expressMiddleware)(server));
    });
}
init();
