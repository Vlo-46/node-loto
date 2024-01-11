import { Request, Response } from 'express'
import PoemService from "../services/poem.service";

const getPoems = async (req: Request, res: Response) => {
    try {
        const poems = await PoemService.findAll();
        return res.send(poems)
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const addPoem = async (req: Request, res: Response) => {
    try {
        const poem = await PoemService.create(req.body)
        return res.send(poem)
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const removePoem = async (req: Request, res: Response) => {
    try {
        const data = await PoemService.remove(req.body.id)
        return res.send(data)
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const updatePoem = async (req: Request, res: Response) => {
    try {
        const { id, data } = req.body
        const poem = await PoemService.update(id, data)

        return res.send(poem)
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const getPoem = async (req: Request, res: Response) => {
    try {
        const user = await PoemService.findById(req.params.id)
        return res.send(user)
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const likeOrDislike = async (req: Request, res: Response) => {
    try {
        const poem = PoemService.likeOrDislike(req.body)
        return res.send(poem)
    } catch (e) {
        console.log('something went wrong', e)
    }
}

export {
    addPoem,
    getPoem,
    getPoems,
    updatePoem,
    removePoem,
    likeOrDislike
}