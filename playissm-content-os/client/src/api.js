const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${options.method ?? 'GET'} ${path} failed: ${res.status} ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

function makeResource(name) {
  return {
    list: (query = '') => request(`/${name}${query}`),
    get: (id) => request(`/${name}/${id}`),
    create: (data) => request(`/${name}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/${name}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id) => request(`/${name}/${id}`, { method: 'DELETE' }),
  };
}

export const api = {
  brands: makeResource('brands'),
  pillars: makeResource('pillars'),
  platforms: makeResource('platforms'),
  sequences: makeResource('sequences'),
  hashtagGroups: makeResource('hashtag-groups'),
  wiki: makeResource('wiki'),
  posts: {
    ...makeResource('posts'),
    addChecklistItem: (postId, label) =>
      request(`/posts/${postId}/checklist`, { method: 'POST', body: JSON.stringify({ label }) }),
    updateChecklistItem: (postId, itemId, data) =>
      request(`/posts/${postId}/checklist/${itemId}`, { method: 'PUT', body: JSON.stringify(data) }),
    removeChecklistItem: (postId, itemId) =>
      request(`/posts/${postId}/checklist/${itemId}`, { method: 'DELETE' }),
    addLink: (postId, relatedPostId, label) =>
      request(`/posts/${postId}/links`, {
        method: 'POST',
        body: JSON.stringify({ related_post_id: relatedPostId, relation_label: label }),
      }),
    removeLink: (postId, linkId) =>
      request(`/posts/${postId}/links/${linkId}`, { method: 'DELETE' }),
  },
  platformNotes: {
    list: (platformId) => request(`/platform-notes?platform_id=${platformId}`),
    create: (platformId, content) =>
      request('/platform-notes', {
        method: 'POST',
        body: JSON.stringify({ platform_id: platformId, content }),
      }),
    remove: (id) => request(`/platform-notes/${id}`, { method: 'DELETE' }),
  },
};
