export interface FormattedInputProps {
    label: string;
    value: string;
    mask: string;
    placeholder: string;
    errorMessage: string;
    parser?: (str: string | null | undefined) => string;
    formatter?: (str: string, mask: string) => string;
    onChange: (str: string) => void;
}
export const defaultParser: (value: string | null | undefined) => string;
export const defaultFormatter: (value: string, mask: string) => string;
export const FormattedInput: ({ label, value, parser, mask, placeholder, errorMessage, formatter, onChange, }: FormattedInputProps) => JSX.Element;

//# sourceMappingURL=types.d.ts.map
