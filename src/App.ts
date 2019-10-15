import { GraphQLServer } from "graphql-yoga";
import typeDefs from "./api/schema";
import resolvers from "./api/resolvers";
import { Request, Response, NextFunction } from "express";


class App {
    public app: GraphQLServer;
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
        this.middlewares();
    }
    private middlewares = () => {
        this.app.express.use(this.upload);
    }
    // upload
    // 실제 업로드하는게아니라, 해당 graphql server 객체에 받은 파일을 저장하기 위한 용도이다.
    private upload = (req, res: Response, next: NextFunction) => {
        const GroupingText = req.get("X-GROUPING");
        if(GroupingText) {
            const GroupingArray = JSON.parse(GroupingText);
            req.grouping = GroupingArray;
        }
        
        next();
    }

}

export default new App().app;