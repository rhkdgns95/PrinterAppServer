import { StartForGroupingMutationArgs, StartForGroupingMutationResponse, Grouping } from "../types/types";
import { privateResolvers } from "../utils/privateResolvers";

type Resolver = (parent: any, args: any, context: any, info: any) => any;

interface Resolvers {
    [name: string]: {
        [name: string]: Resolver
    }
}

const QueryGetTest = {
    GetTest: async() => {
        return "Hello";
    }
} 
const MutationStartForGrouping = {
    StartForGrouping: privateResolvers( async (_, args: StartForGroupingMutationArgs, {req}): Promise<StartForGroupingMutationResponse> => {
        const { groupId } = args;
        const grouping: Grouping = req.grouping[groupId];
        console.log("StartForGrouping!");
        return {
            ok: true,
            error: null,
            grouping
        };
    })
}
const resolvers: Resolvers = {
    Query: {
        ...QueryGetTest
    },
    Mutation: {
        ...MutationStartForGrouping
    }
}

export default resolvers;