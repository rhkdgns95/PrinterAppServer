import { StartForGroupingMutationArgs, StartForGroupingMutationResponse, Grouping, GetDocsResponse } from "../types/types";
import { privateResolvers } from "../utils/privateResolvers";
import { DocKey } from "../core/src/lib/doc-key";

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

const QueryGetDocs = {
    GetDocs: async(_, args, { req }): Promise<GetDocsResponse>=> {
        console.log("DATA: ", req.docs);
        const data: Array<DocKey> | undefined = req.docs;
        if(data) {
            try {
                //.. 추가작업 실행.
            } catch(error) {
                return {
                    ok: false,
                    error: error.message,
                    docs: null
                };
            }
            return {
                ok: true,
                error: null,
                docs: data
            };
        } else {
            return {
                ok: false,
                error: "No documents waiting.",
                docs: null
            };
        }
    }
};

const MutationStartForGrouping = {
    StartForGrouping: privateResolvers( async (_, args: StartForGroupingMutationArgs, {req}): Promise<StartForGroupingMutationResponse> => {
        const { groupId } = args;
        try {
            const grouping: Grouping = req.grouping[groupId];
            console.log("StartForGrouping!", req.grouping[groupId]);
    
            const { pdf, sendEmail, redirect, restful } = grouping;
            let message: string = "";
            if(pdf.isChecked) {
                console.log("PDF 작업수행");
                message += "PDF 작업수행\n";
            }
            if(sendEmail.isChecked) {
                console.log("Send Email 작업수행");
                message += "Send Email 작업수행\n";
            }
            if(restful.isChecked) {
                console.log("RESTFul 작업수행");
                message += "RESTFul 작업수행\n";
            }
            if(redirect.isChecked) {
                console.log("Redirect 작업 수행");
                message += "Redirect 작업 수행\n";
            }
            return {
                ok: true,
                error: null,
                grouping,
                message
            };
        } catch(error) {
            return {
                ok: false,
                error: error.message,
                grouping: null,
                message: null
            };
        }
        
    })
}
const resolvers: Resolvers = {
    Query: {
        ...QueryGetTest,
        ...QueryGetDocs
    },
    Mutation: {
        ...MutationStartForGrouping
    }
}

export default resolvers;