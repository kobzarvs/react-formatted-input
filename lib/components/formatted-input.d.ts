/// <reference types="react" />
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
export declare const defaultParser: (value: string | null | undefined) => string;
export declare const defaultFormatter: (value: string, mask: string) => string;
export declare const FormattedInput: ({ label, value, parser, mask, placeholder, errorMessage, formatter, onChange, }: FormattedInputProps) => JSX.Element;
//# sourceMappingURL=formatted-input.d.ts.map