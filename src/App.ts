import { GraphQLServer } from "graphql-yoga";
import typeDefs from "./api/schema";
import resolvers from "./api/resolvers";
import { Response, NextFunction } from "express";
import cors from "cors";
// import logger from "morgan";
import decodeGrouping from "./utils/decodeGrouping";
import helmet from "helmet";
import { PrintingMachine } from "./printing-machine";
import service from "./run";

class App {
    public app: GraphQLServer;
    public service: PrintingMachine;
    constructor() {
        this.app = new GraphQLServer({
            typeDefs,
            resolvers,
            context: req => {
                return {
                    req: req.request
                }
            }
        });
        this.service = service;
        this.service.start();
       
        this.middlewares();
    }
    private middlewares = () => {
        this.app.express.use(cors());
        this.app.express.use(helmet());
        this.app.express.use(this.upload);
        this.app.express.use(this.subscription);
    }
    // upload
    // 실제 업로드하는게아니라, 해당 graphql server 객체에 받은 파일을 저장하기 위한 용도이다.
    private upload = async (req, res: Response, next: NextFunction) => {
        const GroupingText = req.get("X-GROUPING");
        if(GroupingText) {
            const GroupingArray = decodeGrouping(GroupingText);
            if(GroupingArray) {
                // console.log("있다: ", GroupingArray);
                req.grouping = GroupingArray;
            } else {
                // console.log("없다.");
            }
        }
        next();
    }
    /**
     *  subscription
     * 
     *  요청받은 프린트 추가
     */
    private subscription = async(req, res: Response, next: NextFunction) => {
        try {
            const data = this.service.get_dockeys();
            if(data) { // 데이터가 존재할경우
                req.docs = data;
                req.pop_doc = this.service.pop_doc;
                // console.log("Subscription 있다. ", data);
            } else {
                req.docs = null;
                // console.log("Subscription 없다. ");
            }
        } catch(error) {
            console.log("Error: ", error);
        }
        next();
    }
}

export default new App().app;