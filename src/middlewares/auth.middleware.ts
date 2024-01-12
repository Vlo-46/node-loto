import { Request, Response, NextFunction } from 'express'
import { verifyToken } from "../utils/jwt";
import { DeepPartial } from 'utility-types';

interface AuthenticatedRequest extends DeepPartial<Request> {
    user?: object;
}
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header ? ('Authorization') : null;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        const decoded = verifyToken(token);
        if (typeof decoded === 'string') {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Authorization failed' });
    }
}
