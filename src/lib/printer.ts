import { Doc } from "./doc";
import { PrinterManager } from "./printer-manager";
import { PrinterArg } from "./printer-arg";
import { randomBytes } from "crypto";
import { readFileSync } from "fs";

/**
 * 실제 프린터 객체.
 */
export class Printer {
    /**
     * 주어진 args를 이용하여 Printer 객체를 동적으로 재구성한다.
     * 중간에 문제가 발생하면 익셉션이 발생한다.
     *
     * @param args 프린터 매개변수 객체
     */
    constructor(args: any) {
        /**
         * 매개변수 객체에 정의된 타입 정보를 가져온다.
         * 정의되지 않은 프린터 타입인 경우 익셉션을 발생시킨다.
         */
        let type_list = PrinterManager._TYPES._get_types();
        let type_name = args["printer_type"];
        let type: any = type_list.get(type_name);
        if (!type) throw `존재하지 않는 프린터 타입 -> "${type_name}"`;
        let require_args = PrinterManager._TYPES._require_args_of(type);

        /**
         * 그 타입이 원하는 파라미터가 args에 전부 있는지 체크한다.
         * 인자가 부족하면 익셉션을 발생시키고,
         * 필요없는 인자는 필터링한다.
         */
        let self: any = this;
        for (let arg_name of require_args) {
            //! 해당 파라미터 값을 얻어낸 뒤,
            let require_arg_value = args[arg_name];
            if (!require_arg_value) throw `need ${arg_name}`;

            //! 동적으로 멤버를 만들어내어 할당한다.
            self[arg_name] = new PrinterArg(require_arg_value);
        }

        /**
         * print 메소드를 옮겨쓴다.
         */
        if (type!!.prototype!!.print) {
            this.print = type!!.prototype!!.print;
        }
    }

    /**
     * Doc 객체를 인자로 받아 원하는 형태로 출력한다.
     *
     * @param doc 출력할 문서.
     */
    async print(doc: Doc): Promise<void> {
        throw `please implement print method.`;
    }
}