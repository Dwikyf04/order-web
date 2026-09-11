import { useEffect, useState } from "react";
import { listCatalog, listCategories } from "../../infrastructure/catalog/catalogRepository";

export function useCatalog({ category, featuredOnly = false } = {}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      listCatalog({ category, featuredOnly }),
      listCategories(),
    ])
      .then(([catalog, categoryRows]) => {
        if (cancelled) return;
        setProducts(catalog);
        setCategories(categoryRows);
        setError(null);
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
  }, [category, featuredOnly]);

  return { products, categories, loading, error };
}
