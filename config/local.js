export default {
    // Database Configuration - using local Docker setup
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 5421, // Docker compose port
    DB_NAME: process.env.DB_NAME || 'chimchar-docker',
    DB_USER: process.env.DB_USER || 'admin',
    DB_PASSWORD: process.env.DB_PASSWORD || 'admin',
}; 