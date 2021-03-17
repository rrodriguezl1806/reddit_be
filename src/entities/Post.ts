import {
    Entity as TOEntity,
    Column,
    Index,
    ManyToOne, BeforeInsert, OneToMany
} from "typeorm";
import Entity from "./Entity"
import User from "./User";
import {JoinColumn} from "typeorm";
import {makeId, slugify} from "../utils/helpers";
import Sub from "./Sub";
import Comment from "./Comment";
import Vote from "./Vote";
import {Exclude, Expose} from "class-transformer";

@TOEntity('posts')
export default class Post extends Entity {
    constructor(post: Partial<Post>) {
        super()
        Object.assign(this, post)
    }

    @Index()
    @Column({ unique: true })
    identifier: string;

    @Column()
    title: string;

    @Index()
    @Column()
    slug: string;

    @Column({ nullable: true, type: 'text'})
    body: string;

    @Column()
    subName: string;

    @ManyToOne(() => User, user => user.posts)
    @JoinColumn({ name: 'username', referencedColumnName: 'username'})
    user: User

    @ManyToOne(() => Sub, sub => sub.posts)
    @JoinColumn({ name: 'subName', referencedColumnName: 'name'})
    sub: Sub

    @Exclude()
    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[]

    @Exclude()
    @OneToMany(() => Vote, vote => vote.post)
    votes: Vote[]

    @Expose() get commentCount(): number {
        return this.comments?.length
    }

    @Expose() get voteScore(): number {
        return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0)
    }

    protected userVote: number
    setUserVote(user: User) {
        const index = this.votes?.findIndex(v => v.username === user.username)
        this.userVote = index > -1 ? this.votes[index].value : 0
    }

    @BeforeInsert()
    makeIdAndSlug() {
        this.identifier = makeId(7)
        this.slug = slugify(this.title)
    }

}
