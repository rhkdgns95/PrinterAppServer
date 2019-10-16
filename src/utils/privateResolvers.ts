import { Grouping } from "../types/types";

export const privateResolvers = resolvers => (parent, args, context, info) => {
    try {
        const grouping: Grouping[] = context.req.grouping;
        if(grouping) {
            const data = resolvers(parent, args, context, info);
            return data;
        }
        return null;
    } catch(error) {
        throw new Error(error);
    }
};