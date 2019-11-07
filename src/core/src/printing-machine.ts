import { Doc } from "./lib/doc";
import * as Net from "net";
import { DocKey } from "./lib/doc-key";

class PrintingMachine {
    private readonly limit_alive_ms: number; //! Doc 객체 유지시간 (단위 ms)
    private readonly port: number; //! 서비스를 제공할 포트번호
    private waiting_doc: Map<number, Doc> = new Map(); //! 현재 대기중인 Doc 객체 대기열.

    public constructor(port: number = 9100, limit_alive_sec: number = 60) {
        this.port = port;
        this.limit_alive_ms = limit_alive_sec * 1000;
    }

    /**
     * 기기를 시작한다.
     */
    public start() {
        let accept_map: Map<Net.Socket, number> = new Map();
        let buffer_map: Map<Net.Socket, Buffer[]> = new Map();
        let socket_server = Net.createServer(client => {
            client
                //! 데이터 수신 중...
                .on("data", data => {
                    if (accept_map.get(client) == undefined) {
                        let now = new Date().getTime();
                        accept_map.set(client, now);
                        buffer_map.set(client, []);
                        console.log(`[${now}] start receiving.`);
                    }
                    buffer_map.get(client)!!.push(data);
                })
                //! 데이터 수신 완료...
                .on("end", () => {
                    if (buffer_map.get(client)!!.length != 0) {
                        console.log(
                            `[${accept_map.get(client)}] receiving completed.`
                        );
                        let postscript = buffer_map.get(client)!!.join("");
                        let when_accepted = accept_map.get(client);
                        this.waiting_doc.set(
                            when_accepted!!,
                            new Doc(when_accepted!!, postscript)
                        );
                    } else {
                        console.log(
                            `[${accept_map.get(client)}] ignore. it's empty.`
                        );
                    }
                });
        });
        socket_server.listen(this.port);
        setTimeout(() => {
            console.log("\n\n----------------------------------");
            console.log(`start machine on ${this.port}`);
        }, 1000);
    }

    /**
     * 일정시간이 지난 Doc 객체를 삭제한다.
     */
    public remove_too_old() {
        let now: number = new Date().getTime();
        let limit = this.limit_alive_ms;
        for (let iter of this.waiting_doc) {
            if (limit <= now - iter[0]) {
                this.waiting_doc.delete(iter[0]);
            }
        }
    }

    /**
     * 현재 대기중인 모든 Doc 객체의 Key를 반환한다.
     */
    public get_dockeys(): DocKey[] {
        this.remove_too_old();

        let dockeys: DocKey[] = [];
        for (let entry of this.waiting_doc) {
            dockeys.push(entry[1].key);
        }
        return dockeys;
    }

    /**
     * 주어진 DocKey에 해당에는 Doc을 꺼내온다.
     * 꺼내진 Doc은 대기열에서 삭제되므로 주의한다.
     *
     * @param key 가져올 Doc의 Key
     */
    public pop_doc = (key: DocKey): Doc => {
        console.log("POP_DOC");
        console.log("key: ", key);
        try {
            this.remove_too_old();    
            console.log("Noo...");
        } catch(error) {
            console.log("ERROR: ", error.message);
        }
        
        let when_accepted: number = key.accepted;
        let doc: Doc | undefined = this.waiting_doc.get(when_accepted);
        //! 대응되는 문서가 대기열에 실제로 있는지 확인한다.
        if (doc == undefined) {
            throw `${key}에 해당되는 문서가 대기열에 없습니다.`;
        } else {
            //! 대기열에서 해당 문서를 삭제한다.
            this.waiting_doc.delete(when_accepted);
            return doc;
        }
    }
}
export { PrintingMachine };