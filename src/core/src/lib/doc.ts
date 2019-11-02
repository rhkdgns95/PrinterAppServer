import { DocKey } from "./doc-key";
import { DocVal } from "./doc-val";

/**
 * 프린트 요청된 문서 정보를 담고있는 객체.
 */
class Doc {
    public readonly key: DocKey; //! 문서를 식별할 수 있는 키
    public readonly val: DocVal; //! 문서의 내용

    /**
     *
     * @param when_accept 이 문서가 수신되기 시작한 시각.
     * @param postscript  해당 문서의 내용.
     */
    constructor(when_accept: number, postscript: string) {
        let title = "";
        let preview_url = "";
        this.key = new DocKey(when_accept, title, preview_url);
        this.val = new DocVal(postscript);
    }
}
export { Doc };
