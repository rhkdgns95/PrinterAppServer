/**
 * 사용자에게 입력받아야 하는 매개변수.
 */
class ExtArg<T extends any> {
    private val: T;
    constructor(value: T) {
        this.val = value;
    }

    /**
     * 이 Arg의 타입 이름을 반환한다.
     */
    type_name(): string {
        let type_primitive: string = typeof this.val;
        let type_constructor: string = this.val.constructor.name;
        return type_primitive != "object" ? type_primitive : type_constructor;
    }

    /**
     *
     * @param val 대입할 값.
     */
    assign(val: T) {
        this.val = val;
    }

    /**
     *
     */
    value(): T {
        return this.val;
    }
}

export { ExtArg };
