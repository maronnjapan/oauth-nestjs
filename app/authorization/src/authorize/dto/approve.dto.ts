export class ApproveDto {
    reqid: string
    scope: string[];
    approve?: 'Approve';
    deny?: 'Deny';
    email: string;
    password: string;
}