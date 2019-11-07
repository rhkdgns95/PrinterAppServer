import { Printer } from "./lib/printer";
import { Doc } from "./lib/doc";
import { PrintingMachine } from "./printing-machine";
import { PrinterManager } from "./lib/printer-manager";
import { readFileSync } from "fs";
import { randomBytes } from "crypto";

/**
 * (1) 프린터 매니저 구성요소.
 *
 * TYPE     : 외부 프린터 모듈을 다루는 매니저.
 * PRINTERS : 구체화된 프린터 객체를 생성하는 매니저.
 */
let TYPES = PrinterManager._TYPES;
let PRINTERS = PrinterManager._PRINTERS;

/**
 * (2) 외부 프린터 모듈 리스트
 */
console.log("\n load exteranl type list...");
let external_types: Map<string, Printer> = TYPES._get_types();
for (let external_type of external_types) {
    /**
     * 타입 기본정보.
     *
     * type_name          : 해당 익스텐션의 이름
     * type_constructor   : 해당 익스텐션의 생성자
     *
     */
    let type_name = external_type[0];
    let type_constructor = external_type[1];

    /**
     * 타입이 요구하는 파라미터 정보.
     * type_require_args  : 해당 익스텐션이 요구하는 인자목록 정보. Map<name:string, type:string>
     */
    let type_require_args = TYPES._require_args_of(type_constructor);
    console.log("   + " + type_name);
    for (let arg_name of type_require_args) {
        console.log(`      - ${arg_name}`);
    }
    console.log("");
}

/**
 * (3) 프린터 args를 통해 프린터 객체 생성하기.
 */
let test_doc: Doc = new Doc(
    Number(randomBytes(4).join("")),
    readFileSync(`${__dirname}/out/_asset/sample.ps`).toString()
);
let printer_args = {
    //! <공통>
    //! type : 외부 프린터 모듈 class의 이름
    //! name : 사용자가 지은 프린터 이름
    printer_type: "ToDisk",
    printer_name: "disk",

    //! <인자>
    //! 아래부터는 외부 프린터 모듈이 원하는 인자를 전부 적어야 함.
    file_path: "./",
    file_name: "example.pdf"
};
let printer: Printer = PRINTERS._construct(printer_args);
// printer.print(test_doc);

/**
 * (4) 프린터 args를 저장하고 불러오기.
 * args를 수정하려면 del한 뒤에, 수정하고 add할 것.
 *
 * 이미 존재하는 args를 add하거나,
 * 존재하지 않는 args를 del하면 익셉션 발생.
 * is_exist를 통해 먼저 체크한 뒤에 수행할 것.
 */
PRINTERS._is_exist_args(printer_args);
PRINTERS._add_args(printer_args);
//PRINTERS._del_args(printer_args);

/**
 * (5) 파일에 쓰여있는 모든 프린터 args 가져오기.
 *
 * Map<string, any>
 * string :  args 오브젝트를 해싱한 값.
 * any    :  args 오브젝트
 * 순차탐색이 필요한 경우 for of로 순회할 것.
 */
let all_args: Map<string, any> = PRINTERS._get_all_args();
for (let args of all_args) {
    let args_hash = args[0];
    let args_obj = args[1];
}

/**
 * (6) 서비스 시작하기.
 */
export default new PrintingMachine(9100, 600);