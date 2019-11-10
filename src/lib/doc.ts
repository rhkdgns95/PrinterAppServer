import { DocKey } from "./doc-key";
import { DocVal } from "./doc-val";
import { fstat, readFileSync } from "fs";

/**
 * 프린트 요청된 문서 정보를 담고있는 객체.
 */
export class Doc {
    public readonly key: DocKey; //! 문서를 식별할 수 있는 키
    public readonly val: DocVal; //! 문서의 내용

    /**
     *
     * @param when_accept 이 문서가 수신되기 시작한 시각.
     * @param postscript  해당 문서의 내용.
     */
    constructor(when_accept: number, postscript: string) {
        this.val = new DocVal(postscript);

        let match = /%%Title: [^\n]+/.exec(postscript);
        let title = when_accept + "untitled.pdf";
        if (match) {
            title = match[0].substr(8);
        }
        let preview_path = this.val.preview_path;
        this.key = new DocKey(when_accept, title, preview_path);
    }
    /**
     * 현재 문서의 제목을 반환한다.
     */
    public title(): string {
        return this.key.title;
    }

    /**
     * 현재 문서가 수신된 시각을 반환한다.
     */
    public timestamp(): number {
        return this.key.accepted;
    }

    /**
     * 현재 문서의 POSTSCRIPT 문자열을 반환한다.
     */
    public postscript(): string {
        return this.val.postscript;
    }

    /**
     * 현재 문서의 PDF 문자열을 반환한다.
     */
    public pdf(): string {
        return readFileSync(this.val.pdf_path).join("");
    }
}