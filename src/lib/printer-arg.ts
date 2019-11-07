/**
 * 사용자에게 입력받아야 하는 매개변수.
 */
export class PrinterArg {
    private val: string;
    constructor(value: string) {
        this.val = value;
    }

    assign(val: string) {
        this.val = val;
    }

    value(): string {
        return this.val;
    }
}