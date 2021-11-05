import {jsx as $bygO3$jsx, jsxs as $bygO3$jsxs} from "react/jsx-runtime";
import {useRef as $bygO3$useRef, useState as $bygO3$useState, useCallback as $bygO3$useCallback, useEffect as $bygO3$useEffect} from "react";



const $261f5a2c35712d01$var$MASK_CHARS = [
    '^',
    '_',
    '#',
    undefined
];
const $261f5a2c35712d01$export$1d675918e0abc419 = (value)=>{
    if (value === null || value === undefined) return '';
    return value.replace(/[^A-ZА-Я0-9]/gi, '');
};
const $261f5a2c35712d01$export$74332e2e6daaf651 = (value, mask)=>{
    let result = [];
    for(let i = 0, m = 0; m < mask.length; ++m)if ($261f5a2c35712d01$var$MASK_CHARS.includes(mask[m])) {
        if (i >= value.length) break;
        result.push(value[i++]);
    } else result.push(mask[m]);
    return result.join('');
};
const $261f5a2c35712d01$var$getStartPosition = (mask)=>{
    let startPos = 0;
    while(!$261f5a2c35712d01$var$MASK_CHARS.includes(mask[startPos]) && startPos < mask.length)startPos++;
    return startPos;
};
const $261f5a2c35712d01$var$getValuePosition = (value, mask, maskPos)=>{
    let pos = 0;
    for(let i = 0; i < maskPos; ++i)if ($261f5a2c35712d01$var$MASK_CHARS.includes(mask[i])) pos++;
    return pos;
};
const $261f5a2c35712d01$var$setCaret = (target, pos, callback)=>{
    requestAnimationFrame(()=>{
        if (callback) pos = callback();
        target.setSelectionRange(pos, pos);
    });
};
const $261f5a2c35712d01$var$getMaskPosition = (value, mask, valuePos)=>{
    let pos = 0;
    for(let i = 0; pos < mask.length && i < valuePos; ++pos){
        if ($261f5a2c35712d01$var$MASK_CHARS.includes(mask[pos])) i++;
        console.log(i, valuePos, pos, $261f5a2c35712d01$var$MASK_CHARS.includes(mask[pos]), value[i]);
    }
    return pos;
};
const $261f5a2c35712d01$export$62f94f5123750502 = ({ label: label , value: value , parser: parser , mask: mask , placeholder: placeholder , errorMessage: errorMessage , formatter: formatter , onChange: onChange  })=>{
    parser = parser || $261f5a2c35712d01$export$1d675918e0abc419;
    formatter = formatter || $261f5a2c35712d01$export$74332e2e6daaf651;
    const ref = $bygO3$useRef(null);
    const formattedValue = formatter(value, mask);
    const id = $bygO3$useRef(Math.random().toString(36));
    const [error, setError] = $bygO3$useState(false);
    const errorBorder = error ? {
        border: '2px solid red'
    } : {
    };
    const getPattern = $bygO3$useCallback((value)=>{
        if (value.length === 0) return '';
        const maskChars = mask.split('').slice(0, value.length);
        maskChars.unshift('');
        const reStr = maskChars.join('\\').replace(/\\#/g, '\\d').replace(/\\\^/g, '[A-ZА-Я]').replace(/\\_/g, '[a-zа-я]');
        return `^${reStr}$`;
    }, [
        mask
    ]);
    const validate = $bygO3$useCallback((value, showError)=>{
        if (value.length === 0) {
            showError && setError(false);
            return true;
        }
        const re = new RegExp(getPattern(value));
        if (re.test(value)) {
            showError && setError(false);
            console.log(value, true);
            return true;
        } else {
            showError && setError(true);
            console.log(value, false);
            return false;
        }
    }, [
        mask
    ]);
    const handleInput = $bygO3$useCallback((e)=>{
        // @ts-ignore
        const target = e.target;
        const value = target.value.substr(0, mask.length);
        let savePos = target.selectionStart || $261f5a2c35712d01$var$getStartPosition(mask);
        const parsedValue = parser ? parser(value) : value;
        onChange(parsedValue);
        if (savePos < value.length) $261f5a2c35712d01$var$setCaret(target, savePos);
    }, [
        parser,
        onChange,
        mask
    ]);
    const handleKeyDown = $bygO3$useCallback((e)=>{
        var ref1;
        let caret = ((ref1 = ref.current) === null || ref1 === void 0 ? void 0 : ref1.selectionStart) || $261f5a2c35712d01$var$getStartPosition(mask);
        const target = e.target;
        switch(e.key){
            case 'ArrowUp':
            case 'Home':
            case 'Escape':
                if (e.key === 'Escape') onChange('');
                const pos = $261f5a2c35712d01$var$getStartPosition(mask);
                $261f5a2c35712d01$var$setCaret(target, pos);
                e.preventDefault();
                e.stopPropagation();
                break;
            case 'Backspace':
                {
                    const valuePos = $261f5a2c35712d01$var$getValuePosition(value, mask, caret);
                    const newValue = `${value.substring(0, valuePos - 1)}${value.substring(valuePos, value.length)}`;
                    let maskPos = $261f5a2c35712d01$var$getMaskPosition(newValue, mask, valuePos);
                    maskPos = Math.max(maskPos - 1, $261f5a2c35712d01$var$getStartPosition(mask));
                    onChange(newValue);
                    $261f5a2c35712d01$var$setCaret(target, maskPos);
                    e.preventDefault();
                    e.stopPropagation();
                    break;
                }
            case 'Delete':
                {
                    const valuePos = $261f5a2c35712d01$var$getValuePosition(value, mask, caret);
                    const newValue = `${value.substring(0, valuePos)}${value.substring(valuePos + 1, value.length)}`;
                    onChange(newValue);
                    $261f5a2c35712d01$var$setCaret(target, caret);
                    e.preventDefault();
                    e.stopPropagation();
                    break;
                }
        }
    }, [
        mask,
        value,
        onChange
    ]);
    const handleMouseDown = $bygO3$useCallback((e)=>{
        // @ts-ignore
        const target = e.target;
        $261f5a2c35712d01$var$setCaret(target, 0, ()=>{
            const start = $261f5a2c35712d01$var$getStartPosition(mask);
            if ((target.selectionStart || 0) < start) return start;
            return target.selectionStart || 0;
        });
    }, [
        mask
    ]);
    $bygO3$useEffect(()=>{
        validate(formattedValue, true);
    }, [
        formattedValue,
        validate
    ]);
    return(/*#__PURE__*/ $bygO3$jsx("div", {
        style: {
            height: '2.5rem'
        },
        children: /*#__PURE__*/ $bygO3$jsxs("label", {
            htmlFor: id.current,
            style: {
                display: 'flex'
            },
            children: [
                /*#__PURE__*/ $bygO3$jsxs("span", {
                    style: {
                        margin: '5px'
                    },
                    children: [
                        label,
                        " "
                    ]
                }),
                /*#__PURE__*/ $bygO3$jsxs("div", {
                    style: {
                        display: 'relative'
                    },
                    children: [
                        /*#__PURE__*/ $bygO3$jsx("input", {
                            style: {
                                position: 'absolute',
                                color: '#a9a9a9',
                                pointerEvents: 'none',
                                border: '2px solid transparent',
                                outline: 'none'
                            },
                            tabIndex: -1,
                            value: formattedValue.concat(placeholder.slice(formattedValue.length)),
                            onChange: ()=>{
                            }
                        }),
                        /*#__PURE__*/ $bygO3$jsx("input", {
                            id: id.current,
                            style: {
                                position: 'absolute',
                                caretColor: 'black',
                                background: 'transparent',
                                ...errorBorder
                            },
                            ref: ref,
                            value: formattedValue,
                            onInput: handleInput,
                            onKeyDown: handleKeyDown,
                            onMouseDown: handleMouseDown
                        }),
                        /*#__PURE__*/ $bygO3$jsx("div", {
                            style: {
                                color: 'red',
                                position: 'relative',
                                top: '1.4rem',
                                fontSize: 12
                            },
                            children: error && errorMessage
                        })
                    ]
                })
            ]
        })
    }));
};


export {$261f5a2c35712d01$export$1d675918e0abc419 as defaultParser, $261f5a2c35712d01$export$74332e2e6daaf651 as defaultFormatter, $261f5a2c35712d01$export$62f94f5123750502 as FormattedInput};
//# sourceMappingURL=index.es.js.map
