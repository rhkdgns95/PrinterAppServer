import { Grouping } from "../types/types";
import { DocKey } from "../lib/doc-key";

export const privateResolvers = resolvers => (parent, args, context, info) => {
    try {
        const grouping: Grouping[] = context.req.grouping;
        const Docs: DocKey[] = context.req.docs;
        if(grouping && Docs) {
            const data = resolvers(parent, args, context, info);
            return data;
        }
        return null;
    } catch(error) {
        throw new Error(error);
    }
};