import React, { useEffect, useState } from "react";

function replace(str: string, i: number, char: string): string {
  return str.substring(0, i) + char + str.substring(i + 1);
}

interface IProps {
  content: string;
}

function randomize(char: string): string {
  const randFrom = (str: string): string => str[Math.floor(Math.random() * str.length)];
  const classes = ["abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "1234567890", " _", "()[]{}<>"];
  const other = `!@#$%^&*()_+|\\';"/.,?\`~`;

  for (const c of classes) {
    if (c.includes(char)) return randFrom(c);
  }

  return randFrom(other);
}

export function CorruptableText(props: IProps): JSX.Element {
  const [content, setContent] = useState(props.content);

  useEffect(() => {
    let counter = 5;
    const id = setInterval(() => {
      counter--;
      if (counter > 0) return;
      counter = Math.random() * 5;
      const index = Math.random() * content.length;
      const letter = content.charAt(index);
      setContent((content) => replace(content, index, randomize(letter)));
      setTimeout(() => {
        setContent((content) => replace(content, index, letter));
      }, 500);
    }, 20);

    return () => {
      clearInterval(id);
    };
  }, []);

  return <span>{content}</span>;
}
