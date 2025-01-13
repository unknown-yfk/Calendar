import React from 'react';
import { Calendar } from './components/Calendar';

const App: React.FC = () => {
  return (
    <div>
      <Calendar initialDate={new Date()} />
    </div>
  );
};

export default App;

