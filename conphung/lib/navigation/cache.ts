import { revalidatePath } from 'next/cache';

export function revalidateNavigation() {
  revalidatePath('/', 'layout');
  revalidatePath('/', 'page');
}
