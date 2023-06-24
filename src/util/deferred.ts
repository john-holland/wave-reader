import "core-js/stable";
import "regenerator-runtime/runtime";

// this works, but i think i should look into using observables / rxjs (rxts?)
// also doe not have unsub
export class Deferred<T> {
    value?: T;
    ready: boolean = false;
    subscriptions: { (val?: T, fail?: any): void } [] = [];
    waitForSubscriptions: { (val?: T, fail?: any): void } [] = [];
    accessor: { (): Promise<T> };
    
    constructor(accessor: () => Promise<T>) {
        this.accessor = accessor;
        accessor().then((value: T) => {
            this.value = value;
            this.subscriptions.forEach((sub) => sub(value));
            this.waitForSubscriptions.forEach((sub) => sub(value))
            this.waitForSubscriptions = [];
            this.ready = true;
        }).catch(reason => {
            this.subscriptions.forEach((sub) => sub(undefined, reason));
            this.waitForSubscriptions.forEach((sub) => sub(undefined, reason));
            this.waitForSubscriptions = [];
            this.ready = true;
        });
    }

    subscribe(callback: (val?: T, fail?: any) => void): void {
        // return new Guid();
        this.subscriptions.push(callback);
    }

    async waitFor(): Promise<T> {
        if (this.ready) {
            return Promise.resolve<T>(this.value!!);
        }

        return new Promise<T>((resolve, reject) => {
            this.waitForSubscriptions.push((val?: T, error?: any) => {
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
                this.waitForSubscriptions.forEach((sub) => sub(val))
                this.waitForSubscriptions = [];
            }).catch((reason) => {
                this.ready = true;
                this.subscriptions.forEach((sub) => sub(undefined, reason));
                this.waitForSubscriptions.forEach((sub) => sub(undefined, reason));
                this.waitForSubscriptions = [];
            });
        }

        return new Promise<T>((resolve, reject) => {
            const callback = (val?: T, error?: any) => {
                if (val !== undefined && !error) {
                    resolve(val!!);
                } else {
                    reject(error);
                }
            };

            this.subscriptions.push(callback);
            this.waitForSubscriptions.push(callback);
        });
    }
}