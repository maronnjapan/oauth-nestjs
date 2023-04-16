export class ApproveDto {
    reqid: string
    userId: string
    scope: string[];
    approve?: 'Approve';
    deny?: 'Deny';
}