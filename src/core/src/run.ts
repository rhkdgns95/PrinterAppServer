import { Printer } from "./lib/printer";
import { Doc } from "./lib/doc";
import { PrintingMachine } from "./printing-machine";
import { PrinterManager } from "./lib/printer-manager";

/**
 * (1) 프린터 매니저 구성요소.
 *
 * TYPE     : 프린터 종류를 다루는 매니저.
 * PRINTERS : 프린터 객체 생성에 관여하는 매니저.
 */
let TYPES = PrinterManager._TYPES;
let PRINTERS = PrinterManager._PRINTERS;

/**
 * (2) TYPE 매니저 사용.
 * 모든 프린터 타입을 불러오고,
 * 각 타입의 기본정보를 출력한다.
 */
console.log("\n----------------------------------\n* loaded extension list...");
let all_types: Map<string, Printer> = TYPES._get_types();
for (let type of all_types) {
    /**
     * 타입 기본정보.
     *
     * type_name          : 해당 익스텐션의 이름
     * type_constructor   : 해당 익스텐션의 생성자
     *
     */
    let type_name = type[0];
    let type_constructor = type[1];

    /**
     * 타입이 요구하는 파라미터 정보.
     * type_require_args  : 해당 익스텐션이 요구하는 인자목록 정보. Map<name:string, type:string>
     *
     * K  : 파라미터 이름.
     * V  : 파라미터 자료형.
     */
    let type_require_args = TYPES._require_args_of(type_constructor);
    console.log("   + " + type_name);
    for (let arg of type_require_args) {
        let arg_name = arg[0].padEnd(20);
        let arg_type = arg[1];
        console.log(`      - ${arg_name} : ${arg_type}`);
    }
    console.log("");
}

/**
 * (3-1) 올바른 args를 통해 프린터 객체 생성하기.
 * type과 name은 필수.
 */
let test_doc: Doc = new Doc(123456789, "Hello, World!");
let good_args = {
    type: "Test",
    name: "Test",
    a: "x",
    b: "y",
    c: "z"
};
let good_printer: Printer = PRINTERS._construct(good_args);
good_printer.print(test_doc);

/**
 * (3-2) 올바르지 않은 args를 통해 프린터 객체 생성하기.
 * c 파라미터 정보가 없으므로 Test 타입의 요구조건을 만족하지 않는다.
 *
 */
let bad_args = {
    type: "Test",
    name: "Test",
    a: "x",
    b: "y"
};
// let bad_printer: Printer = PRINTERS._construct(bad_args); //! ERROR : need c

/**
 * (4) args 객체를 파일에 쓰고/읽기.
 * args를 수정하려면 del한 뒤에, 수정하고 add할 것.
 *
 * 있는 args를 add하거나,
 * 없는 args를 del하면 익셉션 발생.
 * is_exist를 통해 먼저 체크한 뒤에 수행할 것.
 */
PRINTERS._is_exist_args(good_args);
PRINTERS._add_args(good_args);
PRINTERS._del_args(good_args);

/**
 * (5) 파일에 쓰여있는 모든 args 가져오기.
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
let service = new PrintingMachine(9100, 60);
// service.start();
export default service;