import sqlite3 from 'sqlite3';

export default class Sql {
    isOpen = false;
    open(write, create) {
        return new Promise((resolve, reject) => {
            let mode = sqlite3.OPEN_READONLY;
            if (write) {
                mode = sqlite3.OPEN_READWRITE;
            }
            if (create) {
                mode |= sqlite3.OPEN_CREATE;
            }
            console.log(`DB_PATH: ${process.env.DB_PATH}`);
            console.log(mode);
            this.db = new sqlite3.Database(process.env.DB_PATH, mode, (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                console.log('resolving promise...');
                this.isOpen = true;
                resolve();
            })
        });
    }

    run(sql, params) {
        return new Promise((resolve, reject) => {
            if (this.db === null) {
                reject(new Error(`DB is null`));
                return;
            }
            this.db.run(sql, params || {}, err => {
                err ? reject(err) : resolve();
            });
        })
    }

    close() {
        return new Promise((resolve, reject) => {
            if (this.db === null || !this.isOpen) {
                resolve();
                return;
            }
            this.db.close((err) => {
                this.isOpen = false;
                return err ? reject(err) : resolve();
            });
        });
    }
}