import AppRoutes from './routes/AppRoutes';
import GlobalToast from './components/GlobalToast';
import Toast from './components/Toast';

function App() {
  
  return (
    <>
      <GlobalToast />
      <AppRoutes />
      <Toast />
    </>
  );

}

export default App;
