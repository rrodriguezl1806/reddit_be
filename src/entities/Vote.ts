import {
    Entity as TOEntity,
    Column,
    ManyToOne, JoinColumn
} from "typeorm";
import Entity from "./Entity"
import Post from "./Post";
import Comment from "./Comment";
import User from "./User";

@TOEntity()
export default class Vote extends Entity {
    constructor(vote: Partial<Vote>) {
        super()
        Object.assign(this, vote)
    }

    @Column()
    value: number

    @ManyToOne(() => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username'})
    user: User

    @Column({ unique: true })
    username: string;

    @ManyToOne(() => Post )
    post: Post

    @ManyToOne(() => Comment )
    comment: Comment
}
