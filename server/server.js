import Hapi from "@hapi/hapi";

const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "localhost",
    router: {
        stripTrailingSlash: true,
      },
});

const registerRoutes = async (server) => {
    await server.register([
        // {}
    ])
    console.log("Routes registered successfully");
}


const configureServer = async () => {
    await registerRoutes(server);
    return server;
}

export default configureServer;