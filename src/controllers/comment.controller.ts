import { Request, Response } from 'express'
import CommentService from "../services/comment.service";

const createComment = async (req: Request, res: Response) => {
    try {
        const comment = await CommentService.create(req.body)
        return res.send(comment)
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const deleteComment = async (req: Request, res: Response) => {
    try {
        const data = await CommentService.remove(req.body.id)
        return res.send(data)
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const getComments = async (req: Request, res: Response) => {
    try {
        const comments = await CommentService.getComments(req.query.poem_id as string)
        return res.send(comments)
    } catch (e) {
        console.log('something went wrong', e)
    }
}

export {
    createComment,
    deleteComment,
    getComments
}