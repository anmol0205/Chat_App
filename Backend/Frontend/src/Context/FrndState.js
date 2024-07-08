import React, { createContext, useState } from 'react';

const FrndContext = createContext();

export const FrndProvider = ({ children }) => {
  const [frnd_data, setFrndData] = useState('djesds');

  const update = (userId) => {
    setFrndData(userId);
  };

  return (
    <FrndContext.Provider value={{ frnd_data, update }}>
      {children}
    </FrndContext.Provider>
  );
};

export default FrndContext;
