import { redirect } from 'next/navigation';

// Redirect old homepage CMS to unified Home Settings
export default function HomepageCMSPage() {
  redirect('/admin/homepage-settings');
}
