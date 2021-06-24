import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function useAuht() {
  const value = useContext(AuthContext);

  return value;
}