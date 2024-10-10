import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login"}),
    (req, res) => {
        res.redirect('${process.env.CLIENT_URL}/dashboard'); // note: replace with your client URL
    }
);

export default router;