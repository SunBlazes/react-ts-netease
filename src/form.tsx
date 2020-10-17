import React, { useState, useCallback } from "react";

interface ExpensiveTreeProps {
  onSubmit: () => void;
}

const ExpensiveTree: React.FC<ExpensiveTreeProps> = (props) => {
  const { onSubmit } = props;
  return <div onClick={onSubmit}>submit</div>;
};

function Form() {
  const [text, updateText] = useState("");

  const handleSubmit = useCallback(() => {
    console.log(text);
  }, []); // 每次 text 变化时 handleSubmit 都会变

  return (
    <>
      <input value={text} onChange={(e) => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}

export default Form;
