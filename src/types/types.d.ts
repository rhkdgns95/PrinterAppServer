type Grouping = {
    groupName: string;
    pdf: {
        isChecked: boolean;
        filePath: string;
        fileName: string;
    },
    sendEmail: {
        isChecked: boolean;
        email: string;
        password: string;
        destinationEmails: string;
        mailTitle: string;
        mailContent: string;
    },
    restful: {
        isChecked: boolean;
        isLogging: boolean;
        isSendFile: boolean;
        data: string;
    },
    redirect: {
        isChecked: boolean;
        ipAddress: string;
        port: string;
    }
}
export interface StartForGroupingMutationArgs {
    groupId: number;
}
export interface StartForGroupingMutationResponse {
    ok: boolean;
    error: string | null;
    grouping: Grouping | null;
}
