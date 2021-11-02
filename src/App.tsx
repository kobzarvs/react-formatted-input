import React, { useState } from "react";
import { defaultFormatter, FormattedInput } from "./components/formatted-input";

export default function App() {
  const [phone, setPhone] = useState<string>("");
  const [date1, setDate1] = useState<string>("");
  const [date2, setDate2] = useState<string>("");
  const [card, setCard] = useState<string>("");

  return (
    <div>
      <div
        style={{
          border: "1px solid lightgray",
          padding: 10,
          margin: 10,
          color: "gray",
          backgroundColor: "#ffffb3"
        }}
      >
        <div>Escape - reset value</div>
        <div>Home - jump to mask start position</div>
      </div>

      <FormattedInput
        label="Phone"
        value={phone}
        mask="+# (###) ###-##-##"
        placeholder="+7 (999) 123-45-67"
        onChange={setPhone}
        formatter={defaultFormatter}
        errorMessage="Invalid number"
      />
      <FormattedInput
        label="Date 1"
        value={date1}
        mask="####-##-##"
        placeholder="YYYY-MM-DD"
        onChange={setDate1}
        formatter={defaultFormatter}
        errorMessage="Invalid date"
      />
      <FormattedInput
        label="Date 2"
        value={date2}
        mask="^_: ##.##.####"
        placeholder="Aa: DD.MM.YYYY"
        onChange={setDate2}
        formatter={defaultFormatter}
        errorMessage="Invalid date"
      />
      <FormattedInput
        label="Credit card"
        value={card}
        mask="#### #### #### ####"
        placeholder="1234 5678 9012 3456"
        onChange={setCard}
        formatter={defaultFormatter}
        errorMessage="Invalid card number"
      />
    </div>
  );
}
