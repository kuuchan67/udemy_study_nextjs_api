
const router = require("express").Router();

const {PrismaClient} = require("@prisma/client");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const isAuthenticated = require("../middlewares/isAuthenticated")



require("dotenv").config();

const prisma = new PrismaClient();

const saltRounds = 10;

const secretKey = process.env.SECRET_KEY;

//投稿
router.post("/post", isAuthenticated, async (req, res) => {
    const {content} = req.body;

    if (!content) {
        return res.status(400).json({"message":"投稿データがありません"});
    }

    try {
        const newPost = await prisma.post.create(
            {
               data: {
                content,
                authorId:req.userId
               }, include : {
                author: {
                    include : {
                        profile:true
                    }
                }
               }
            }
        )
        return res.json(newPost);

    } catch(error) {
        console.error(error);
        return res.status(500).json({message:"サーバーエラーです"});
    }

    
});

//投稿取得
router.get("/posts", async (req, res) => {

    try {
        const posts = await prisma.post.findMany({
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
                author: {
                    include : {
                        profile: true
                    }
                    
                }
            }
        });
        return res.json({posts});
    } catch(error) {
        console.error(error);
        return res.status(500).json({message:"サーバーエラーです"});
    }

})

//特定のユーザーの投稿
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const posts = await prisma.post.findMany({
            where: {
                authorId: parseInt(userId),
              },
              orderBy: {
                createdAt: "desc",
              },
              include: {
                author: true,
              },
        });
        return res.json(posts);
    
    }catch(error) {
        console.error(error);
        return res.status(500).json({message:"サーバーエラーです"});
    }

})

module.exports = router;
