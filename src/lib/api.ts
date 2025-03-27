import { ERROR_MESSAGES } from "./constants";
import { normalizeHandle } from "./utils";

interface Profile {
  name: string;
  handle: string;
  avatar: string;
  description?: string;
  followersCount: number;
}

export const fetchAnalytics = async (
  handle: string,
  callbacks: {
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
    setPosts: (posts: any[]) => void;
    setProfile: (profile: Profile | null) => void;
    setHandle: (handle: string) => void;
  }
) => {
  const { setLoading, setError, setPosts, setProfile, setHandle } = callbacks;
  setLoading(true);
  setError("");

  try {
    const normalizedHandle = normalizeHandle(handle.trim());
    setHandle(handle); // Set the raw handle in the input

    const res = await fetch(`/api/analyze?handle=${encodeURIComponent(normalizedHandle)}`);
    const json = await res.json();

    if (!res.ok) {
      if (res.status === 400 && json.error?.includes("not found")) {
        setError(ERROR_MESSAGES.NOT_FOUND);
      } else if (res.status === 400 && json.error?.includes("invalid handle")) {
        setError(ERROR_MESSAGES.INVALID_HANDLE);
      } else if (res.status === 400) {
        setError(ERROR_MESSAGES.BAD_REQUEST);
      } else {
        setError(ERROR_MESSAGES.GENERIC);
      }
      setPosts([]);
      setProfile(null);
      return;
    }

    setPosts(json.posts);
    setProfile(json.profile);
  } catch (err) {
    setError(ERROR_MESSAGES.GENERIC);
    setPosts([]);
    setProfile(null);
  } finally {
    setLoading(false);
  }
}; 