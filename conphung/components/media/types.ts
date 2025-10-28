export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  publicId: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  caption: string | null;
  uploadedBy: {
    id: string;
    name: string | null;
    email: string | null;
  };
  createdAt: string;
  updatedAt: string;
}
