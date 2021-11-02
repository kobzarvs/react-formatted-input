import React, { useState, useRef, useCallback, useEffect, } from 'react';
const MASK_CHARS = ['^', '_', '#', undefined];
export const defaultParser = (value) => {
    if (value === null || value === undefined) {
        return '';
    }
    return value.replace(/[^A-ZА-Я0-9]/gi, '');
};
export const defaultFormatter = (value, mask) => {
    let result = [];
    for (let i = 0, m = 0; m < mask.length; ++m) {
        if (MASK_CHARS.includes(mask[m])) {
            if (i >= value.length)
                break;
            result.push(value[i++]);
        }
        else {
            result.push(mask[m]);
        }
    }
    return result.join('');
};
const getStartPosition = (mask) => {
    let startPos = 0;
    while (!MASK_CHARS.includes(mask[startPos]) && startPos < mask.length) {
        startPos++;
    }
    return startPos;
};
const getValuePosition = (value, mask, maskPos) => {
    let pos = 0;
    for (let i = 0; i < maskPos; ++i) {
        if (MASK_CHARS.includes(mask[i])) {
            pos++;
        }
    }
    return pos;
};
const setCaret = (target, pos, callback) => {
    requestAnimationFrame(() => {
        if (callback) {
            pos = callback();
        }
        target.setSelectionRange(pos, pos);
    });
};
const getMaskPosition = (value, mask, valuePos) => {
    let pos = 0;
    for (let i = 0; pos < mask.length && i < valuePos; ++pos) {
        if (MASK_CHARS.includes(mask[pos])) {
            i++;
        }
        console.log(i, valuePos, pos, MASK_CHARS.includes(mask[pos]), value[i]);
    }
    return pos;
};
export const Index = ({ label, value, parser, mask, placeholder, errorMessage, formatter, onChange, }) => {
    parser = parser || defaultParser;
    formatter = formatter || defaultFormatter;
    const ref = useRef(null);
    const formattedValue = formatter(value, mask);
    const id = useRef(Math.random().toString(36));
    const [error, setError] = useState(false);
    const errorBorder = error ? { border: '2px solid red' } : {};
    const getPattern = useCallback((value) => {
        if (value.length === 0) {
            return '';
        }
        const maskChars = mask.split('').slice(0, value.length);
        maskChars.unshift('');
        const reStr = maskChars
            .join('\\')
            .replace(/\\#/g, '\\d')
            .replace(/\\\^/g, '[A-ZА-Я]')
            .replace(/\\_/g, '[a-zа-я]');
        return `^${reStr}$`;
    }, [mask]);
    const validate = useCallback((value, showError) => {
        if (value.length === 0) {
            showError && setError(false);
            return true;
        }
        const re = new RegExp(getPattern(value));
        if (re.test(value)) {
            showError && setError(false);
            console.log(value, true);
            return true;
        }
        else {
            showError && setError(true);
            console.log(value, false);
            return false;
        }
    }, [mask]);
    const handleInput = useCallback((e) => {
        // @ts-ignore
        const target = e.target;
        const value = target.value.substr(0, mask.length);
        let savePos = target.selectionStart || getStartPosition(mask);
        const parsedValue = parser ? parser(value) : value;
        onChange(parsedValue);
        if (savePos < value.length) {
            setCaret(target, savePos);
        }
    }, [parser, onChange, mask]);
    const handleKeyDown = useCallback((e) => {
        var _a;
        let caret = ((_a = ref.current) === null || _a === void 0 ? void 0 : _a.selectionStart) || getStartPosition(mask);
        const target = e.target;
        switch (e.key) {
            case 'ArrowUp':
            case 'Home':
            case 'Escape':
                if (e.key === 'Escape') {
                    onChange('');
                }
                const pos = getStartPosition(mask);
                setCaret(target, pos);
                e.preventDefault();
                e.stopPropagation();
                break;
            case 'Backspace': {
                const valuePos = getValuePosition(value, mask, caret);
                const newValue = `${value.substring(0, valuePos - 1)}${value.substring(valuePos, value.length)}`;
                let maskPos = getMaskPosition(newValue, mask, valuePos);
                maskPos = Math.max(maskPos - 1, getStartPosition(mask));
                onChange(newValue);
                setCaret(target, maskPos);
                e.preventDefault();
                e.stopPropagation();
                break;
            }
            case 'Delete': {
                const valuePos = getValuePosition(value, mask, caret);
                const newValue = `${value.substring(0, valuePos)}${value.substring(valuePos + 1, value.length)}`;
                onChange(newValue);
                setCaret(target, caret);
                e.preventDefault();
                e.stopPropagation();
                break;
            }
        }
    }, [mask, value, onChange]);
    const handleMouseDown = useCallback((e) => {
        // @ts-ignore
        const target = e.target;
        setCaret(target, 0, () => {
            const start = getStartPosition(mask);
            if ((target.selectionStart || 0) < start) {
                return start;
            }
            return target.selectionStart || 0;
        });
    }, [mask]);
    useEffect(() => {
        validate(formattedValue, true);
    }, [formattedValue, validate]);
    return (React.createElement("div", { style: { height: '2.5rem' } },
        React.createElement("label", { htmlFor: id.current, style: { display: 'flex' } },
            React.createElement("span", { style: { margin: '5px' } },
                label,
                " "),
            React.createElement("div", { style: { display: 'relative' } },
                React.createElement("input", { style: {
                        position: 'absolute',
                        color: '#a9a9a9',
                        pointerEvents: 'none',
                        border: '2px solid transparent',
                        outline: 'none',
                    }, tabIndex: -1, value: formattedValue.concat(placeholder.slice(formattedValue.length)), onChange: () => {
                    } }),
                React.createElement("input", { id: id.current, style: Object.assign({ position: 'absolute', caretColor: 'black', background: 'transparent' }, errorBorder), ref: ref, value: formattedValue, onInput: handleInput, onKeyDown: handleKeyDown, onMouseDown: handleMouseDown }),
                React.createElement("div", { style: {
                        color: 'red',
                        position: 'relative',
                        top: '1.4rem',
                        fontSize: 12,
                    } }, error && errorMessage)))));
};
//# sourceMappingURL=index.js.map