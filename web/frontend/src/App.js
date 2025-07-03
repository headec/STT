////post
import React from 'react';
import Recorder from './Recorder';

// function App() {
//   return (
//     <div className="App">
//       <h1>🎧 STT 실시간 데모</h1>
//       <Recorder />
//     </div>
//   );
// }

////live
// import React from 'react';
// import LiveSTT from './components/LiveSTT';

// function App() {
//   return (
//     <div>
//       <LiveSTT />
//     </div>
//   );
// }

// import React from "react";
import MicStream from "./components/MicStream";

function App() {
  return (
    <div className="App">
      <h1>🎧 Whisper </h1>
      <MicStream />
      <Recorder />
    </div>
  );
}

export default App;
