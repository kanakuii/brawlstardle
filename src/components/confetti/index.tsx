import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

export default function ConfettiEffect({ duration = 3000 }) {
  const [show, setShow] = useState(true);
  const [windowDimension, setWindowDimension] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      // Automatically hide after the specified duration
      const timer = setTimeout(() => setShow(false), duration);

      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timer);
      };
    }
  }, [duration]);

  return (
    <>
      {show && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={false} 
          numberOfPieces={500}
          gravity={0.3}
          colors={['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']}
        />
      )}
    </>
  );
};