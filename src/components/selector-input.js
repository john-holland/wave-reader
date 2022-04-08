var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react'; // we need this to make JSX compile
import styled from 'styled-components';
var SelectorTitle = styled.h3(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    display: inline;\n"], ["\n    display: inline;\n"])));
var SelectorTextInput = styled.input(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    display: ", "\n"], ["\n    display: ", "\n"])), (function (props) { return props.visible ? 'inline' : 'none'; }));
var SaveButton = styled.input(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: ", "\n"], ["\n  display: ", "\n"])), (function (props) { return props.visible ? 'inline' : 'none'; }));
var SelectorTextDisplay = styled.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: ", "\n"], ["\n  display: ", "\n"])), (function (props) { return props.visible ? 'inline' : 'none'; }));
var SelectorNote = styled.span(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  color: #333;\n  display: ", ";\n"], ["\n  color: #333;\n  display: ", ";\n"])), (function (props) { return props.visible ? 'inline' : 'none'; }));
var ClickableSelectorTextContainer = styled.span(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: inline;\n"], ["\n  display: inline;\n"])));
export var SelectorInput = function (_a) {
    var selector = _a.selector, saved = _a.saved, selectorClicked = _a.selectorClicked, onSave = _a.onSave;
    var _b = useState(selector), selectorText = _b[0], setSelectorText = _b[1];
    var selectorRef = useRef(null);
    useEffect(function () {
        var _a;
        if ((_a = selectorRef.current) === null || _a === void 0 ? void 0 : _a.value) {
            setSelectorText(selector);
        }
    }, [selector, selectorRef]);
    var _selectorClicked = function () {
        if (selectorClicked) {
            selectorClicked();
        }
    };
    var saveClicked = function () {
        var _a;
        if (onSave) {
            onSave(((_a = selectorRef.current) === null || _a === void 0 ? void 0 : _a.value) || selector);
        }
    };
    return (_jsxs("div", { children: [_jsx(SelectorTitle, { children: "Text Selector " }), _jsxs(ClickableSelectorTextContainer, __assign({ onClick: _selectorClicked }, { children: [_jsx(SelectorTextDisplay, __assign({ visible: saved }, { children: selectorText })), _jsx(SelectorNote, __assign({ visible: saved }, { children: "\u00A0(click to set selector)" }))] })), _jsx(SelectorTextInput, { visible: !saved, type: "text", defaultValue: selectorText, ref: selectorRef }), _jsx(SaveButton, { visible: !saved, type: "button", value: "Save", onClick: saveClicked })] }));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
