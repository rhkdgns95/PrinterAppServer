/**
 * 문서를 식별할 수 있는 키.
 */
class DocKey {
    public readonly accepted: number;
    public readonly title: string;
    public readonly preview_url: string;

    /**
     *
     * @param accepted      이 문서가 수신되기 시작한 시각.
     * @param title         해당 문서의 원시 이름.
     * @param preview_url   해당 문서의 프리뷰 이미지 URL.
     */
    constructor(accepted: number, title: string, preview_url: string) {
        this.accepted = accepted;
        this.title = title;
        this.preview_url = preview_url;
    }
}
export { DocKey };
