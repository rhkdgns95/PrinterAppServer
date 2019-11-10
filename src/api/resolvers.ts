import { StartForGroupingMutationArgs, StartForGroupingMutationResponse, Grouping, GetDocsResponse, PopDoc } from "../types/types";
import { privateResolvers } from "../utils/privateResolvers";
import { DocKey } from "../lib/doc-key";
import { Doc } from "../lib/doc";
import { Printer } from "../lib/printer";
import { PrinterManager } from "../lib/printer-manager";
import fs from "fs";

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

/**
 *  StoragePath
 * 
 *  파일이 임시로 저장되는 PATH 
 */
const StoragePath = `${__dirname}/../out/_asset/converted/`;

/**
 *  GetFilePath: (path: string) => string;
 * 
 *  @param path 
 *  File의 FullPath로부터 
 *  순수한 FileName을 가지고온다.
 */
const GetFilePath = (path: string): string => {
    const startIdx: number = path.lastIndexOf("\\");
    const fileName = path.substr(startIdx + 1);
    return fileName;
}
/**
 *  GetBase64Encode
 * 
 *  먼저, 브라우저에서 로컬파일경로로 접근할수 없다는점을 알아두자.
 *  그래서 url을 base64Encode 시킨다음 이미지만 보여주도록 한다.
 *  
 *  요구사항 - [ Local_File_Path + 파일명 ]
 *  
 *  @param localPath
 *  localPath: 로컬에 저장된 파일 경로.
 */
const GetBase64Encode = (localPath: string): string => {
    const fileName: string = GetFilePath(localPath);
    const newPath = `${StoragePath}/${fileName}`;
    var body = fs.readFileSync(newPath);
    return "data:image/png;base64," + body.toString('base64');
}

const QueryGetDocs = {
    GetDocs: async(_, args, { req }): Promise<GetDocsResponse>=> {
        console.log("DATA: ", req.docs);
        const data: Array<DocKey> | undefined = req.docs;
        /**
         *  로컬이미지 preview
         * 
         *  preview를 data-uri base64 encode로 변경해준다음
         *  클라이언트에 뿌려줘야 로컬이미지를 확인할 수 있다.
         */
        if(data) {
            const newData = data.map(doc => {
                return {
                    ...doc,
                    preview_path: GetBase64Encode(doc.preview_path)
                };
            })
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
                docs: newData
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
const isNullArgs = (args: object): boolean => {
    let isNull: boolean = false;
     Object.keys(args).forEach(key => {
        if(args[key] === "")
            isNull = true;
    });

    return isNull;
}
const writeArgs = (Printers: any, args: any, doc: Doc) => {
    const printer: Printer = Printers._construct(args);
    printer.print(doc);
    Printers._is_exist_args(args);
    Printers._add_args(args);
};

const MutationStartForGrouping = {
    StartForGrouping: privateResolvers( async (_, args: StartForGroupingMutationArgs, {req}): Promise<StartForGroupingMutationResponse> => {
        const { groupId, accepted } = args;
        
        const docs: Array<DocKey> = req.docs;
        const popDoc: PopDoc = req.pop_doc;
        try {
            const doc: DocKey | undefined = docs.find(doc => doc.accepted === accepted);
            if(doc) {
                let isOk: boolean = true;
                let taskCount: number = 0;
                let failedCnt: number = 0;

                const Printers = PrinterManager._PRINTERS;
                const Types = PrinterManager._TYPES;

                const removedDoc: Doc = popDoc(doc);
                const grouping: Grouping = req.grouping[groupId];
                const { groupName } = grouping;

                console.log("FIND_DOCS: ", doc);
    
                const { pdf, sendEmail, redirect, restful } = grouping;
                
                let message: string = "";
    
                if(pdf.isChecked) {
                    taskCount += 1;
                    if(isNullArgs(pdf)) {
                        message += "Failed(Data is Empty)"
                    } else {
                        const argsPdf = {
                            printer_type: "ToDisk",
                            printer_name: `${ groupName } - PDF`,
                            file_path: pdf.filePath,
                            file_name: pdf.fileName
                            /* 누락: file name. */
                        }
                        try {
                            writeArgs(Printers, argsPdf, removedDoc);
                            message += "Success";
                        } catch(error) {
                            isOk = false;
                            failedCnt += 1;
                            message += error.message + "\n";
                        }
                        // message += "PDF 작업수행 <br/>";
                    }
                    message = `Operation PDF [ ${message}. ]   ` + "\n";
                }
                if(sendEmail.isChecked) {
                    taskCount += 1;
                    if(isNullArgs(sendEmail)) {
                        message += "Failed(Data is Empty)";
                    } else {
                        const argsSendEmail = {
                            printer_type: "ToMail",
                            printer_name: `${ groupName } - Send Email`,
                            mail_server: "smtp.naver.com",
                            sender_id: sendEmail.email,
                            sender_pw: sendEmail.password,
                            receiver_id: sendEmail.destinationEmails,
                            file_name: GetFilePath(doc.preview_path), // filename ??
                            mail_name: sendEmail.mailTitle,
                            mail_body: sendEmail.mailContent
                        };
                        try {
                            writeArgs(Printers, argsSendEmail, removedDoc);
                            message += "Success";
                        } catch(error) {
                            isOk = false;
                            failedCnt += 1;
                            message += error.message + "\n";
                        }   
                    }
                    message = `Operation SendEmail [ ${message}. ]   ` + "\n";
                }

                if(restful.isChecked) {
                    taskCount += 1;
                    if(isNullArgs(restful)) {
                        message += "Failed(Data is Empty)";
                    } else {
                        const argsRestful = {
                            printer_type: "ToPost", 
                            printer_name: `${ groupName } - RESTFul`
                        }
                        try {
                            writeArgs(Printers, argsRestful, removedDoc);
                            message += "Success";
                        } catch(error) {
                            isOk = false;
                            failedCnt += 1;
                            message += error.message + "\n";
                        }
                    }
                    message = `Operation RESTful [ ${message}. ]   ` + "\n";
                }

                if(redirect.isChecked) {
                    taskCount += 1;
                    if(isNullArgs(redirect)) {
                        message += "Failed(Data is Empty)";
                    } else {
                        const argsRedirect = {
                            printer_type: "ToSocket",
                            printer_name: `${ groupName } - Redirect`,
                            host: redirect.ipAddress,
                            port: redirect.port
                        };
                        try {
                            writeArgs(Printers, argsRedirect, removedDoc);
                            message += "Success" + "\n";
                        } catch(error) {
                            isOk = false;
                            failedCnt += 1;
                            message += error.message + "\n";
                        }
                    }
                    message = `Operation Redirect [ ${message}. ]   ` + "\n";
                }

                // let all_args: Map<string, any> = Printers._get_all_args();
                
                // for(let args of all_args) {
                //     let args_hash = args[0];
                //     let args_obj = args[1];
                // }
                
                const error: string = `${taskCount - failedCnt} of ${taskCount} Success.`
                return {
                    ok: isOk,
                    error,
                    grouping,
                    message
                };
            } else {
                return {
                    ok: false,
                    error: "Not found document.",
                    grouping: null,
                    message: "Not found document."
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