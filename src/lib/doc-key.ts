/**
 * 문서를 식별할 수 있는 키.
 */
export class DocKey {
    public readonly accepted: number;
    public readonly title: string;
    public readonly preview_path: string;

    /**
     *
     * @param accepted      이 문서가 수신되기 시작한 시각.
     * @param title         해당 문서의 원시 이름.
     * @param preview_path  해당 문서의 프리뷰 이미지의 Path.
     */
    constructor(accepted: number, title: string, preview_path: string) {
        this.accepted = accepted;
        this.title = title;
        this.preview_path = preview_path;
    }
}