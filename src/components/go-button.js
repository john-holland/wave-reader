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
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import styled from "styled-components";
export var Go = styled.input(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    height: 8rem;\n    width: 8rem;\n"], ["\n    height: 8rem;\n    width: 8rem;\n"])));
var GoButton = function (_a) {
    var going = _a.going, onGo = _a.onGo, onStop = _a.onStop;
    var _b = useState('go!'), goDisplayText = _b[0], setGoDisplayText = _b[1];
    useEffect(function () {
        if (going) {
            setGoDisplayText("🌊");
        }
        else {
            setGoDisplayText("go!");
        }
    }, [going]);
    var goClicked = function () {
        if (going) {
            // we want to stop if we're going
            onStop();
        }
        else {
            onGo();
        }
        going = !going;
    };
    return (_jsx(Go, __assign({ type: "button", onClick: goClicked }, { children: goDisplayText })));
};
export default GoButton;
var templateObject_1;
