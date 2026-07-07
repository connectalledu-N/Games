import React, { createContext, useContext, useState } from 'react';

const Ctx = createContext(null);

export function PostModalProvider({ children }) {
  const [state, setState] = useState({ open: false, postId: null, draft: null });

  function openPost(postId) {
    setState({ open: true, postId, draft: null });
  }

  function openNewPost(draft = {}) {
    setState({ open: true, postId: null, draft });
  }

  function close() {
    setState({ open: false, postId: null, draft: null });
  }

  return (
    <Ctx.Provider value={{ ...state, openPost, openNewPost, close }}>{children}</Ctx.Provider>
  );
}

export function usePostModal() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('usePostModal must be used within PostModalProvider');
  return ctx;
}
