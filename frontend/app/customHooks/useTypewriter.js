import { useState, useEffect } from 'react';

const useTypewriter = (text, delay = 0.1) => {
  const [currentText, setCurrentText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setCurrentText('');
    setIndex(0);
  }, [text]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (index < text.length) {
        setCurrentText(prevText => prevText + text[index]);
        setIndex(index + 1);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [index, text, delay]);

  return currentText;
};

export default useTypewriter;
