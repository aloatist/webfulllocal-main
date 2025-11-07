'use client';

import dynamic from 'next/dynamic';
import Loader from '@/components/Loader';

// Lazy load PostEditor with loading state
const PostEditor = dynamic(() => import('@/components/posts/post-editor').then(mod => ({ default: mod.PostEditor })), {
  loading: () => (
    <div className="flex h-96 items-center justify-center rounded-lg bg-muted/50">
      <div className="text-center space-y-4">
        <Loader />
        <p className="text-sm text-gray-600 dark:text-gray-400">Đang tải trình soạn thảo...</p>
      </div>
    </div>
  ),
  ssr: false, // EditorJS only works client-side
});

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: PageProps) {
  return <PostEditor postId={params.id} />;
}
