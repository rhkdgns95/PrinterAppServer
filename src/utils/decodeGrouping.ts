import { Grouping } from "../types/types";

const decodeGrouping = (groupingText: string): Grouping[] | undefined => {
    console.log("전송받음: ", groupingText);
    try {
        const groupingArray: Grouping[] | undefined = JSON.parse(groupingText) || undefined;
        return groupingArray;
    } catch(error) {
        console.log("ERROR: ", error);
        throw new Error(error.message);
    }
}

export default decodeGrouping;