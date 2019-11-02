import { Grouping } from "../types/types";

const decodeGrouping = (groupingText: string): Grouping[] | undefined => {
    try {
        const groupingArray: Grouping[] | undefined = JSON.parse(groupingText) || undefined;
        return groupingArray;
    } catch(error) {
        throw new Error(error.message);
    }
}

export default decodeGrouping;