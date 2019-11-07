const Grouping = `
    type Pdf {
        isChecked: Boolean!
        filePath: String!
        fileName: String!
    }
    type SendEmail {
        isChecked: Boolean!
        email: String!
        password: String!
        mailTitle: String!
        destinationEmails: String!
        mailContent: String!
    }
    type RestFul {
        isChecked: Boolean!
        isLogging: Boolean!
        isSendFile: Boolean!
        data: String!
    }
    type Redirect {
        isChecked: Boolean!
        ipAddress: String!
        port: String!
    }
    type Grouping {
        groupName: String!    
        pdf: Pdf!
        sendEmail: SendEmail!
        restful: RestFul!
        redirect: Redirect!
    }
`;
const typeGetDocs = `
    type Docs {
        accepted: Float!
        title: String!
        preview_path: String!
    }
    
    type GetDocsResponse {
        ok: Boolean!
        error: String
        docs: [Docs]
    }
`;
const typeDefs = `
    ${Grouping}
    ${typeGetDocs}
    type StartForGroupingResponse {
        ok: Boolean!
        error: String
        grouping: Grouping
        message: String
    }
    type Query {
        GetTest: String
        GetDocs: GetDocsResponse!
    }
    type Mutation {
        StartForGrouping(
            groupId: Int!
            accepted: Float!    
        ): StartForGroupingResponse!
    }
`;

export default typeDefs;