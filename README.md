![demo](/public/formatted-input.gif)

## Mask format
```
^ - upercase character
_ - lowercase character
# - number
```

## Component API

```ts
interface FormattedInputProps {
  label: string;
  value: string;
  mask: string;
  placeholder: string;
  errorMessage: string;
  parser?: (str: string | null | undefined) => string;
  formatter: (str: string, mask: string) => string;
  onChange: (str: string) => void;
}
```

## Exapmle:

```tsx
import {useState} from 'react';
import {defaultParser, defaultFormatter, FormattedInput} from 'react-fmt-input';


const Demo = () => {
  const [phone, setPhone] = useState<string>("");

  return (
    <FormattedInput
      label="Phone"
      value={phone}
      mask="+# (###) ###-##-##"
      placeholder="+7 (999) 123-45-67"
      onChange={setPhone}
      parser={defaultParser}
      formatter={defaultFormatter}
      errorMessage="Invalid number"
    />
  )
};
```

## Codesandbox example

https://codesandbox.io/s/sharp-boyd-fk0od?file=/src/App.tsx

## Vercel demo

https://csb-fk0od.vercel.app/
