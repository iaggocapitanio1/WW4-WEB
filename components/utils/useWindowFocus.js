import { useEffect, useState } from 'react';

function useWindowFocus () {
  const [focused, setFocus] = useState(true);

  const handleFocus = () => {
    setFocus(!focused);
  };

  const handleBlur = () => setFocus(false);

  useEffect(() => {
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  });

  return focused;
}

export default useWindowFocus;
