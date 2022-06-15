import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './App.css';
import NotFound from './components/NotFound/NotFound';
import About from './components/About/About';
import MFE1 from './components/MFE1/MFE1';
import MFE2 from './components/MFE2/MFE2';
import WebcMFE1 from './components/WebcMFE1/WebcMFE1';
import StencilMFE1 from './components/StencilMFE1/StencilMFE1';
import COMFE from './components/COMFE/COMFE';
import Sidebar from './components/Sidebar/Sidebar';
// import Statusbar from './components/Statusbar/Statusbar';
// import { MFEController } from './controller';

import './util';

// MFEController.setConfig('reactMFE1', {});
// MFEController.prefetch({
//   instanceId: 'mfe1',
//   appId: 'reactMFE1',
//   registryUrl: 'http://localhost:9001',
//   env: 'dev',
// });
function App(props) {
  return (
    <div className='App'>
      <div className='App_container'>
        <Sidebar />
        <div className='content'>
          <Routes>
            <Route path='/' element={<About />} />
            <Route path='/about' element={<About />} />
            <Route path='/mfe1/*' element={<MFE1 {...props} />} />
            <Route path='/mfe2/*' element={<MFE2 {...props} />} />
            <Route path='/webcmfe1/*' element={<WebcMFE1 {...props} />} />
            <Route path='/stencilmfe1/*' element={<StencilMFE1 {...props} />} />
            <Route path='/comfe/*' element={<COMFE {...props} />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
        {/* <Statusbar /> */}
      </div>
    </div>
  );
}

export default App;
