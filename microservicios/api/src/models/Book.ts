import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Author } from "./Author";
import { Edition } from "./Edition";

@Entity()
@ObjectType()
export class Book extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ nullable: true})
  title: string;

  
  @Field(() => Boolean)
  @Column({ default: false })
  isPublished: boolean;


  @Field(() => Number)
  @Column()
  authorId: number;

  @Field(() => Author)
  @ManyToOne(type => Author, author => author.books)
  public author: Author
  
  @Field(() => [Edition])
  @OneToMany(type => Edition, edition => edition.book)
  public editions: Edition[]

}