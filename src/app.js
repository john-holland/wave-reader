var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { SelectorInput } from "./components/selector-input";
import styled from "styled-components";
import { GoButton } from "./components/go-button";
import StartMessage from "./models/messages/start";
import Options from "./models/options";
import { getSyncObject } from './util/sync';
//todo:
// * Material UI
// * save selector and settings with chrome sync
// * Controls: read speed, reset speed, rotation angle, wave width, read duration
//
//todo-ne:
// * scss, styled components
// * typescript, functional component style
// https://medium.com/@seanlumjy/build-a-chrome-extension-that-injects-css-into-your-favourite-website-9b65f722f409
var WaveSymbol = styled.h2(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: inline;\n"], ["\n  display: inline;\n"])));
var startPageCss = function (wave) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, new StartMessage({
            wave: wave
        }));
        // chrome.storage.sync.set({ image: inputTxt.value }, () => {});
    });
    getSyncObject('options', Options.getDefaultOptions(), function (options) {
        if (options.showNotifications) {
            var notifOptions = {
                type: "basic",
                iconUrl: "images/background48.png",
                title: "🌊",
                message: "reading",
            };
            chrome.notifications.create("", notifOptions, function () {
                console.log("Last error:", chrome.runtime.lastError);
            });
        }
    });
};
var stopPageCss = function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { cmd: "clearBg" });
        chrome.storage.sync.set({ image: "" }, function () { });
    });
};
function convertIntoCss(url) {
    var css = "html body { \n        background: url(".concat(url, "); \n\n        image-rendering: crisp-edges; \n        \n        image-rendering: -webkit-optimize-contrast; \n\n        background-size:     cover; \n\n        background-repeat:   no-repeat; \n\n        background-position: center center; \n    \n      }\n");
    return css;
}
var App = function () {
    var _a = useState('p'), selector = _a[0], setSelector = _a[1];
    var _b = useState(true), saved = _b[0], setSaved = _b[1];
    var _c = useState(false), going = _c[0], setGoing = _c[1];
    var selectorClicked = function () {
        setSaved(false);
    };
    var onSaved = function (selector) {
        setSelector(selector);
        setSaved(true);
    };
    var onGo = function () {
        setGoing(true);
        // use workboots and send message with wave params to interpolate css
        startPageCss(selector);
    };
    var onStop = function () {
        setGoing(false);
        stopPageCss();
    };
    return (_jsxs("div", { children: [_jsx(WaveSymbol, { children: "\uD83C\uDF0A" }), _jsx(SelectorInput, { selector: selector, saved: saved, selectorClicked: selectorClicked, onSave: onSaved }), _jsx(GoButton, { onGo: onGo, onStop: onStop, going: going })] }));
};
export default App;
var templateObject_1;
