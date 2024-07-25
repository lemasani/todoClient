import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

// Pages
import Login from './Pages/Login';
import Register from './Pages/Register';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route exact path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>
  )
);

function App() {
  return (
    // <Route>
    //     <Route exact path="/" component={Home} />
    //     <Route path="/register" component={Register} />
    // </Route>

    <RouterProvider router={router} />
  );
}

export default App;
