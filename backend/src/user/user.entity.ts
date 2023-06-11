import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    userId: string;

    @Column({ nullable: true })
    userPwd: string;

    @Column({ nullable: true })
    fullName: string;

    @Column({ nullable: true })
    companyName: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    accessToken: string;


}