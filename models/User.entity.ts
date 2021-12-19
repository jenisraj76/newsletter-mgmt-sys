import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("user_email_uindex", ["email"], { unique: true })
@Entity("user", { schema: "mail_management_db" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("text", { name: "email", unique: true })
  email: string;

  @Column("text", { name: "first_name" })
  firstName: string;

  @Column("text", { name: "last_name", default: () => "''" })
  lastName: string;

  @Column("int", { name: "age" })
  age: number;
}
