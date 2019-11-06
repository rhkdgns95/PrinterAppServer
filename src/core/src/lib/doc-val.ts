import { randomBytes } from "crypto";
import { writeFileSync, writeFile } from "fs";
import { ChildProcess, execSync } from "child_process";

/**
 *  ConvertWindowPath = () => {}
 *  
 *  @param path 
 *  window의 path로 변경시켜주기위한
 *  path를 입력받음. 
 *  만약 window형식이라면 => 그대로 path값을 리턴한다.
 *  그렇지 않은경우라면 => window형식으로 변환한다음 리턴한다.
 */
const ConvertWindowPath = (path: string): string => {
    if(path.indexOf("/") != -1) {
        // PATH가 window 형식가 아닌경우,
        var windowPath: string = path.replace(/\//gi, "\\");
        if(path.indexOf("mnt") != -1) {
            windowPath = windowPath.replace("\\mnt\\c", "C:");
        }

        // console.log("FULLPATH: ", windowPath);
        return windowPath;
    } else {
        // PATH가 window 형식인 경우,
        return path;
    }
}

/**
 * 문서의 내용
 */
class DocVal {
    private readonly base_folder = `${__dirname}/temp/`;

    public readonly id: string;
    public readonly postscript: string;
    public readonly pdf_path: string;
    public readonly preview_path: string;
    
    /**
     *
     * @param postscript 이 문서의 내용.
     */
    constructor(postscript: string) {
        this.id = randomBytes(15).join("");
        // this.id = "5822019125118412871623312569223211130126";
        this.postscript = postscript;
        this.pdf_path = this.get_pdf();
        
        this.preview_path = this.get_preview();
        
    }
    /**
     * pdf 파일을 생성한다.
     */
    private get_pdf(): string {
        let input_path: string = `${this.base_folder}${this.id}`;
        let output_path: string = `${this.base_folder}${this.id}.pdf`;
        try {
            let command = `${this.base_folder}../../bin/gswin32c.exe -dBATCH -dNOPAUSE -sDEVICE=pdfwrite -o "${ConvertWindowPath(output_path)}" -f "${ConvertWindowPath(input_path)}"`;
            writeFileSync(input_path, this.postscript);
            execSync(command);
        } catch(error) {
            console.log("ERROR: ", error.message);
        }
        return output_path;
    }

    /**
     * 프리뷰 이미지를 생성한다.
     */
    private get_preview(): string {
        let output_path: string = `${this.base_folder}${this.id}.jpg`;
        let command = `${this.base_folder}../../bin/gswin32c.exe -dNOPAUSE -sDEVICE=jpeg -r144 -dFirstPage=1 -dLastPage=1 -o "${ConvertWindowPath(output_path)}" -f "${ConvertWindowPath(this.pdf_path)}"`;

        try {
            execSync(command);
        } catch(error) {
            console.log("ERROR: ", error.message);
        }
        return output_path;
    }
    /**
     * 이 문서와 관련된 파일을 전부 삭제한다.
     */
    public clear() {}
}
export { DocVal };