import React, { useRef } from 'react';
import BuySection, { BuySectionHandle } from './buy';

export default function ParentComponent() {
  const buySectionRef = useRef<BuySectionHandle>(null);

  const handleParentReset = () => {
    buySectionRef.current?.resetForm();
  };

  return (
    <div>
      <BuySection ref={buySectionRef} />
      <button onClick={handleParentReset}>Reset from Parent</button>
    </div>
  );
}
