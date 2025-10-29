'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Textarea } from '@/components/ui/textarea';
import { BookingStatus } from '@prisma/client';
import { RefreshCw, Trash2 } from 'lucide-react';

interface BookingListItem {
  id: string;
  reference: string;
  status: BookingStatus;
  totalAmount: number;
  currency: string;
  adults: number;
  children: number;
  infants: number;
  specialRequests?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
  };
  tour: {
    id: string;
    title: string;
    slug: string;
  };
  departure: {
    id: string;
    startDate: string | null;
    endDate: string | null;
    seatsTotal: number;
    seatsAvailable: number | null;
  };
  addons: Array<{
    id: string;
    name: string;
    price: number;
    perPerson: boolean;
    quantity: number;
  }>;
}

interface ListResponse {
  data: BookingListItem[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

const statusLabels: Record<BookingStatus, string> = {
  PENDING: 'Đang chờ',
  CONFIRMED: 'Đã xác nhận',
  CANCELLED: 'Đã hủy',
  COMPLETED: 'Hoàn tất',
};

const statusColors: Record<BookingStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-rose-100 text-rose-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingListItem | null>(null);
  const [updating, setUpdating] = useState(false);
  const [adminNotesDraft, setAdminNotesDraft] = useState('');
  const [statusDraft, setStatusDraft] = useState<BookingStatus | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('limit', '50');
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());

      const response = await fetch(`/api/bookings?${params.toString()}`, {
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error('Không thể tải danh sách booking');
      }
      const data: ListResponse = await response.json();
      setBookings(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleOpenDialog = (booking: BookingListItem) => {
    setSelectedBooking(booking);
    setAdminNotesDraft(booking.adminNotes ?? '');
    setStatusDraft(booking.status);
    setDialogOpen(true);
  };

  const handleUpdateBooking = async () => {
    if (!selectedBooking) return;

    setUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: statusDraft ?? undefined,
          adminNotes: adminNotesDraft,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? 'Không thể cập nhật booking');
      }

      const updated: BookingListItem = await response.json();
      setBookings((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedBooking(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể cập nhật booking');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;

    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa booking ${selectedBooking.reference}?\n\n` +
      `Khách hàng: ${selectedBooking.customer.fullName}\n` +
      `Tour: ${selectedBooking.tour.title}\n\n` +
      `⚠️ Hành động này KHÔNG THỂ HOÀN TÁC!`
    );
    
    if (!confirmed) return;

    setUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? 'Không thể xóa booking');
      }

      const result = await response.json();
      
      // Remove from list
      setBookings((prev) => prev.filter((item) => item.id !== selectedBooking.id));
      
      // Close dialog
      setDialogOpen(false);
      setSelectedBooking(null);
      
      // Show success message
      alert(result.message || '✅ Đã xóa booking thành công!');
      
      console.log(`✅ Deleted booking: ${selectedBooking.reference}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể xóa booking';
      setError(errorMessage);
      alert('❌ ' + errorMessage);
      console.error('Failed to delete booking:', err);
    } finally {
      setUpdating(false);
    }
  };

  const statusOptions = useMemo(
    () => [
      { value: 'ALL', label: 'Tất cả trạng thái' },
      ...Object.values(BookingStatus).map((status) => ({
        value: status,
        label: statusLabels[status],
      })),
    ],
    []
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý đặt tour</h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi và quản lý các yêu cầu đặt tour từ khách hàng.
          </p>
        </div>
        <Button variant="outline" onClick={fetchBookings} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" /> Làm mới
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Tìm theo mã booking, khách hàng, tour..."
          className="lg:col-span-2"
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as 'ALL' | BookingStatus)}
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
      </div>

      {error && (
        <div className="rounded-md border border-destructive/60 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã booking</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Tour</TableHead>
              <TableHead>Khởi hành</TableHead>
              <TableHead>Khách</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            )}
            {!loading && bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Chưa có booking nào.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              bookings.map((booking) => {
                const departureDate = booking.departure.startDate
                  ? format(new Date(booking.departure.startDate), 'dd/MM/yyyy')
                  : '—'
                const guests = booking.adults + booking.children + booking.infants
                return (
                  <TableRow key={booking.id} className="cursor-pointer" onClick={() => handleOpenDialog(booking)}>
                    <TableCell className="font-semibold">{booking.reference}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{booking.customer.fullName}</div>
                      <div className="text-xs text-muted-foreground">{booking.customer.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{booking.tour.title}</div>
                      <div className="text-xs text-muted-foreground">/{booking.tour.slug}</div>
                    </TableCell>
                    <TableCell>{departureDate}</TableCell>
                    <TableCell>{guests}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {booking.totalAmount.toLocaleString('vi-VN')} {booking.currency}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[booking.status]}>
                        {statusLabels[booking.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Xem
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Chi tiết booking #{selectedBooking.reference}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 text-sm">
                <section className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-md border border-border/60 bg-background/70 p-4">
                    <h3 className="text-sm font-semibold">Thông tin khách</h3>
                    <p className="mt-2 font-medium text-foreground">
                      {selectedBooking.customer.fullName}
                    </p>
                    <p className="text-muted-foreground">{selectedBooking.customer.email}</p>
                    {selectedBooking.customer.phone && (
                      <p className="text-muted-foreground">{selectedBooking.customer.phone}</p>
                    )}
                  </div>
                  <div className="rounded-md border border-border/60 bg-background/70 p-4">
                    <h3 className="text-sm font-semibold">Thông tin tour</h3>
                    <p className="mt-2 font-medium text-foreground">{selectedBooking.tour.title}</p>
                    <p className="text-muted-foreground">Khởi hành: {selectedBooking.departure.startDate ? format(new Date(selectedBooking.departure.startDate), 'dd/MM/yyyy') : '—'}</p>
                    <p className="text-muted-foreground">Khách: {selectedBooking.adults} NL • {selectedBooking.children} TE • {selectedBooking.infants} EB</p>
                  </div>
                </section>

                {selectedBooking.specialRequests && (
                  <section className="rounded-md border border-border/60 bg-background/70 p-4">
                    <h3 className="text-sm font-semibold">Yêu cầu đặc biệt</h3>
                    <p className="mt-2 text-muted-foreground whitespace-pre-line">
                      {selectedBooking.specialRequests}
                    </p>
                  </section>
                )}

                {selectedBooking.addons.length > 0 && (
                  <section className="rounded-md border border-border/60 bg-background/70 p-4">
                    <h3 className="text-sm font-semibold">Dịch vụ bổ sung</h3>
                    <ul className="mt-2 space-y-2 text-muted-foreground">
                      {selectedBooking.addons.map((addon) => (
                        <li key={addon.id} className="flex items-center justify-between text-sm">
                          <span>{addon.name}</span>
                          <span>
                            {addon.price.toLocaleString('vi-VN')} {selectedBooking.currency}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section className="rounded-md border border-border/60 bg-background/70 p-4 space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-sm font-semibold">Trạng thái booking</h3>
                      <p className="text-xs text-muted-foreground">
                        Cập nhật trạng thái để theo dõi tiến độ xử lý.
                      </p>
                    </div>
                    <Select
                      value={statusDraft ?? selectedBooking.status}
                      onValueChange={(value) => setStatusDraft(value as BookingStatus)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(BookingStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {statusLabels[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Ghi chú nội bộ</h3>
                    <Textarea
                      value={adminNotesDraft}
                      onChange={(event) => setAdminNotesDraft(event.target.value)}
                      placeholder="Thêm ghi chú cho đội vận hành..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-between gap-2">
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteBooking} 
                      disabled={updating}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Xóa booking
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Đóng
                      </Button>
                      <Button onClick={handleUpdateBooking} disabled={updating}>
                        {updating ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </Button>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
