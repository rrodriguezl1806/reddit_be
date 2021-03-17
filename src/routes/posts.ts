import {Request, Response, Router} from "express";
import Post from "../entities/Post";
import {isEmpty} from "class-validator";
import auth from "../middleware/auth";
import Sub from "../entities/Sub";
import Comment from "../entities/Comment";
import User from "../entities/User";
import user from "../middleware/user";

const createPost = async (req: Request, res: Response) => {
    const {title, body, subName} = req.body

    try {
        let errors: any = {}

        // VALIDATE DATA
        if (isEmpty(title)) errors.title = 'Title must not be empty'
        if (isEmpty(body)) errors.body = 'Body must not be empty'

        if (Object.keys(errors).length > 0) return res.status(400).json(errors)

        // FIND SUB
        const sub = await Sub.findOneOrFail({ name: subName})

        // CREATE POST
        const user = res.locals.user

        const post = new Post({ title, body, subName, user, sub })
        await post.save()

        return res.json(post)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}

const getPosts = async (_: Request, res: Response) => {
    try {
        const posts = await Post.find({
            order: { createdAt: 'DESC'},
            relations: ['comments', 'user', 'votes', 'sub']
        })

        if (res.locals.user) {
            posts.forEach(p => p.setUserVote(res.locals.user))
        }

        return res.json(posts)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error})
    }
}

const getPost = async (req: Request, res: Response) => {
    const { identifier, slug } = req.params
    try {
        const post = await Post.findOneOrFail(
            { identifier, slug },
        { relations: ['sub', 'comments']}
            )
        return res.json(post)
    } catch (error) {
        console.log(error)
        return res.status(404).json({error: 'Post not found'})
    }
}

const commentOnPost = async (req: Request, res: Response) => {
    const { body } = req.body
    const { identifier, slug } = req.params
    const user: User = res.locals.user

    try {
        let errors: any = {}
        if (isEmpty(body)) errors.body = "Body must not be empty"

        if (Object.keys(errors).length > 0) return res.status(400).json({errors})

        const post = await Post.findOne({identifier, slug})

        const comment = new Comment({ body, user, post })
        await comment.save()

        return res.json(comment)
    } catch (error) {
        return res.status(500).json(error)
    }
}

const router = Router()
router.post('/', user, auth, createPost)
router.get('/', user, getPosts)
router.get('/:identifier/:slug', getPost)
router.post('/:identifier/:slug/comments', user, auth, commentOnPost)

export default router
