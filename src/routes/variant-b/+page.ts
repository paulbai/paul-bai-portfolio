import { redirect } from '@sveltejs/kit';

export const trailingSlash = 'always';

export function load() {
  redirect(308, '/');
}
