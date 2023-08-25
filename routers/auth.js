
const router = require("express").Router();

const {PrismaClient} = require("@prisma/client");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const generateIdeticon = require("../utils/generateIdenticon");

require("dotenv").config();

const prisma = new PrismaClient();

const saltRounds = 10;

const secretKey = process.env.SECRET_KEY;

//新規登録
router.post("/register", async (req, res) => {
    const {username, email, password} = req.body;

    const defalutIconImage = generateIdeticon(email);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
        data : {
            username,
            email,
            password:hashedPassword,
            profile: {
                create : {
                    bio:null,
                    profileImageUrl: defalutIconImage
                }
            }
        },
        include : {
            profile: true
        }
    });  
    
    return res.json({user:{id: user.id, email:user.email, username: user.username}});
    
});

//ログイン
router.post("/login", async (req, res) => {

    const {email, password} = req.body;
    const user = await prisma.user.findUnique( {where: {email} });
    if (!user) {
        return res.status(401).json({error:"メールアドレスかパスワードが間違っています"});
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({error:"メールアドレスかパスワードが間違っています"});
    }

    const token = jwt.sign({id: user.id}, secretKey, {expiresIn: "1d" });
    return res.json({token});
})

module.exports = router;
