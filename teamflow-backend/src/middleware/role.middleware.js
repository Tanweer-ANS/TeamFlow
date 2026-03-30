const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return req.status(403).json(
                {
                    message: "Access Denied"
                }
            )
        }
        next();
    }
}

export default authorizeRoles