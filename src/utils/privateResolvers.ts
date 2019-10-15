import { Grouping } from "../types/types";

export const privateResolvers = resolvers => (parent, args, context, info) => {
    if(context.req.grouping) {
        const grouping: Grouping[] = context.req.grouping;
        const data = resolvers(parent, args, context, info);
        return data;
    } else {
        throw new Error("No Grouping");
    }
};