import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './stylesheet/index.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { persistor, store } from './lib/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Spin } from 'antd';
import App from './pages/App';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={<Spin />} persistor={persistor}>
          <ToastContainer autoClose={1500} limit={1}/>
          <App />
        </PersistGate>
      </Provider>
    </StrictMode>,
  );
}
