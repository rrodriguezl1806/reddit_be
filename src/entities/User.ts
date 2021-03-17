import {
    Entity as TOEntity,
    Column,
    Index,
    BeforeInsert, OneToMany
} from "typeorm";
import {IsEmail, Length} from "class-validator";
import bcrypt from 'bcrypt'
import { Exclude} from "class-transformer";
import Entity from "./Entity"
import Post from "./Post";
import Vote from "./Vote";

@TOEntity()
export default class User extends Entity {
    constructor(user: Partial<User>) {
        super()
        Object.assign(this, user)
    }

    @Index()
    @Length(3)
    @Column({ unique: true })
    username: string;

    @Index()
    @IsEmail()
    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column()
    @Length(6)
    password: string;

    @OneToMany(() => Post, post => post.user)
    posts: Post[]

    @OneToMany(() => Vote, vote => vote.user)
    votes: Vote[]

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 6)
    }
}
