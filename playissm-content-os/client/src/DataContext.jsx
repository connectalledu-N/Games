import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const DataCtx = createContext(null);

export function DataProvider({ children }) {
  const [brands, setBrands] = useState([]);
  const [pillars, setPillars] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [sequences, setSequences] = useState([]);
  const [hashtagGroups, setHashtagGroups] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshReference = useCallback(async () => {
    const [b, p, pl, s, h] = await Promise.all([
      api.brands.list(),
      api.pillars.list(),
      api.platforms.list(),
      api.sequences.list(),
      api.hashtagGroups.list(),
    ]);
    setBrands(b);
    setPillars(p);
    setPlatforms(pl);
    setSequences(s);
    setHashtagGroups(h);
  }, []);

  const refreshPosts = useCallback(async () => {
    const rows = await api.posts.list();
    setPosts(rows);
    return rows;
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([refreshReference(), refreshPosts()])
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [refreshReference, refreshPosts]);

  const pillarById = (id) => pillars.find((p) => p.id === id);
  const platformById = (id) => platforms.find((p) => p.id === id);
  const brandById = (id) => brands.find((b) => b.id === id);
  const sequenceById = (id) => sequences.find((s) => s.id === id);

  async function createPost(data) {
    const created = await api.posts.create(data);
    await refreshPosts();
    return created;
  }

  async function updatePost(id, data) {
    const updated = await api.posts.update(id, data);
    await refreshPosts();
    return updated;
  }

  async function deletePost(id) {
    await api.posts.remove(id);
    await refreshPosts();
  }

  const value = {
    brands,
    pillars,
    platforms,
    sequences,
    hashtagGroups,
    posts,
    loading,
    error,
    refreshReference,
    refreshPosts,
    createPost,
    updatePost,
    deletePost,
    pillarById,
    platformById,
    brandById,
    sequenceById,
  };

  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>;
}

export function useData() {
  const ctx = useContext(DataCtx);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
