import * as TYPESCRIPT from "typescript";
import fs from "fs";
import { ExtArg } from "./ext-arg";
import { Printer } from "./printer";
import { FileStorage } from "./file-storage";

/**
 * 프린터 타입을 관리하는 매니저.
 */
class PrinterManager_Type {
    /**
     * 외부 type 소스가 저장되어 있는 폴더를 지정한다.
     */
    private static readonly path: string = "./external_type/";

    /**
     * 이 클래스는 static으로만 사용해야 한다.
     */
    private constructor() {}

    /**
     * 지금까지 정의된 프린터 타입을 가지고 있다.
     * K : 프린터 이름.
     * V : 프린터 객체.
     */
    private static type_list: Map<string, Printer> = new Map();

    /**
     * TYPE을 정의한 소스를 읽고, 만들어진 클래스 객체를 반환한다.
     *
     * @param type_code TYPE을 정의한 소스.
     */
    private static _import_one(type_code: string): any {
        let loaded: any;
        let ts_code: string = `
        import { PrinterType } from "./printer-type";
        import { ExtArg } from "./ext-arg";
        import { Doc } from "./doc";
        ${type_code.replace("class", "loaded = class")}
        `;
        let js_code: string = TYPESCRIPT.transpile(ts_code);
        eval(js_code);

        //! 확장기능이 요구사항을 만족했는지 검사한다.
        let print_method = loaded.prototype.print;
        if (!print_method) {
            throw TypeError("print(doc: Doc) 함수가 없습니다.");
        }
        let print_method_sign = print_method.toString();
        if (!print_method_sign.startsWith("function (doc)")) {
            throw TypeError("print(doc: Doc) 함수가 아닙니다.");
        }
        return loaded!!;
    }

    /**
     * ./ext 폴더에 있는 모든 익스텐션을 읽어 반환한다.
     * <클래스_이름, 클래스_본체>의 형태로 반환된다.
     */
    static _get_types(): Map<string, any> {
        if (!this.type_list.size) {
            let clone: Map<string, any> = new Map();
            const list: string[] = fs.readdirSync(this.path);

            for (let f of list) {
                let contents: string = fs
                    .readFileSync(this.path + f)
                    .toString();
                let imported: any = this._import_one(contents);
                clone.set(imported.name, imported);
            }
            this.type_list = clone;
        }
        return this.type_list;
    }

    /**
     * 주어진 타입, 또는 객체가 요구하는 파라미터 리스트를 가져온다.
     * 초기화된 ExtArg<> 멤버만 가져올 수 있으므로 주의하자.
     *
     * 이미 만들어진 객체를 넘겨줘서 알아낼 수 있고,
     * 생성자를 넘겨서도 알아낼 수 있다.
     * 단, 이 때 아무런 인자가 없는 생성자를 허용해야 한다.
     *
     * @param o 요구 파라미터 정보를 알아낼 생성자|만들어진 객체.
     */
    static _require_args_of(o: any): Map<string, string> {
        let it: any = typeof o == "function" ? new o() : o;
        let it_args: Map<string, string> = new Map();
        let it_desc = Object.getOwnPropertyDescriptors(it);
        let it_member_names = Object.getOwnPropertyNames(it);
        it_args.set("name", "".constructor.name);
        for (let member_name of it_member_names) {
            if (it_desc[member_name].value.constructor != ExtArg) continue;
            it_args.set(member_name, it_desc[member_name].value!!.type_name());
        }
        return it_args;
    }
}

/**
 * 프린터 매개변수 객체를 관리하는 매니저.
 * 실제 프린터 객체는 매개변수를 통해 생성할 수 있다.
 */
class PrinterManager_Printer {
    /**
     * args 데이터가 저장되는 스토리지.
     */
    private static storage = new FileStorage<any>("./printer.json");

    /**
     * static으로만 사용할 것.
     */
    private constructor() {}

    /**
     * 매개변수 객체를 받아 Printer 객체를 생성한다.
     * 없는 타입을 생성하려고 하거나,
     * 요구 파라미터를 하나라도 채우지 않으면 익셉션을 발생시킨다.
     *
     * @param args
     */
    static _construct(args: any): Printer {
        return new Printer(args);
    }

    /**
     * 정제된 매개변수 객체를 반환한다.
     * 타겟 타입과 비교하여 필요없는 인자는 필터링하고,
     * 부족한 인자가 존재한다면 익셉션을 발생시킨다.
     *
     * @param args 정제할 매개변수 객체.
     */
    private static _refine_args(args: any): any {
        //! 현재 정의된 모든 프린터의 타입을 가져온다.
        let type_list = PrinterManager_Type._get_types();

        /**
         * 해당 프린터 매개변수가 원하는 프린터 타입을 가져온다.
         * 정의되지 않은 프린터 타입인 경우 익셉션이 발생한다.
         */
        let type_name = args["type"];
        let type = type_list.get(type_name!!);
        let require_args = PrinterManager_Type._require_args_of(type);

        /**
         * 해당 타입이 원하는 파라미터가 전부 있는지 체크한다.
         * 인자가 부족하면 익셉션을 발생시키고,
         * 필요없는 인자는 필터링한다.
         */
        let refined_args: any = { type: type_name!! };
        for (let require_arg of require_args) {
            let arg_name = require_arg[0];
            let arg_value = args[arg_name]!!;
            refined_args[arg_name] = arg_value;
        }

        //! 정제된 매개변수 객체를 반환한다.
        return refined_args;
    }

    /**
     * 파일에 저장된 모든 매개변수 객체를 가져온다.
     * K는 hash값이며,
     * V는 매개변수 객체이다.
     */
    static _get_all_args(): Map<string, any> {
        return this.storage._read_all();
    }

    /**
     * 주어진 매개변수 객체를 파일에 저장한다.
     *
     * @param args 프린터 매개변수가 담긴 json 객체.
     */
    static _add_args(args: any) {
        let refined_args = this._refine_args(args);
        if (!this.storage._is_exist(refined_args)) {
            this.storage._write(refined_args);
            console.log("added!");
        } else {
            console.log("add fail : already exist.");
        }
    }

    /**
     * 주어진 매개변수 객체를 파일에서 제거한다.
     *
     * @param args 프린터 매개변수가 담긴 json 객체.
     */
    static _del_args(args: any) {
        let refined_args = this._refine_args(args);
        if (this.storage._is_exist(refined_args)) {
            this.storage._remove(refined_args);
            console.log("removed!");
        } else {
            console.log("remove fail : no exist.");
        }
    }

    /**
     * 주어진 매개변수 객체가 파일에 저장되어 있는지 확인한다.
     *
     * @param args 프린터 매개변수가 담긴 json 객체.
     */
    static _is_exist_args(args: any) {
        let refined_args = this._refine_args(args);
        return this.storage._is_exist(refined_args);
    }
}

/**
 *
 */
export class PrinterManager {
    private constructor() {}
    static _TYPES = PrinterManager_Type;
    static _PRINTERS = PrinterManager_Printer;
}
