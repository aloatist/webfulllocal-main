'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Edit2,
  ExternalLink,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TourStatus, TourDifficulty } from '@prisma/client';
import {
  TourForm,
  TourWithRelations,
} from '@/components/tours/tour-form';
import type { CreateTourInput, UpdateTourInput } from '@/lib/tours/schemas';

interface ToursResponse {
  data: TourWithRelations[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

type SubmissionPayload = CreateTourInput | UpdateTourInput;

const statusColorMap: Record<TourStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  PUBLISHED: 'bg-emerald-100 text-emerald-800',
  ARCHIVED: 'bg-amber-100 text-amber-800',
};

const statusLabelMap: Record<TourStatus, string> = {
  DRAFT: 'Bản nháp',
  PUBLISHED: 'Đang hiển thị',
  ARCHIVED: 'Đã lưu trữ',
};

const difficultyColorMap: Record<TourDifficulty, string> = {
  EASY: 'bg-blue-100 text-blue-800',
  MODERATE: 'bg-sky-100 text-sky-800',
  CHALLENGING: 'bg-orange-100 text-orange-800',
  EXTREME: 'bg-red-100 text-red-800',
};

const difficultyLabelMap: Record<TourDifficulty, string> = {
  EASY: 'Dễ',
  MODERATE: 'Trung bình',
  CHALLENGING: 'Thử thách',
  EXTREME: 'Cực khó',
};

function formatPrice(amount?: string | null, currency = 'VND') {
  if (!amount) return '—';
  const numeric = Number(amount);
  if (Number.isNaN(numeric)) {
    return `${amount} ${currency}`;
  }
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(numeric);
  } catch {
    return `${numeric.toLocaleString()} ${currency}`;
  }
}

function formatStatus(status: TourStatus) {
  return statusLabelMap[status] ?? status;
}

function formatDifficulty(difficulty: TourDifficulty) {
  return difficultyLabelMap[difficulty] ?? difficulty;
}

function getUpcomingDeparture(tour: TourWithRelations) {
  if (!tour.departures || tour.departures.length === 0) return null;
  const now = new Date();
  const upcoming = [...tour.departures]
    .map((departure) => ({
      ...departure,
      startDate: new Date(departure.startDate),
    }))
    .filter((departure) => !Number.isNaN(departure.startDate.getTime()))
    .sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
    )
    .find((departure) => departure.startDate >= now);

  return upcoming ?? null;
}

export default function ToursPage() {
  const [tours, setTours] = useState<TourWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedTour, setSelectedTour] = useState<TourWithRelations | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TourStatus | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] =
    useState<TourDifficulty | 'all'>('all');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const loadTours = async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set('limit', '50');
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (difficultyFilter !== 'all')
      params.set('difficulty', difficultyFilter);

    try {
      const response = await fetch(`/api/tours?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Không thể tải danh sách tour');
      }

      const data = (await response.json()) as ToursResponse;
      setTours(Array.isArray(data?.data) ? data.data : []);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Không thể tải danh sách tour'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusFilter, difficultyFilter]);

  const handleCreate = () => {
    setSelectedTour(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEdit = (tour: TourWithRelations) => {
    setSelectedTour(tour);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTour(null);
  };

  const handleSubmit = async (payload: SubmissionPayload) => {
    const url =
      dialogMode === 'create'
        ? '/api/tours'
        : `/api/tours/${selectedTour?.id}`;
    const method = dialogMode === 'create' ? 'POST' : 'PUT';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);

      const issueMessages = Array.isArray(errorBody?.issues)
        ? (errorBody.issues as Array<{ message?: string }>)
            .map((issue) => issue?.message)
            .filter((message): message is string => Boolean(message))
        : [];

      const message =
        issueMessages.length > 0
          ? issueMessages.join('\n')
          : errorBody?.error ?? 'Không thể lưu tour. Vui lòng thử lại.';

      throw new Error(message);
    }

    const tour = (await response.json()) as TourWithRelations;
    setTours((prev) => {
      if (dialogMode === 'create') {
        return [tour, ...prev];
      }
      return prev.map((item) => (item.id === tour.id ? tour : item));
    });
  };

  const handleDelete = async (tour: TourWithRelations, forceDelete = false) => {
    if (!forceDelete) {
      const confirmed = window.confirm(
        `Bạn có chắc muốn xóa tour "${tour.title}"?`
      );
      if (!confirmed) return;
    }

    try {
      const url = forceDelete 
        ? `/api/tours/${tour.id}?force=true`
        : `/api/tours/${tour.id}`;
        
      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        
        console.error('❌ Delete error:', body);
        
        // Handle conflict error (409) with detailed info
        if (response.status === 409 && body?.details) {
          const { bookings, departures, reviews, total } = body.details;
          
          let detailedMessage = body.error || 'Không thể xóa tour có dữ liệu liên quan.';
          
          detailedMessage += '\n\n📊 Dữ liệu liên quan:';
          if (bookings > 0) detailedMessage += `\n• ${bookings} đơn đặt tour`;
          if (departures > 0) detailedMessage += `\n• ${departures} lịch khởi hành`;
          if (reviews > 0) detailedMessage += `\n• ${reviews} đánh giá`;
          detailedMessage += `\n\n📝 Tổng: ${total} bản ghi`;
          
          detailedMessage += '\n\n💡 Bạn có muốn XÓA TOÀN BỘ (tour + tất cả dữ liệu liên quan)?';
          
          console.warn('⚠️ Cannot delete tour:', body.details);
          
          // Ask for force delete
          const forceConfirmed = window.confirm(
            detailedMessage + '\n\n⚠️ CẢNH BÁO: Hành động này KHÔNG THỂ HOÀN TÁC!'
          );
          
          if (forceConfirmed) {
            return handleDelete(tour, true); // Recursive call with force=true
          }
          
          throw new Error(detailedMessage);
        }
        
        throw new Error(
          body?.error ??
            'Không thể xóa tour. Vui lòng kiểm tra các booking liên quan.'
        );
      }
      
      const result = await response.json();
      setTours((prev) => prev.filter((item) => item.id !== tour.id));
      
      if (result.deleted) {
        alert(
          `✅ Đã xóa tour cùng ${result.deleted.bookings} đơn đặt, ` +
          `${result.deleted.departures} lịch khởi hành, ${result.deleted.reviews} đánh giá!`
        );
      } else {
        alert('✅ Đã xóa tour thành công!');
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Không thể xóa tour'
      );
    }
  };

  const statusOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả trạng thái' },
      { value: 'DRAFT', label: statusLabelMap.DRAFT },
      { value: 'PUBLISHED', label: statusLabelMap.PUBLISHED },
      { value: 'ARCHIVED', label: statusLabelMap.ARCHIVED },
    ],
    []
  );

  const difficultyOptions = useMemo(
    () => [
      { value: 'all', label: 'Mọi độ khó' },
      { value: 'EASY', label: difficultyLabelMap.EASY },
      { value: 'MODERATE', label: difficultyLabelMap.MODERATE },
      { value: 'CHALLENGING', label: difficultyLabelMap.CHALLENGING },
      { value: 'EXTREME', label: difficultyLabelMap.EXTREME },
    ],
    []
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý tour</h1>
          <p className="text-sm text-muted-foreground">
            Tạo, chỉnh sửa và quản lý lịch khởi hành, giá bán, dịch vụ của tour du lịch.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <Button asChild variant="link" className="h-auto p-0">
              <Link href="/tours" target="_blank" rel="noopener noreferrer">
                Xem trang tour
              </Link>
            </Button>
            <span className="text-muted-foreground">|</span>
            <Button asChild variant="link" className="h-auto p-0">
              <Link href="/admin/categories">
                Quản lý danh mục tour
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={loadTours}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm tour
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Tìm kiếm theo tên, điểm nhấn..."
          className="lg:col-span-2"
        />
        <Select
          value={statusFilter}
          onValueChange={(value: TourStatus | 'all') => setStatusFilter(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={difficultyFilter}
          onValueChange={(value: TourDifficulty | 'all') =>
            setDifficultyFilter(value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn độ khó" />
          </SelectTrigger>
          <SelectContent>
            {difficultyOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tour</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Độ khó</TableHead>
              <TableHead>Giá cơ bản</TableHead>
              <TableHead>Lịch khởi hành</TableHead>
              <TableHead>Đã cập nhật</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Đang tải danh sách tour...
                </TableCell>
              </TableRow>
            )}
            {!loading && tours.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Chưa có tour nào. Hãy tạo tour đầu tiên!
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              tours.map((tour) => {
                const upcoming = getUpcomingDeparture(tour);
                return (
                  <TableRow key={tour.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{tour.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {tour.slug}
                        </div>
                        {tour.isFeatured && (
                          <Badge className="bg-purple-100 text-purple-800">
                            Nổi bật
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColorMap[tour.status]}>
                        {formatStatus(tour.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={difficultyColorMap[tour.difficulty]}>
                        {formatDifficulty(tour.difficulty)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatPrice(tour.basePrice, tour.currency)}
                    </TableCell>
                    <TableCell>
                      {upcoming ? (
                        <div className="space-y-1 text-sm">
                          <div>{format(upcoming.startDate, 'dd/MM/yyyy')}</div>
                          <div className="text-xs text-muted-foreground">
                            {upcoming.seatsAvailable} / {upcoming.seatsTotal} ghế
                            còn lại
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Chưa lên lịch
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(tour.updatedAt ?? Date.now()), 'dd/MM/yyyy')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/tours/${tour.slug}`} target="_blank" className="cursor-pointer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Xem tour
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(tour)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(tour)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa tour
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Thêm tour mới' : 'Chỉnh sửa tour'}
            </DialogTitle>
          </DialogHeader>
          <TourForm
            mode={dialogMode}
            initialData={selectedTour}
            onSubmit={handleSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
