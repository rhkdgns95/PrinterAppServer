import low, { LowdbSync } from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import * as hash from "object-hash";

export class Storage<V> {
    private db: LowdbSync<any>; //! 실제 파일을 다루는 인터페이스.
    private data: any;
    private cache: Map<string, V>;

    /**
     *
     * @param file_path 데이터를 저장할 파일의 경로.
     */
    constructor(file_path: string) {
        this.db = low(new FileSync(file_path));
        this.db.defaults({ data: {} }).write();
        this.data = this.db.get("data");
        this.cache = this.__load_file();
    }

    /**
     * 주어진 오브젝트를 해싱한다.
     * 해싱을 수행하면 문자열로 변환된다.
     *
     * @param obj 해싱할 키 오브젝트.
     */
    private __hash(obj: V): string {
        return hash.sha1(obj);
    }

    /**
     * 파일에 저장된 데이터를 맵 형태로 반환한다.
     */
    private __load_file(): Map<string, V> {
        let loaded: Map<string, V> = new Map();
        let wrapped = this.data.__wrapped__.data;
        for (let val_hash in wrapped) {
            let val = wrapped[val_hash];
            loaded.set(val_hash, val);
        }
        return loaded;
    }

    /**
     * 해당 데이터가 캐시에 있는지 확인한다.
     *
     * @param val 존재여부를 확인할 데이터.
     */
    private __is_exist(val: V): boolean {
        let val_hash = this.__hash(val);
        return this.cache.get(val_hash) != undefined;
    }

    /**
     * 파일과 캐시에 적는다.
     *
     * @param val
     */
    private __write(val: V) {
        let val_hash = this.__hash(val);
        this.cache.set(val_hash, val);
        this.data.set(val_hash, val).write();
    }

    /**
     * 파일과 캐시를 비운다.
     */
    private __clear() {
        this.db.set("data", {}).write();
        this.cache.clear();
    }

    /**
     * 데이터를 파일과 캐시에서 지운다.
     *
     * @param val 지울 데이터.
     */
    private __remove(val: V) {
        let val_hash = this.__hash(val);
        this.cache.delete(val_hash);
        this.data.unset(val_hash).write();
    }

    /**
     * 저장된 모든 데이터를 가져온다.
     * 클론을 반환하므로 값은 변경될 수 없다.
     */
    _read_all(): Map<string, V> {
        let clone: Map<string, V> = new Map();
        for (let entry of this.cache.entries()) {
            let key = entry[0];
            let val = entry[1];
            clone.set(key, val);
        }
        return clone;
    }

    /**
     * 다수의 데이터 페어를 데이터베이스에 쓴다.
     *
     * @param val_array 데이터베이스에 쓸 데이터가 담긴 배열.
     */
    _write_all(val_array: V[]) {
        for (let val of val_array) {
            this._write(val);
        }
    }

    /**
     * 하나의 데이터 페어를 데이터베이스에 쓴다.
     * 동일한 데이터가 이미 존재하는 경우 익셉션을 발생시킨다.
     *
     * @param val 데이터베이스에 쓸 데이터.
     */
    _write(val: V) {
        if (this._is_exist(val)) throw `${val} is already exist.`;
        this.__write(val);
    }

    /**
     * 데이터베이스를 비운다.
     */
    _remove_all() {
        this.__clear();
    }

    /**
     * 해당 키에 해당하는 데이터를 지운다.
     * 해당 데이터가 없는 경우 익셉션을 발생시킨다.
     *
     * @param val 지울 데이터.
     */
    _remove(val: V) {
        if (!this._is_exist(val)) throw `${val} is no exist.`;
        this.__remove(val);
    }

    /**
     *
     * @param val 존재여부를 확인할 데이터.
     */
    _is_exist(val: V): boolean {
        return this.__is_exist(val);
    }
}