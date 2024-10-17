const express = require('express');
const {ApolloServer} = require('@apollo/server');
const {expressMiddleware} = require('@apollo/server/express4');
const bodyParser = require("body-parser");
const cors = require('cors');
const { title } = require('process');
const {default: axios} = require('axios');

async function startServer() {
    const app = express();
    const server = new ApolloServer({

        typeDefs:`
            type User {
                id: ID!
                name:String!
                username:String!
                email:String!
                phone:String!
                website:String!
            }
            type Todo {
               id:ID!,
               title:String!
               completed:Boolean
               user:UserID!
            }

            type Query{
               getTodos:[Todo]
               getAllUsers:[User]
               getUserbyID(id:ID!):User
            }
        `,
        resolvers:{
            Todo:{
                user: async (todo)=>await  axios.get(`https://jsonplaceholder.typicode.com/users/${todo.id}`)).data
            }
            Query: {
                getTodos: async () => (await axios.get('https://jsonplaceholder.typicode.com/todos')).data;
                getAllUsers: async ()=> (await axios.get('https://jsonplaceholder.typicode.com/users')).data;
                getUserbyID: async (parent,{id}) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data;
            }  
        }
    });

    app.use(bodyParser.json());
    app.use(cors());

    await server.start();
    app.use('/graphql' , expressMiddleware(server));

    app.listen('8080',()=>{console.log("Server started at port 8080");
    })
    
}
startServer();