import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import "./config/passport";

// routes
import authRoute from './routes/auth';

const app = express();



mongoose.connect(process.env.MONGODB_URI!)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));


app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI!
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoute);


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});