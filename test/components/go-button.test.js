import React from 'react';
import renderer from 'react-test-renderer';
import GoButton, { Go } from '../../src/components/go-button';

test('Link changes the class when hovered', (done) => {
    let onGoCalled = false;
    const onGo = () => {
        onGoCalled = true;
    }

    let onStopCalled = false;
    const onStop = () => {
        onStopCalled = true;
    }

    const component = renderer.create(
        <GoButton going={false} onStop={onStop} onGo={onGo} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    let gos = component.find(Go);
    expect(gos.length).toBeGreaterThanOrEqual(1);

    let myeggo = gos[0];

    expect(myeggo.text()).toEqual("go!");

    act(() => {
        myeggo.click();
    });

    expect(onGoCalled).toBe(true);

    expect(myeggo.text()).toEqual("🌊");

    act(() => {
        myeggo.click();
    });

    expect(myeggo.text()).toEqual("go!");

    expect(onStopCalled).toBe(true);
});