export interface MailAttachment {
    filename?: string,
    content?: any,
    path?: string,
    contentType?: string,
    encoding?: string,
    raw?: string

}

export interface MailOptions {
    subject: string,
    body: string,
    toEmail: string[],
    cc?: string[],
    bcc?: string[],
    attachmentsList?: MailAttachment[]
}