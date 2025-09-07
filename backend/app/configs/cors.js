const allowedOrigins = ["http://localhost:8001", "https://speedmate-client.vercel.app"];

export const corsConfig = {
    origin: (origin,callback) => {
        if(!origin || allowedOrigins.includes(origin)){
            callback(null,origin);
        }else{
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,              
}