import { useNavigate, useLocation } from 'react-router-dom';

export const useAppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (path: string, options?: { replace?: boolean; state?: any }) => {
    navigate(path, options);
  };

  const goBack = () => {
    navigate(-1);
  };

  const goForward = () => {
    navigate(1);
  };

  const getCurrentPath = () => location.pathname;

  const isCurrentPath = (path: string) => location.pathname === path;

  return {
    navigateTo,
    goBack,
    goForward,
    getCurrentPath,
    isCurrentPath,
    location
  };
};

export default useAppNavigation;
