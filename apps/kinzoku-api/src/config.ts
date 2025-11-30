import dotenv from "dotenv";
dotenv.config();

const config = {
    jwtsecret: process.env.JWT_SECRET || 'secret',
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGO_URI,
    pepper: process.env.PEPPER || 'hari',
    frontendURI: process.env.FRONTEND_URL
}

export default config;