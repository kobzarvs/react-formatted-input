import {
  FormEvent,
  useState,
  KeyboardEvent,
  useRef,
  MouseEvent,
  useCallback,
  useEffect
} from "react";

export interface FormattedInputProps {
  label: string;
  value: string;
  mask: string;
  placeholder: string;
  errorMessage: string;
  parser?: (str: string | null | undefined) => string;
  formatter: (str: string, mask: string) => string;
  onChange: (str: string) => void;
}

const MASK_CHARS = ["^", "_", "#", undefined];

export const defaultParser = (value: string | null | undefined): string => {
  if (value === null || value === undefined) {
    return "";
  }
  return value.replace(/[^A-ZА-Я0-9]/gi, "");
};

export const defaultFormatter = (value: string, mask: string): string => {
  let result = [];
  for (let i = 0, m = 0; m < mask.length; ++m) {
    if (MASK_CHARS.includes(mask[m])) {
      if (i >= value.length) break;
      result.push(value[i++]);
    } else {
      result.push(mask[m]);
    }
  }
  return result.join("");
};

const getStartPosition = (mask: string): number => {
  let startPos = 0;
  while (!MASK_CHARS.includes(mask[startPos]) && startPos < mask.length) {
    startPos++;
  }
  return startPos;
};

const getValuePosition = (
  value: string,
  mask: string,
  maskPos: number
): number => {
  let pos = 0;
  for (let i = 0; i < maskPos; ++i) {
    if (MASK_CHARS.includes(mask[i])) {
      pos++;
    }
  }
  return pos;
};

const setCaret = (
  target: HTMLInputElement,
  pos: number,
  callback?: () => number
) => {
  requestAnimationFrame(() => {
    if (callback) {
      pos = callback();
    }
    target.setSelectionRange(pos, pos);
  });
};

const getMaskPosition = (
  value: string,
  mask: string,
  valuePos: number
): number => {
  let pos = 0;
  for (let i = 0; pos < mask.length && i < valuePos; ++pos) {
    if (MASK_CHARS.includes(mask[pos])) {
      i++;
    }
    console.log(i, valuePos, pos, MASK_CHARS.includes(mask[pos]), value[i]);
  }
  return pos;
};

export const FormattedInput = ({
  label,
  value,
  parser,
  mask,
  placeholder,
  errorMessage,
  formatter,
  onChange
}: FormattedInputProps) => {
  parser = parser || defaultParser;

  const ref = useRef<HTMLInputElement | null>(null);
  const formattedValue = formatter(value, mask);
  const id = useRef(Math.random().toString(36));
  const [error, setError] = useState(false);

  const getPattern = useCallback(
    (value: string): string => {
      if (value.length === 0) {
        return "";
      }

      const maskChars = mask.split("").slice(0, value.length);
      maskChars.unshift("");
      const reStr = maskChars
        .join("\\")
        .replace(/\\#/g, "\\d")
        .replace(/\\\^/g, "[A-ZА-Я]")
        .replace(/\\_/g, "[a-zа-я]");

      return `^${reStr}$`;
    },
    [mask]
  );

  const validate = useCallback(
    (value: string, showError: boolean): boolean => {
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
    },
    [mask]
  );

  const handleInput = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      const value = target.value.substr(0, mask.length);
      let savePos = target.selectionStart || getStartPosition(mask);
      const parsedValue = parser ? parser(value) : value;

      onChange(parsedValue);
      if (savePos < value.length) {
        setCaret(target, savePos);
      }
    },
    [parser, onChange, mask]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      let caret = ref.current?.selectionStart || getStartPosition(mask);
      const target = e.target as HTMLInputElement;

      switch (e.key) {
        case "ArrowUp":
        case "Home":
        case "Escape":
          if (e.key === "Escape") {
            onChange("");
          }
          const pos = getStartPosition(mask);
          setCaret(target, pos);
          e.preventDefault();
          e.stopPropagation();
          break;
        case "Backspace":
          {
            const valuePos = getValuePosition(value, mask, caret);
            const newValue = `${value.substring(
              0,
              valuePos - 1
            )}${value.substring(valuePos, value.length)}`;
            let maskPos = getMaskPosition(newValue, mask, valuePos);
            maskPos = Math.max(maskPos - 1, getStartPosition(mask));
            onChange(newValue);
            setCaret(target, maskPos);
            e.preventDefault();
            e.stopPropagation();
          }
          break;
        case "Delete":
          {
            const valuePos = getValuePosition(value, mask, caret);
            const newValue = `${value.substring(0, valuePos)}${value.substring(
              valuePos + 1,
              value.length
            )}`;
            onChange(newValue);
            setCaret(target, caret);
            e.preventDefault();
            e.stopPropagation();
          }
          break;
      }
    },
    [mask, value, onChange]
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLInputElement;
      setCaret(target, 0, () => {
        const start = getStartPosition(mask);
        if ((target.selectionStart || 0) < start) {
          return start;
        }
        return target.selectionStart || 0;
      });
    },
    [mask]
  );

  const errorBorder = error ? { border: "2px solid red" } : {};

  useEffect(() => {
    validate(formattedValue, true);
  }, [formattedValue, validate]);

  return (
    <div style={{ height: "2.5rem" }}>
      <label htmlFor={id.current} style={{ display: "flex" }}>
        <span style={{ margin: "5px" }}>{label} </span>
        <div style={{ display: "relative" }}>
          <input
            style={{
              position: "absolute",
              color: "#a9a9a9",
              pointerEvents: "none",
              border: "2px solid transparent",
              outline: "none"
            }}
            tabIndex={-1}
            value={formattedValue.concat(
              placeholder.slice(formattedValue.length)
            )}
            onChange={() => {}}
          />
          <input
            id={id.current}
            style={{
              position: "absolute",
              caretColor: "black",
              background: "transparent",
              ...errorBorder
            }}
            ref={ref}
            value={formattedValue}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onMouseDown={handleMouseDown}
          />
          <div
            style={{
              color: "red",
              position: "relative",
              top: "1.4rem",
              fontSize: 12
            }}
          >
            {error && errorMessage}
          </div>
        </div>
      </label>
    </div>
  );
};
