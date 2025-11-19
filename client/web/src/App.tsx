import { useState } from 'react'

import { Button } from './shared/ui/Button';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Button
            label={`count is ${count}`}
            onPress={() => setCount((count) => count + 1)}
        />
    </>
  )
}

export default App;
