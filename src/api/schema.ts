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
const typeDefs = `
    ${Grouping}
    type StartForGroupingResponse {
        ok: Boolean!
        error: String
        grouping: Grouping
    }
    type Query {
        GetTest: String
    }
    type Mutation {
        StartForGrouping(
            groupId: Int!
        ): StartForGroupingResponse!
    }
`;

export default typeDefs;