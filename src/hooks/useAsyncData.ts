import { useCallback, useEffect, useState } from "react";

export function useAsyncData<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await load();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [load]);

 
  useEffect(() => {
    let cancelled = false

    const initialLoad = async () => {
      try{
        const result = await load()
        if(!cancelled){
          setData(result);
          setError(null);
        }
      }catch (err){
        if(!cancelled){
          setError(err instanceof Error ? err.message : "Request failed"
          ) 
          setData(null)
        }
      } finally{
        if (!cancelled){
          setLoading(false)
        }
      }
    }

    initialLoad()

    return()=> {
      cancelled = true
    }
  }, [load])

  return { data, loading, error, reload, setData };
}
