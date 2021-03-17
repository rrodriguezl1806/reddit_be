import {Request, Response, Router} from "express";
import auth from "../middleware/auth";

import User from "../entities/User";
import Sub from "../entities/Sub";
import {isEmpty} from "class-validator";
import {getRepository} from "typeorm";
import user from "../middleware/user";
import Post from "../entities/Post";

const createSub = async (req: Request, res: Response) => {
    const { name, title, description } = req.body

    const user: User = res.locals.user

    try {
        let errors: any = {}
        // Validate data
        if (isEmpty(name)) errors.name = 'Name must no be empty'
        if (isEmpty(title)) errors.title = 'Title must no be empty'

        const sub = await getRepository(Sub)
            .createQueryBuilder('sub')
            .where('lower(sub.name) = :name', { name: name.toLowerCase() })
            .getOne()

        if (sub) errors.name = 'Sub exists already'

        if (Object.keys(errors).length > 0) return res.status(400).json(errors)

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }

    try {
        const sub = new Sub({name, title, description, user})
        await sub.save()

        return res.json(sub)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const getSub = async (req: Request, res: Response) => {
    const name = req.params.name

    try {
        const sub = await Sub.findOneOrFail({ name })
        const posts = await Post.find({
            where: { sub },
            relations: ['comments', 'user', 'votes']
        })

        sub.posts = posts

        if (res.locals.user) {
            sub.posts.forEach(p => p.setUserVote(res.locals.user))
        }

        return res.json(sub)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

const router = Router()
router.post('/', user, auth, createSub)
router.get('/:name', user, getSub)

export default router
