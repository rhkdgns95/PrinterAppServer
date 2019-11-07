import { StartForGroupingMutationArgs, StartForGroupingMutationResponse, Grouping, GetDocsResponse, PopDoc } from "../types/types";
import { privateResolvers } from "../utils/privateResolvers";
import { DocKey } from "../lib/doc-key";
import { Doc } from "../lib/doc";
import { Printer } from "../lib/printer";
import { PrinterManager } from "../lib/printer-manager";

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
const writeArgs = (Printers: any, args: any, doc: Doc) => {
    const printer: Printer = Printers._construct(args);
    printer.print(doc);
    Printers._is_exist_args(args);
    Printers._add_args(args);
};

const MutationStartForGrouping = {
    StartForGrouping: privateResolvers( async (_, args: StartForGroupingMutationArgs, {req}): Promise<StartForGroupingMutationResponse> => {
        const { groupId, accepted } = args;
        console.log("StartForGrouping!", req.grouping[groupId]);
        console.log("ACCEPTED: ", accepted);
        const docs: Array<DocKey> = req.docs;
        const popDoc: PopDoc = req.pop_doc;
        try {
            const doc: DocKey | undefined = docs.find(doc => doc.accepted === accepted);
            if(doc) {
                const Printers = PrinterManager._PRINTERS;
                const Types = PrinterManager._TYPES;

                const removedDoc: Doc = popDoc(doc);
                const grouping: Grouping = req.grouping[groupId];
                const { groupName } = grouping;

                console.log("FIND_DOCS: ", doc);
    
                const { pdf, sendEmail, redirect, restful } = grouping;
                
                let message: string = "";
    
                if(pdf.isChecked) {
                    console.log("PDF 작업수행");
                    
                    const argsPdf = {
                        type: "ToDisk",
                        name: `${ groupName } - PDF`,
                        path: pdf.filePath
                        /* 누락: file name. */
                    }
                    writeArgs(Printers, argsPdf, removedDoc);

                    message += "PDF 작업수행\n";
                }
    
                if(sendEmail.isChecked) {
                    console.log("Send Email 작업수행");
                    const argsSendEmail = {
                        type: "ToMail",
                        name: `${ groupName } - Send Email`,
                        mail_server: "",
                        sender_id: sendEmail.email,
                        sender_pw: sendEmail.password,
                        file_name_gen: "", // filename ??
                        mail_name_gen: sendEmail.mailTitle,
                        mail_body_gen: sendEmail.mailContent
                    };
                    
                    writeArgs(Printers, argsSendEmail, removedDoc);

                    message += "Send Email 작업수행\n";
                }

                if(restful.isChecked) {
                    console.log("RESTFul 작업수행");
                    const argsRestful = {
                        type: "ToConsole", 
                        name: `${ groupName } - RESTFul`
                    }
                    writeArgs(Printers, argsRestful, removedDoc);
                    message += "RESTFul 작업수행\n";
                }
                if(redirect.isChecked) {
                    console.log("Redirect 작업 수행");
                    const argsRedirect = {
                        type: "ToSocket",
                        name: `${ groupName } - Redirect`,
                        host: redirect.ipAddress,
                        port: redirect.port
                    };
                    writeArgs(Printers, argsRedirect, removedDoc);
                    message += "Redirect 작업 수행\n";
                }

                // let all_args: Map<string, any> = Printers._get_all_args();
                
                // for(let args of all_args) {
                //     let args_hash = args[0];
                //     let args_obj = args[1];
                // }
                
                return {
                    ok: true,
                    error: null,
                    grouping,
                    message
                };
            } else {
                return {
                    ok: false,
                    error: "Not found accepted",
                    grouping: null,
                    message: "Not found accepted"
                }
            }
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