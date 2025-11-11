'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Loader2, 
  Building2, 
  CreditCard,
  Wallet,
  Banknote,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  bankName?: string | null;
  accountNumber?: string | null;
  accountHolder?: string | null;
  branch?: string | null;
  qrCode?: string | null;
  isActive: boolean;
  displayOrder: number;
  description?: string | null;
  instructions?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const PAYMENT_TYPES = [
  { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: Building2 },
  { value: 'cash', label: 'Tiền mặt', icon: Banknote },
  { value: 'e_wallet', label: 'Ví điện tử', icon: Wallet },
  { value: 'credit_card', label: 'Thẻ tín dụng', icon: CreditCard },
];

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'bank_transfer',
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    branch: '',
    qrCode: '',
    isActive: true,
    displayOrder: 0,
    description: '',
    instructions: '',
  });

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/payment-methods');
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods || []);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
      setStatus('error');
      setErrorMessage('Không thể tải danh sách phương thức thanh toán');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (method?: PaymentMethod) => {
    if (method) {
      setSelectedMethod(method);
      setFormData({
        name: method.name,
        type: method.type,
        bankName: method.bankName || '',
        accountNumber: method.accountNumber || '',
        accountHolder: method.accountHolder || '',
        branch: method.branch || '',
        qrCode: method.qrCode || '',
        isActive: method.isActive,
        displayOrder: method.displayOrder,
        description: method.description || '',
        instructions: method.instructions || '',
      });
    } else {
      setSelectedMethod(null);
      setFormData({
        name: '',
        type: 'bank_transfer',
        bankName: '',
        accountNumber: '',
        accountHolder: '',
        branch: '',
        qrCode: '',
        isActive: true,
        displayOrder: paymentMethods.length,
        description: '',
        instructions: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMethod(null);
    setFormData({
      name: '',
      type: 'bank_transfer',
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      branch: '',
      qrCode: '',
      isActive: true,
      displayOrder: 0,
      description: '',
      instructions: '',
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setStatus('idle');
      setErrorMessage('');

      const url = selectedMethod
        ? `/api/admin/payment-methods/${selectedMethod.id}`
        : '/api/admin/payment-methods';
      
      const method = selectedMethod ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        handleCloseDialog();
        await loadPaymentMethods();
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Có lỗi xảy ra khi lưu');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Không thể kết nối. Vui lòng thử lại sau.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/payment-methods/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadPaymentMethods();
        setIsDeleteDialogOpen(false);
        setDeleteTargetId(null);
      } else {
        setStatus('error');
        setErrorMessage('Không thể xóa phương thức thanh toán');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Không thể kết nối. Vui lòng thử lại sau.');
    }
  };

  const handleMoveOrder = async (id: string, direction: 'up' | 'down') => {
    const method = paymentMethods.find(m => m.id === id);
    if (!method) return;

    const currentIndex = paymentMethods.findIndex(m => m.id === id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= paymentMethods.length) return;

    const newOrder = paymentMethods[newIndex].displayOrder;
    const oldOrder = method.displayOrder;

    try {
      await fetch(`/api/admin/payment-methods/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ displayOrder: newOrder }),
      });

      await fetch(`/api/admin/payment-methods/${paymentMethods[newIndex].id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ displayOrder: oldOrder }),
      });

      await loadPaymentMethods();
    } catch (error) {
      console.error('Error moving order:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = PAYMENT_TYPES.find(t => t.value === type);
    return typeConfig?.icon || Building2;
  };

  const getTypeLabel = (type: string) => {
    const typeConfig = PAYMENT_TYPES.find(t => t.value === type);
    return typeConfig?.label || type;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Phương thức thanh toán</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Quản lý các phương thức thanh toán và tài khoản ngân hàng
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Thêm phương thức
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedMethod ? 'Chỉnh sửa phương thức thanh toán' : 'Thêm phương thức thanh toán'}
              </DialogTitle>
              <DialogDescription>
                {selectedMethod 
                  ? 'Cập nhật thông tin phương thức thanh toán'
                  : 'Thêm phương thức thanh toán mới vào hệ thống'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Tên phương thức *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Chuyển khoản BIDV"
                />
              </div>

              <div>
                <Label htmlFor="type">Loại thanh toán *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.type === 'bank_transfer' && (
                <>
                  <div>
                    <Label htmlFor="bankName">Tên ngân hàng</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      placeholder="Ví dụ: BIDV"
                    />
                  </div>

                  <div>
                    <Label htmlFor="accountNumber">Số tài khoản</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder="Ví dụ: 7210783403"
                    />
                  </div>

                  <div>
                    <Label htmlFor="accountHolder">Chủ tài khoản</Label>
                    <Input
                      id="accountHolder"
                      value={formData.accountHolder}
                      onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                      placeholder="Ví dụ: CÔNG TY TNHH DU LỊCH DỊCH VỤ THƯƠNG MẠI CỒN PHỤNG"
                    />
                  </div>

                  <div>
                    <Label htmlFor="branch">Chi nhánh</Label>
                    <Input
                      id="branch"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      placeholder="Ví dụ: BIDV chi nhánh Bến Tre"
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="displayOrder">Thứ tự hiển thị</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn về phương thức thanh toán"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="instructions">Hướng dẫn thanh toán</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Hướng dẫn chi tiết cách thanh toán"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Kích hoạt</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Lưu
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Đã lưu thành công!
          </AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage || 'Có lỗi xảy ra'}
          </AlertDescription>
        </Alert>
      )}

      {/* Payment Methods List */}
      <div className="grid gap-4">
        {paymentMethods.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Chưa có phương thức thanh toán nào
              </p>
              <Button onClick={() => handleOpenDialog()} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Thêm phương thức đầu tiên
              </Button>
            </CardContent>
          </Card>
        ) : (
          paymentMethods.map((method, index) => {
            const TypeIcon = getTypeIcon(method.type);
            return (
              <Card key={method.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <TypeIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {method.name}
                          {!method.isActive && (
                            <Badge variant="secondary">Tạm ẩn</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          <Badge variant="outline" className="mt-1">
                            {getTypeLabel(method.type)}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveOrder(method.id, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveOrder(method.id, 'down')}
                        disabled={index === paymentMethods.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(method)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeleteTargetId(method.id);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {method.type === 'bank_transfer' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {method.bankName && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ngân hàng</p>
                          <p className="text-sm">{method.bankName}</p>
                        </div>
                      )}
                      {method.accountNumber && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Số tài khoản</p>
                          <p className="text-sm font-mono">{method.accountNumber}</p>
                        </div>
                      )}
                      {method.accountHolder && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Chủ tài khoản</p>
                          <p className="text-sm">{method.accountHolder}</p>
                        </div>
                      )}
                      {method.branch && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Chi nhánh</p>
                          <p className="text-sm">{method.branch}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {method.description && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                    </div>
                  )}
                  {method.instructions && (
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Hướng dẫn:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                        {method.instructions}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa phương thức thanh toán này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTargetId(null)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTargetId && handleDelete(deleteTargetId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

