const router = require("express").Router();

const {PrismaClient} = require("@prisma/client");

const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();


router.get("/find", isAuthenticated, async (req, res) => {

    try {
        const user = await prisma.user.findUnique({where:{id:req.userId}});

        if (!user) {
            return res.status(400).json({message:"ユーザーが見つかりません"});
        }
        return res.json({user: {id:user.id, email:user.email, username:user.username}});


    } catch(error) {
        console.error(error);
        return res.status(500).json({message:error.message});
    }
});

router.get("/profile/:userId", async (req, res) => {
    const {userId} = req.params;

    try {
        const profile = 
            await prisma.profile.findUnique({where: {userId:parseInt(userId)},
                                            include : { user : {
                                                include: {
                                                    profile:true
                                                }
                                            }
                                            }
                                        });
        if (!profile) {
            return res.status(400).json({message:"プロフィールが見つかりません"});
        }    
        return res.json(profile);                                

    }  catch(error) {
        console.error(error);
        return res.status(500).json({message:error.message});
    }

})

module.exports = router;

