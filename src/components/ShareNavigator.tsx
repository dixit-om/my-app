import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useShareReceiver } from '../auth/ShareContext';

/**
 * Small invisible component placed inside the IonReactRouter.
 *
 * Whenever a share arrives (either at cold-start or warm-start) and the user
 * is authenticated, navigate them to /explain so they can see the prefilled
 * message immediately. If they're not yet logged in, leave them where they
 * are — the share text stays in the context, and the moment they sign in
 * and land on /explain (via Home or direct nav), it will be consumed there.
 */
const ShareNavigator: React.FC = () => {
  const { isAuthed } = useAuth();
  const { hasPending } = useShareReceiver();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (!hasPending) return;
    if (!isAuthed) return;
    // Already on the explain page — let it consume the share itself.
    if (location.pathname.startsWith('/explain')) return;
    history.push('/explain');
  }, [hasPending, isAuthed, location.pathname, history]);

  return null;
};

export default ShareNavigator;
