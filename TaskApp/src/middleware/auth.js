const jwt = require("jsonwebtoken");
const userModel = require("../../models/user");

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace("Bearer ", "");
        const decoded = jwt.verify(token, "tokenKey");
        const user = await userModel.findOne({_id: decoded._id, "tokens.token": token});
        if(!user)
        {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(403).send({error: "Forbidden Access", err: e});
    }
}

module.exports = auth;