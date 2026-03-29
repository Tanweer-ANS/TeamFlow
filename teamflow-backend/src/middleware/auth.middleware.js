import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {
    const header = req.header("Authorization");

    if (!header) {
        return res.status(401).json({ message: "No token" });
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }


    // try {
    //     const authHeader = req.header.authorization;
    //     if(!authHeader || !authHeader.startsWith("Bearer")){
    //         return res.status(401).json({ message: "No Token" })
    //     }
    //     const token = authHeader.split(" ")[1]
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET)
    //     req.user = decoded       // This is important
    //     next();
    // } catch (error) {
    //     res.status(401).json({ message: "Invalid Credentials", error })
    // }
}

export default authMiddleware