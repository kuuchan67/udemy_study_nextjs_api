const jwt = require("jsonwebtoken");

function isAuthenticated(request, response, next) {

    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
        return response.status(401).json({message: "権限がありません"});
    }

    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
        if (error) {
            return response.status(401).json({message: "権限がありません"});
        }

        request.userId = decoded.id;
        next();
    })
}

module.exports = isAuthenticated;