import "core-js/stable";
import "regenerator-runtime/runtime";

export class Deferred<T> {
    value?: T;
    ready: boolean = false;
    subscriptions: { (val?: T, fail?: any): void } [] = [];
    accessor: { (): Promise<T> };
    
    constructor(accessor: () => Promise<T>) {
        this.accessor = accessor;
        accessor().then((value: T) => {
            this.value = value;
            this.subscriptions.forEach((sub) => sub(value));
            this.ready = true;
        }).catch(reason => {
            this.subscriptions.forEach((sub) => sub(undefined, reason));
            this.ready = true;
        });
    }

    async waitFor(): Promise<T> {
        if (this.ready) {
            return Promise.resolve<T>(this.value!!);
        }

        return new Promise<T>((resolve, reject) => {
            this.subscriptions.push((val?: T, error?: any) => {
                if (val !== undefined && !error) {
                    resolve(val!!);
                } else {
                    reject(error);
                }
            });
        });
    }

    /**
     * Calls the original factory function
     */
    async update(): Promise<T> {
        if (this.ready) {
            this.ready = false;
            this.subscriptions = [];
            this.accessor().then((val: T) => {
                this.value = val;
                this.ready = true;
                this.subscriptions.forEach((sub) => sub(val));
            }).catch((reason) => {
                this.ready = true;
                this.subscriptions.forEach((sub) => sub(undefined, reason));
            });
        }

        return new Promise<T>((resolve, reject) => {
           this.subscriptions.push((val?: T, error?: any) => {
                if (val !== undefined && !error) {
                    resolve(val!!);
                } else {
                    reject(error);
                }
            });
        });
    }
}