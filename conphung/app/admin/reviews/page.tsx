'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Eye, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';

interface Review {
  id: string;
  rating: number;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  booking?: {
    tour?: { id: string; title: string; slug: string };
    homestay?: { id: string; title: string; slug: string };
  };
  adminResponse?: string;
  type?: 'tour' | 'homestay';
}

export default function ReviewsManagementPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [response, setResponse] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Word counter for admin response
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };
  const responseWordCount = countWords(response);
  const MAX_RESPONSE_WORDS = 500;

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.set('status', filter);
      }
      
      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      if (!res.ok) {
        const error = await res.json();
        console.error('Failed to load reviews:', error);
        throw new Error(error.error || 'Failed to load reviews');
      }
      
      const data = await res.json();
      console.log('Loaded reviews:', data.reviews?.length || 0, 'reviews');
      console.log('Sample review:', data.reviews?.[0]);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      alert('Không thể tải danh sách đánh giá. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(`Lỗi: ${data.error || 'Không thể duyệt đánh giá'}`);
        return;
      }
      
      alert('Đã duyệt đánh giá thành công!');
      await loadReviews();
    } catch (error) {
      console.error('Error approving review:', error);
      alert('Có lỗi xảy ra khi duyệt đánh giá');
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn từ chối đánh giá này?')) return;
    
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED' }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(`Lỗi: ${data.error || 'Không thể từ chối đánh giá'}`);
        return;
      }
      
      alert('Đã từ chối đánh giá thành công!');
      await loadReviews();
    } catch (error) {
      console.error('Error rejecting review:', error);
      alert('Có lỗi xảy ra khi từ chối đánh giá');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete review');
      await loadReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleRespond = (review: Review) => {
    setSelectedReview(review);
    setResponse(review.adminResponse || '');
    setIsDialogOpen(true);
  };

  const handleSubmitResponse = async () => {
    if (!selectedReview) return;
    
    if (responseWordCount > MAX_RESPONSE_WORDS) {
      alert(`Phản hồi quá dài! Vui lòng giới hạn trong ${MAX_RESPONSE_WORDS} từ (hiện tại: ${responseWordCount} từ)`);
      return;
    }

    try {
      const res = await fetch(`/api/admin/reviews/${selectedReview.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminResponse: response }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(`Lỗi: ${data.error || 'Không thể gửi phản hồi'}`);
        return;
      }
      
      alert('Đã gửi phản hồi thành công!');
      setIsDialogOpen(false);
      setSelectedReview(null);
      setResponse('');
      await loadReviews();
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Có lỗi xảy ra khi gửi phản hồi');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: Review['status']) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-500">Đã duyệt</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Từ chối</Badge>;
      case 'PENDING':
        return <Badge variant="secondary">Chờ duyệt</Badge>;
      default:
        return null;
    }
  };

  const stats = {
    total: reviews.length,
    pending: reviews.filter((r) => r.status === 'PENDING').length,
    approved: reviews.filter((r) => r.status === 'APPROVED').length,
    rejected: reviews.filter((r) => r.status === 'REJECTED').length,
    avgRating: reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0',
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Quản lý đánh giá</h1>
        <p className="text-muted-foreground">
          Kiểm duyệt và phản hồi đánh giá từ khách hàng
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Tổng số</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Chờ duyệt</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Đã duyệt</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Từ chối</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Đánh giá TB</p>
          <p className="text-2xl font-bold">{stats.avgRating} ⭐</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="PENDING">Chờ duyệt</SelectItem>
            <SelectItem value="APPROVED">Đã duyệt</SelectItem>
            <SelectItem value="REJECTED">Từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Đánh giá</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Không có đánh giá nào
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{review.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {review.user.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {review.booking?.tour ? (
                      <a
                        href={`/tours/${review.booking.tour.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                        title="Xem chi tiết tour"
                      >
                        {review.booking.tour.title}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : review.booking?.homestay ? (
                      <a
                        href={`/homestays/${review.booking.homestay.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                        title="Xem chi tiết homestay"
                      >
                        {review.booking.homestay.title}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>{renderStars(review.rating)}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="space-y-2">
                      <div className="line-clamp-2 text-sm break-words overflow-wrap-anywhere">
                        {review.comment || <span className="text-muted-foreground italic">Không có nội dung</span>}
                      </div>
                      {review.adminResponse && (
                        <div className="rounded bg-blue-50 p-2 text-xs dark:bg-blue-950">
                          <span className="font-medium text-blue-700 dark:text-blue-300">Phản hồi: </span>
                          <span className="text-blue-600 dark:text-blue-400 break-words overflow-wrap-anywhere">{review.adminResponse}</span>
                        </div>
                      )}
                      {review.comment && review.comment.length > 100 && (
                        <button
                          onClick={() => handleRespond(review)}
                          className="text-xs text-primary hover:underline"
                        >
                          Xem đầy đủ
                        </button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(review.status)}</TableCell>
                  <TableCell>
                    {format(new Date(review.createdAt), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {review.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(review.id)}
                            title="Phê duyệt"
                          >
                            <ThumbsUp className="mr-1 h-4 w-4" />
                            Duyệt
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(review.id)}
                            title="Từ chối"
                          >
                            <ThumbsDown className="mr-1 h-4 w-4" />
                            Từ chối
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRespond(review)}
                        title="Phản hồi"
                      >
                        <MessageSquare className="mr-1 h-4 w-4" />
                        Phản hồi
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(review.id)}
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Response Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Phản hồi đánh giá</DialogTitle>
            <DialogDescription>
              Viết phản hồi của bạn cho đánh giá này
            </DialogDescription>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium break-words">{selectedReview.user.name}</p>
                  {renderStars(selectedReview.rating)}
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  <p className="text-sm break-all whitespace-pre-wrap">{selectedReview.comment}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Phản hồi của bạn</label>
                  <span className={`text-xs font-medium ${
                    responseWordCount > MAX_RESPONSE_WORDS 
                      ? 'text-destructive' 
                      : responseWordCount > MAX_RESPONSE_WORDS * 0.9 
                        ? 'text-orange-500' 
                        : 'text-muted-foreground'
                  }`}>
                    {responseWordCount} / {MAX_RESPONSE_WORDS} từ
                  </span>
                </div>
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Nhập phản hồi..."
                  rows={4}
                  className={responseWordCount > MAX_RESPONSE_WORDS ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {responseWordCount > MAX_RESPONSE_WORDS && (
                  <p className="text-xs text-destructive font-medium">
                    Vượt quá {responseWordCount - MAX_RESPONSE_WORDS} từ!
                  </p>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmitResponse}>
              Gửi phản hồi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
