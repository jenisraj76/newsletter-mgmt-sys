import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("logs", { schema: "mail_management_db" })
export class Logs {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("timestamp", {
    name: "created_ts",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdTs: Date;

  @Column("text", { name: "email_id", default: () => "''" })
  emailId: string;

  @Column("text", { name: "newsletter_name", default: () => "''" })
  newsletterName: string;
}
