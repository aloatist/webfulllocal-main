'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  isFeatured: boolean;
  featuredOrder?: number | null;
  isActive: boolean;
}

interface FeaturedServicesEditorProps {
  services: Service[];
  onChange: (services: Service[]) => void;
}

export function FeaturedServicesEditor({ services, onChange }: FeaturedServicesEditorProps) {
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllServices();
  }, []);

  async function loadAllServices() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/services');
      if (response.ok) {
        const data = await response.json();
        setAllServices(data.services || []);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFeatured(serviceId: string, isFeatured: boolean) {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isFeatured,
          featuredOrder: isFeatured ? Date.now() : null,
        }),
      });

      if (response.ok) {
        await loadAllServices();
        // Update local state
        const updated = allServices.map(s =>
          s.id === serviceId ? { ...s, isFeatured, featuredOrder: isFeatured ? Date.now() : null } : s
        );
        setAllServices(updated);
        
        // Update featured list
        const featured = updated.filter(s => s.isFeatured).sort((a, b) => {
          const orderA = a.featuredOrder || 0;
          const orderB = b.featuredOrder || 0;
          return orderA - orderB;
        });
        onChange(featured);
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  }

  async function updateOrder(serviceId: string, direction: 'up' | 'down') {
    const featured = services.filter(s => s.isFeatured).sort((a, b) => {
      const orderA = a.featuredOrder || 0;
      const orderB = b.featuredOrder || 0;
      return orderA - orderB;
    });
    
    const index = featured.findIndex(s => s.id === serviceId);
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
      const temp = featured[index];
      featured[index] = featured[index - 1];
      featured[index - 1] = temp;
    } else if (direction === 'down' && index < featured.length - 1) {
      const temp = featured[index];
      featured[index] = featured[index + 1];
      featured[index + 1] = temp;
    }

    // Update orders
    const updated = featured.map((s, i) => ({
      ...s,
      featuredOrder: i * 1000, // Use increments of 1000 for easy reordering
    }));

    // Save to database
    try {
      await Promise.all(
        updated.map(s =>
          fetch(`/api/admin/services/${s.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              featuredOrder: s.featuredOrder,
            }),
          })
        )
      );
      
      onChange(updated);
      await loadAllServices();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  }

  const featuredServices = allServices
    .filter(s => s.isFeatured)
    .sort((a, b) => {
      const orderA = a.featuredOrder || 0;
      const orderB = b.featuredOrder || 0;
      return orderA - orderB;
    });

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Featured Services
        </CardTitle>
        <CardDescription>
          Chọn và sắp xếp các dịch vụ nổi bật hiển thị trên trang chủ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Featured Services List */}
        {featuredServices.length > 0 && (
          <div className="space-y-2">
            <Label>Dịch vụ đã chọn ({featuredServices.length})</Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thứ tự</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {featuredServices.map((service, index) => (
                  <TableRow key={service.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {service.description || '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateOrder(service.id, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateOrder(service.id, 'down')}
                          disabled={index === featuredServices.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFeatured(service.id, false)}
                        >
                          Bỏ chọn
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* All Services */}
        <div className="space-y-2">
          <Label>Tất cả dịch vụ</Label>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allServices
                  .filter(s => s.isActive)
                  .map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <Checkbox
                          checked={service.isFeatured}
                          onCheckedChange={(checked) =>
                            toggleFeatured(service.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {service.description || '—'}
                      </TableCell>
                      <TableCell>
                        {service.isFeatured && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            Đã chọn
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {allServices.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Chưa có dịch vụ nào. Vui lòng tạo dịch vụ trước.</p>
            <Button variant="link" onClick={() => window.location.href = '/admin/services'}>
              Tạo dịch vụ mới →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

