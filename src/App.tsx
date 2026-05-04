import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AppMenu } from './components/AppMenu';
import ShareNavigator from './components/ShareNavigator';
import Home from './pages/Home';
import History from './pages/History';
import Settings from './pages/Settings';
import ExplainMail from './pages/ExplainMail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import PrivateRoute from './auth/PrivateRoute';
import Welcome from './pages/Welcome';
import { useAuth } from './auth/AuthContext';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import './theme/tailwind.css';
import './theme/auth-forms.css';
import './theme/pro-ui.css';
import './theme/stitch-ui.css';

setupIonicReact();

const AppRoutes: React.FC = () => {
  const { isAuthed } = useAuth();

  return (
    <IonReactRouter>
      {isAuthed ? <AppMenu /> : null}
      <ShareNavigator />
      <IonRouterOutlet>
        <Route exact path="/welcome">
          <Welcome />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/forgot-password">
          <ForgotPassword />
        </Route>
        <PrivateRoute exact path="/home">
          <Home />
        </PrivateRoute>
        <PrivateRoute exact path="/history">
          <History />
        </PrivateRoute>
        <PrivateRoute exact path="/settings">
          <Settings />
        </PrivateRoute>
        <PrivateRoute exact path="/explain">
          <ExplainMail />
        </PrivateRoute>
        <PrivateRoute exact path="/explain/:id">
          <ExplainMail />
        </PrivateRoute>
        <Route exact path="/">
          <Redirect to={isAuthed ? '/home' : '/welcome'} />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <AppRoutes />
  </IonApp>
);

export default App;
