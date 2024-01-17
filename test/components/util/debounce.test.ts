import DoneCallback = jest.DoneCallback;
import debounce from "../../../src/util/debounce";


describe("debounce", () => {
    test("debounces", (done: DoneCallback) => {
        let count = 0;

        const debounced = debounce(() => count = count + 1, 20)

        debounced()
        debounced()

        expect(count).toBe(1);
        done();
    })

    test("debounces immediately", (done: DoneCallback) => {
        let count = 0;

        const debounced = debounce(() => count = count + 1, 20, true)

        debounced()

        expect(count).toBe(1);
        done();
    })
})
