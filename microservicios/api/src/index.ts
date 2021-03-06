require("reflect-metadata");

import { connectDb } from './dbconfig'

import { buildSchema } from "type-graphql";
import { BookResolver } from './resolvers/Book'
import { AuthorResolver } from './resolvers/Author';
import { LogResolver } from './resolvers/Log'
import { UserResolver } from "./resolvers/User";
import { RoleResolver } from "./resolvers/Role";
import { Env, isEnv } from './utils/environment'

import express, { Application } from 'express'
import cors from 'cors'
import path from 'path'
import compression from 'compression';

import { createServer } from 'http';

import { ApolloServer } from 'apollo-server-express'

import { PubSub, PubSubEngine } from 'graphql-subscriptions';
import { keycloakCustomAuthChecker } from "./utils/helpers/Auth";

export const pubsub: PubSubEngine = new PubSub();


async function main() {

  // Configuracion de variables de entorno
  const nodeEnv: Env = isEnv(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development'
  const port = process.env.API_PORT || '9000';


  // Conexion con la base de datos
  await connectDb();


  // Compilado de graphql `schema` a partir de los resolver y clases con decoradores
  const schema = await buildSchema({
    resolvers: [BookResolver, AuthorResolver, LogResolver, UserResolver, RoleResolver],
    emitSchemaFile: path.resolve(__dirname, "../../dashboard/src/graphql/schema.gql"),
    pubSub: pubsub,
    authChecker: keycloakCustomAuthChecker,
    // authMode: "null", uncomment If we need silent auth guards and don't want to return authorization errors to users
  })


  // Crea la app de express
  const app: Application = express();


  // Crea el servidor http
  const server = createServer(app);

  // Crea el servidor de apollo
  const apolloServer = new ApolloServer({
    schema, subscriptions: {
      path: "/graphql",
    },
    context: ({ req }) => {
      const context = {
        req
      };
      return context;
    },
  })

  // enpoint para verificar que el servidor http y express esta funcionando correctametne
  app.get('/healthz', (req, res) => { res.send('Everything is fine!!!') })

  // Apollo server cuenta con la siguiente funcion que agrega a la app
  // de express el servidor apollo en el path que le pasemos, este caso `/graphql`
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  /* Attach subscription server to GraphQL server */
  apolloServer.installSubscriptionHandlers(server)

  // cors and response compress middlewares
  app.use('*', cors());
  app.use(compression());


  server.listen(
    { host: '0.0.0.0', port: parseInt(port,10) },
    (): void => {
      console.log(`Enviornment: ===>>> ${nodeEnv} <<<===`);
      console.log(`\n🚀      Express server is now running on http://localhost:${port}`);
      console.log(`\n🚀      GraphQL is now running on http://localhost:${port}/graphql`);
      console.log(`\n🚀      GraphQL is now running on ws://localhost:${port}/graphql`);
    });
}
if (require.main === module) {
  main()
}