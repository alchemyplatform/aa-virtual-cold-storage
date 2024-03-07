import { useCallback, useState } from 'react';

export const useAsync = <T>({ asyncFn }: { asyncFn: (...params: any) => Promise<T | null> }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [result, setResult] = useState<T | null>(null);

  const execute = useCallback(
    async (...params: any) => {
      try {
        setLoading(true);
        const response = await asyncFn(...params);
        setResult(response);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    },
    [asyncFn]
  );

  return { error, result, loading, execute };
};
