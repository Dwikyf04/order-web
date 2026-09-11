import { useEffect, useState } from "react";
import { listBrandPartners } from "../../infrastructure/content/contentRepository";

export function useBrandPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    listBrandPartners()
      .then((data) => {
        if (!cancelled) {
          setPartners(data);
          setError(null);
        }
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    sponsors: partners.filter((item) => item.type === "sponsor"),
    partners: partners.filter((item) => item.type === "partner"),
    loading,
    error,
  };
}
