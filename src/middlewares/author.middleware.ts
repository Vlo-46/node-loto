// import {NextFunction, Request, Response} from "express";
// import {verifyToken} from "../utils/jwt";
// import {DeepPartial} from "utility-types";
// import UserService from "../services/user.service";
//
// interface AuthenticatedRequest extends DeepPartial<Request> {
//     user?: object;
// }
//
// export const authorMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const token = req.header('Authorization');
//         if (!token) {
//             return res.status(401).json({ message: 'Unauthorized - Missing token' });
//         }
//
//         const decoded = verifyToken(token);
//         if (typeof decoded === 'string') {
//             return res.status(401).json({ message: 'Unauthorized - Invalid token' });
//         }
//
//         next();
//     } catch (error) {
//         res.status(401).send({ error: 'Authorization failed' });
//     }
// }