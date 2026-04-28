import type { ReactNode } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from './AuthContext';

type PrivateRouteProps = {
  exact?: boolean;
  path: string;
  children: ReactNode;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ exact, path, children }) => {
  const { isAuthed } = useAuth();

  if (!isAuthed) {
    return (
      <Route
        exact={exact}
        path={path}
        render={({ location }) => <Redirect to={{ pathname: '/login', state: { from: location.pathname } }} />}
      />
    );
  }

  return (
    <Route exact={exact} path={path}>
      {children}
    </Route>
  );
};

export default PrivateRoute;

