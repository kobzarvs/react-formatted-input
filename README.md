This is a test task from a job interview, which was allocated 30 minutes of live coding.
Maybe this example will be useful for someone to start a more advanced component or you can use it as is.

![demo](/public/formatted-input.gif)

## Component API

```ts
interface FormattedInputProps {
  label: string;
  value: string;
  mask: string;
  placeholder: string;
  errorMessage: string;
  parser?: (str: string | null | undefined) => string;
  formatter?: (str: string, mask: string) => string;
  onChange: (str: string) => void;
}
```

## Mask format
```
^ - upercase character
_ - lowercase character
# - number
```

## Example:

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
      errorMessage="Invalid number"
      onChange={setPhone}
      parser={defaultParser} // optional
      formatter={defaultFormatter} // optional
    />
  )
};
```

## Codesandbox example

https://codesandbox.io/s/formatted-input-demo-1tkmd?file=/src/App.tsx

## Vercel demo

https://react-formatted-input.vercel.app/
