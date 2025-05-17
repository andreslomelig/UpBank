export interface Transaction {
    ID: string;
    senderID?: string;
    receiverID: string;
    amount: string;
    type: string;
    description: string;
    timestamp: string;
}