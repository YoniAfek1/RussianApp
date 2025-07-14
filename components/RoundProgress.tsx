import React from 'react';

interface HorizontalProgressProps {
  round: number;
  total: number;
}

const HorizontalProgress = ({ round, total }: HorizontalProgressProps) => {
  const percentage = (round / total) * 100;

  return (
    <div
      style={{
        width: '30%',             // רק 40% מרוחב המסך
        margin: '40px auto',      // ממורכז
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '4px',
        boxShadow: '0 0 4px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: '20px',
          borderRadius: '12px',
          background: 'linear-gradient(to right,rgb(188, 224, 241),rgb(33, 123, 219))',
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  );
};

export default HorizontalProgress;
