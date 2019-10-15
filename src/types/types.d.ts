type Grouping = {
    groupName: string;
    pdf: {
        isChecked: boolean;
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
