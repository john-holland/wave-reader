/**
 * @jest-environment jsdom
 */

import 'jest';
import React from 'react';
import GoButton from '../../src/components/go-button';
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import {act} from "react-test-renderer";

test('Link changes the class when hovered', async () => {
    let onGoCalled = false;
    const onGo = () => {
        onGoCalled = true;
    }

    let onStopCalled = false;
    const onStop = () => {
        onStopCalled = true;
    }

    render(
        <GoButton going={false} onStop={onStop} onGo={onGo} />
    );

    const goButtonUnClicked = screen.getByText('go!')
    expect(goButtonUnClicked).toBeTruthy();

    await act(async () => {
        await user.click(goButtonUnClicked);
    });

    expect(onGoCalled).toBeTruthy();

    await act(async () => {
        await user.click(goButtonUnClicked);
    });

    expect(onStopCalled).toBe(true);
    // can't get the testing-library to revalidate the value of the button, but neither could i get the json component
    //  to render with the updated information, so idk.

    // in the meantime...
    // todo: Matrial-UI seems like it suddenly wanted to start fighting with snapshot due to polluting classnames non-deterministically
    expect(goButtonUnClicked).toMatchSnapshot();
});