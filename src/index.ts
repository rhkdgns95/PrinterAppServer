import { Options } from "graphql-yoga";
import app from "./App";
import service from "./core/src/run";

const PLAY_GROUND: string = "/appPlayground";
const GRAPHQL_ENDPOINT: string = "/appGraphql";
const PORT: number = 4000;

const appOptions: Options = {   
    playground: PLAY_GROUND,
    endpoint: GRAPHQL_ENDPOINT,
    port: PORT
};

const conn = () => {
    console.log(`GraphQLServer is Running on ${PORT}`);
    // service.start();
}

app.start(appOptions, conn);


// Graphql Headers
// "X-GROUPING": "[{\"__typename\":\"GroupItem\",\"groupName\":\"writeData\",\"pdf\":{\"__typename\":\"ItemPDF\",\"isChecked\":true,\"fileName\":\"dfasdafd\",\"filePath\":\"asdfr\"},\"sendEmail\":{\"__typename\":\"ItemSendEmail\",\"isChecked\":false,\"email\":\"test\",\"password\":\"test\",\"mailTitle\":\"test\",\"mailContent\":\"test\"},\"redirect\":{\"__typename\":\"ItemRedirect\",\"isChecked\":false,\"ipAddress\":\"\",\"port\":\"\"},\"restful\":{\"__typename\":\"ItemRestful\",\"isChecked\":true,\"isLogging\":false,\"isSendFile\":false,\"data\":\"\"}},{\"__typename\":\"GroupItem\",\"groupName\":\"Todo Print\",\"pdf\":{\"__typename\":\"ItemPDF\",\"isChecked\":true,\"fileName\":\"TmpFile\",\"filePath\":\"C://Programs/print\"},\"sendEmail\":{\"__typename\":\"ItemSendEmail\",\"isChecked\":true,\"email\":\"Test@naver.com\",\"password\":\"qwe123123\",\"mailTitle\":\"Tmp File\",\"mailContent\":\"Hi, This is Tmp File\"},\"redirect\":{\"__typename\":\"ItemRedirect\",\"isChecked\":true,\"ipAddress\":\"127.0.0.1\",\"port\":\"9100\"},\"restful\":{\"__typename\":\"ItemRestful\",\"isChecked\":false,\"isLogging\":false,\"isSendFile\":true,\"data\":\"function() { const a = 3; return a;}\"}}]"