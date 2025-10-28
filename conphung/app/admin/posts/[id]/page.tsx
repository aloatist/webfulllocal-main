'use client';

import { PostEditor } from '@/components/posts/post-editor';

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: PageProps) {
  return <PostEditor postId={params.id} />;
}
