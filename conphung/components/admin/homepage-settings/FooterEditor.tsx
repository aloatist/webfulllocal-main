'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Collapsible } from '@/components/ui/collapsible';
import { StyleEditor } from './StyleEditor';
import { ImageUpload } from './ImageUpload';
import { TeamMemberImageUpload } from './TeamMemberImageUpload';
import { HoverColorPicker } from './HoverColorPicker';
import { 
  Plus, 
  Trash2, 
  Palette, 
  Link2, 
  Users, 
  Building2, 
  Mail, 
  Phone,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Send,
  FileText,
  UserPlus,
} from 'lucide-react';
import type { FooterSection, FooterLinkGroup, SocialLink, ContactInfoItem, TeamMember } from '@/lib/homepage/schema';
import { teamMembers as defaultTeamMembers } from '@/components/teamMembers';

interface FooterEditorProps {
  data?: FooterSection | null;
  onChange: (data: FooterSection) => void;
}

const SOCIAL_ICON_OPTIONS = [
  { value: 'Facebook', icon: Facebook, label: 'Facebook' },
  { value: 'Instagram', icon: Instagram, label: 'Instagram' },
  { value: 'Youtube', icon: Youtube, label: 'Youtube' },
  { value: 'MessageCircle', icon: MessageCircle, label: 'Zalo' },
];

const CONTACT_ICON_OPTIONS = [
  { value: 'Phone', icon: Phone, label: 'Phone' },
  { value: 'Mail', icon: Mail, label: 'Email' },
  { value: 'MapPin', icon: MapPin, label: 'Address' },
  { value: 'Clock', icon: Clock, label: 'Hours' },
];

export function FooterEditor({ data, onChange }: FooterEditorProps) {
  const footer = data || {
    contactHeading: 'LIÊN HỆ',
    contactDescription: 'Đội ngũ chuyên nghiệp, tận tâm phục vụ quý khách',
    showTeamMembers: true,
    companyDescription: 'Khám phá vẻ đẹp thiên nhiên và văn hóa độc đáo của miền Tây tại Khu Du Lịch Cồn Phụng - Công trình kiến trúc Đạo Dừa nổi tiếng.',
    socialLinks: [
      { icon: 'Facebook', href: 'https://www.facebook.com/dulichconphungbentre', label: 'Facebook', color: 'hover:bg-blue-600' },
      { icon: 'Instagram', href: 'https://www.instagram.com/dulichconphungbentre', label: 'Instagram', color: 'hover:bg-pink-600' },
      { icon: 'Youtube', href: 'https://www.youtube.com/@ConPhungTouristBenTre', label: 'Youtube', color: 'hover:bg-red-600' },
      { icon: 'MessageCircle', href: 'https://zalo.me/0918267715', label: 'Zalo', color: 'hover:bg-blue-500' },
    ],
    linkGroups: [
      {
        title: 'Công ty',
        links: [
          { label: 'Giới thiệu', href: '/gioi-thieu' },
          { label: 'Liên hệ', href: '/lien-he' },
          { label: 'Tuyển dụng', href: '/tuyen-dung' },
          { label: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat' },
        ],
      },
      {
        title: 'Dịch vụ',
        links: [
          { label: 'Tour du lịch', href: '/tours' },
          { label: 'Homestay', href: '/homestays' },
          { label: 'Nhà hàng', href: '/nha-hang' },
          { label: 'Sự kiện', href: '/su-kien' },
        ],
      },
    ],
    contactInfo: [
      { icon: 'Phone', label: 'Hotline', value: '0918 267 715', href: 'tel:+84918267715' },
      { icon: 'Mail', label: 'Email', value: 'conphungtourist87@gmail.com', href: 'mailto:conphungtourist87@gmail.com' },
      { icon: 'MapPin', label: 'Địa chỉ', value: 'Tờ bản đồ số 3, thửa đất số 32, ấp 10 (ấp Tân Vinh), xã Phú Túc, tỉnh Vĩnh Long', href: 'https://maps.google.com/?q=10.3367211,106.3687357' },
      { icon: 'Clock', label: 'Giờ làm việc', value: 'Thứ 2 - CN: 7:00 - 18:00' },
    ],
    newsletterTitle: 'Đăng ký nhận tin',
    newsletterEnabled: true,
    companyName: 'CÔNG TY TNHH DU LỊCH DỊCH VỤ THƯƠNG MẠI CỒN PHỤNG',
    taxCode: '1300390306',
    businessLicense: 'GIẤY PHÉP KINH DOANH DỊCH VỤ LỮ HÀNH QUỐC TẾ - Số GP/No. : 83-005/2019 /TCDL-GP LHQT',
    foodSafetyCert: 'GIẤY CHỨNG NHẬN CƠ SỞ ĐỦ ĐIỀU KIỆN AN TOÀN THỰC PHẨM SỐ: 71/2021./ATTP-CNĐK',
    bankAccount: 'Số tài khoản: 7210783403 - BIDV chi nhánh Bến Tre',
    address: 'Tờ bản đồ số 3, thửa đất số 32, ấp 10 (ấp Tân Vinh), xã Phú Túc, tỉnh Vĩnh Long',
    copyrightText: `© ${new Date().getFullYear()} Khu Du Lịch Cồn Phụng. Bảo lưu mọi quyền.`,
    isActive: true,
  };

  const updateField = (field: keyof FooterSection, value: any) => {
    onChange({ ...footer, [field]: value } as FooterSection);
  };

  // Link Groups
  const addLinkGroup = () => {
    updateField('linkGroups', [
      ...(footer.linkGroups || []),
      { title: 'Nhóm mới', links: [] },
    ]);
  };

  const updateLinkGroup = (index: number, updates: Partial<FooterLinkGroup>) => {
    const groups = [...(footer.linkGroups || [])];
    groups[index] = { ...groups[index], ...updates };
    updateField('linkGroups', groups);
  };

  const deleteLinkGroup = (index: number) => {
    const groups = (footer.linkGroups || []).filter((_, i) => i !== index);
    updateField('linkGroups', groups);
  };

  const addLinkToGroup = (groupIndex: number) => {
    const groups = [...(footer.linkGroups || [])];
    groups[groupIndex].links.push({ label: 'Link mới', href: '#' });
    updateField('linkGroups', groups);
  };

  const updateLinkInGroup = (groupIndex: number, linkIndex: number, updates: Partial<{ label: string; href: string }>) => {
    const groups = [...(footer.linkGroups || [])];
    groups[groupIndex].links[linkIndex] = { ...groups[groupIndex].links[linkIndex], ...updates };
    updateField('linkGroups', groups);
  };

  const deleteLinkFromGroup = (groupIndex: number, linkIndex: number) => {
    const groups = [...(footer.linkGroups || [])];
    groups[groupIndex].links = groups[groupIndex].links.filter((_, i) => i !== linkIndex);
    updateField('linkGroups', groups);
  };

  // Social Links
  const addSocialLink = () => {
    updateField('socialLinks', [
      ...(footer.socialLinks || []),
      { icon: 'Facebook', href: '', label: 'Facebook', color: 'hover:bg-blue-600' },
    ]);
  };

  const updateSocialLink = (index: number, updates: Partial<SocialLink>) => {
    const links = [...(footer.socialLinks || [])];
    links[index] = { ...links[index], ...updates };
    updateField('socialLinks', links);
  };

  const deleteSocialLink = (index: number) => {
    const links = (footer.socialLinks || []).filter((_, i) => i !== index);
    updateField('socialLinks', links);
  };

  // Contact Info
  const addContactInfo = () => {
    updateField('contactInfo', [
      ...(footer.contactInfo || []),
      { icon: 'Phone', label: 'Label', value: 'Value', href: '' },
    ]);
  };

  const updateContactInfo = (index: number, updates: Partial<ContactInfoItem>) => {
    const items = [...(footer.contactInfo || [])];
    items[index] = { ...items[index], ...updates };
    updateField('contactInfo', items);
  };

  const deleteContactInfo = (index: number) => {
    const items = (footer.contactInfo || []).filter((_, i) => i !== index);
    updateField('contactInfo', items);
  };

  // Team Members
  const addTeamMember = () => {
    updateField('teamMembers', [
      ...(footer.teamMembers || []),
      { name: 'Tên thành viên', title: 'Chức danh', imgSrc: '', phone: 'tel:', numberphone: '' },
    ]);
  };

  const updateTeamMember = (index: number, updates: Partial<TeamMember>) => {
    const members = [...(footer.teamMembers || [])];
    members[index] = { ...members[index], ...updates };
    updateField('teamMembers', members);
  };

  const deleteTeamMember = (index: number) => {
    const members = (footer.teamMembers || []).filter((_, i) => i !== index);
    updateField('teamMembers', members);
  };

  // Load default team members if not set
  const displayTeamMembers = footer.teamMembers && footer.teamMembers.length > 0 
    ? footer.teamMembers 
    : defaultTeamMembers;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Footer Section
        </CardTitle>
        <CardDescription>
          Quản lý footer của trang chủ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="space-y-0.5">
            <Label className="text-base">Hiển thị Footer</Label>
            <p className="text-sm text-muted-foreground">
              Bật/tắt hiển thị footer trên trang chủ
            </p>
          </div>
          <Switch
            checked={footer.isActive}
            onCheckedChange={(checked) => updateField('isActive', checked)}
          />
        </div>

        {/* Contact Section */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Phần Liên Hệ (Team Members)
          </h3>

          <div className="space-y-2">
            <Label>Contact Heading</Label>
            <Input
              value={footer.contactHeading || ''}
              onChange={(e) => updateField('contactHeading', e.target.value)}
              placeholder="LIÊN HỆ"
            />
          </div>

          {/* Contact Heading Styling */}
          <Collapsible
            title="Contact Heading Styling"
            description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho Contact Heading"
            icon={<Palette className="w-4 h-4" />}
            defaultOpen={false}
          >
            <div className="pt-2">
              <StyleEditor
                style={footer.styles?.contactHeading}
                onChange={(style) => {
                  onChange({ ...footer, styles: { ...footer.styles, contactHeading: style } } as FooterSection);
                }}
                title="Contact Heading Styling"
              />
            </div>
          </Collapsible>

          <div className="space-y-2">
            <Label>Contact Description</Label>
            <Textarea
              value={footer.contactDescription || ''}
              onChange={(e) => updateField('contactDescription', e.target.value)}
              placeholder="Đội ngũ chuyên nghiệp, tận tâm phục vụ quý khách"
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div className="space-y-0.5">
              <Label className="text-base">Hiển thị Team Members</Label>
              <p className="text-sm text-muted-foreground">
                Bật/tắt hiển thị phần team members trong footer
              </p>
            </div>
            <Switch
              checked={footer.showTeamMembers}
              onCheckedChange={(checked) => updateField('showTeamMembers', checked)}
            />
          </div>

          {/* Team Members List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Danh sách Team Members</Label>
              <Button
                type="button"
                size="sm"
                onClick={addTeamMember}
                className="flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Thêm thành viên
              </Button>
            </div>

            {displayTeamMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Chưa có thành viên nào. Nhấn "Thêm thành viên" để thêm mới.
              </p>
            ) : (
              <div className="space-y-4">
                {displayTeamMembers.map((member, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Thành viên {index + 1}</h4>
                        {footer.teamMembers && footer.teamMembers.length > 0 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteTeamMember(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tên</Label>
                          <Input
                            value={member.name}
                            onChange={(e) => {
                              if (footer.teamMembers && footer.teamMembers.length > 0) {
                                updateTeamMember(index, { name: e.target.value });
                              }
                            }}
                            placeholder="PHAN VĂN THÔNG"
                            disabled={!footer.teamMembers || footer.teamMembers.length === 0}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Chức danh</Label>
                          <Input
                            value={member.title}
                            onChange={(e) => {
                              if (footer.teamMembers && footer.teamMembers.length > 0) {
                                updateTeamMember(index, { title: e.target.value });
                              }
                            }}
                            placeholder="Tổng Giám đốc"
                            disabled={!footer.teamMembers || footer.teamMembers.length === 0}
                          />
                        </div>

                        <div className="space-y-2 col-span-2">
                          <Label>Ảnh đại diện</Label>
                          <TeamMemberImageUpload
                            value={member.imgSrc}
                            onChange={(url) => {
                              if (footer.teamMembers && footer.teamMembers.length > 0) {
                                updateTeamMember(index, { imgSrc: url });
                              }
                            }}
                            disabled={!footer.teamMembers || footer.teamMembers.length === 0}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Số điện thoại (Link)</Label>
                          <Input
                            value={member.phone || ''}
                            onChange={(e) => {
                              if (footer.teamMembers && footer.teamMembers.length > 0) {
                                updateTeamMember(index, { phone: e.target.value });
                              }
                            }}
                            placeholder="tel:+84918267715"
                            disabled={!footer.teamMembers || footer.teamMembers.length === 0}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Số điện thoại (Số)</Label>
                          <Input
                            value={member.numberphone || ''}
                            onChange={(e) => {
                              if (footer.teamMembers && footer.teamMembers.length > 0) {
                                updateTeamMember(index, { numberphone: e.target.value });
                              }
                            }}
                            placeholder="+84918267715"
                            disabled={!footer.teamMembers || footer.teamMembers.length === 0}
                          />
                        </div>

                        <div className="space-y-2 col-span-2">
                          <Label>Email (Optional)</Label>
                          <Input
                            value={member.email || ''}
                            onChange={(e) => {
                              if (footer.teamMembers && footer.teamMembers.length > 0) {
                                updateTeamMember(index, { email: e.target.value });
                              }
                            }}
                            placeholder="mailto:conphungthong@gmail.com"
                            type="email"
                            disabled={!footer.teamMembers || footer.teamMembers.length === 0}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Company Info */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Thông tin Công ty
          </h3>

          <div className="space-y-2">
            <Label>Logo URL</Label>
            <ImageUpload
              currentImage={footer.logoUrl || null}
              currentImageId={null}
              field="footerLogo"
              onUpload={(url) => updateField('logoUrl', url)}
              onRemove={() => updateField('logoUrl', undefined)}
            />
          </div>

          <div className="space-y-2">
            <Label>Company Description</Label>
            <Textarea
              value={footer.companyDescription || ''}
              onChange={(e) => updateField('companyDescription', e.target.value)}
              placeholder="Mô tả công ty..."
              rows={3}
            />
          </div>

          {/* Company Description Styling */}
          <Collapsible
            title="Company Description Styling"
            description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho Company Description"
            icon={<Palette className="w-4 h-4" />}
            defaultOpen={false}
          >
            <div className="pt-2">
              <StyleEditor
                style={footer.styles?.companyDescription}
                onChange={(style) => {
                  onChange({ ...footer, styles: { ...footer.styles, companyDescription: style } } as FooterSection);
                }}
                title="Company Description Styling"
              />
            </div>
          </Collapsible>

          {/* Social Links */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Social Links</Label>
              <Button onClick={addSocialLink} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Thêm Social Link
              </Button>
            </div>

            <div className="space-y-2">
              {(footer.socialLinks || []).map((social, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Social Link #{index + 1}</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSocialLink(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <select
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={social.icon}
                          onChange={(e) => updateSocialLink(index, { icon: e.target.value })}
                        >
                          {SOCIAL_ICON_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label>Label</Label>
                        <Input
                          value={social.label}
                          onChange={(e) => updateSocialLink(index, { label: e.target.value })}
                          placeholder="Facebook"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>URL</Label>
                        <Input
                          value={social.href}
                          onChange={(e) => updateSocialLink(index, { href: e.target.value })}
                          placeholder="https://facebook.com/conphung"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <HoverColorPicker
                          value={social.color || ''}
                          onChange={(color) => updateSocialLink(index, { color })}
                          label="Hover Color Class"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Link Groups */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Link Groups
            </h3>
            <Button onClick={addLinkGroup} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Thêm Link Group
            </Button>
          </div>

          <div className="space-y-4">
            {(footer.linkGroups || []).map((group, groupIndex) => (
              <Card key={groupIndex} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Link Group #{groupIndex + 1}</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteLinkGroup(groupIndex)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={group.title}
                      onChange={(e) => updateLinkGroup(groupIndex, { title: e.target.value })}
                      placeholder="Công ty"
                    />
                  </div>

                  {/* Link Group Title Styling */}
                  <Collapsible
                    title="Link Group Title Styling"
                    description="Tùy chỉnh cỡ chữ, màu sắc, và hiệu ứng cho Link Group Title"
                    icon={<Palette className="w-4 h-4" />}
                    defaultOpen={false}
                  >
                    <div className="pt-2">
                      <StyleEditor
                        style={footer.styles?.linkGroupTitle}
                        onChange={(style) => {
                          onChange({ ...footer, styles: { ...footer.styles, linkGroupTitle: style } } as FooterSection);
                        }}
                        title="Link Group Title Styling"
                      />
                    </div>
                  </Collapsible>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Links ({group.links.length})</Label>
                      <Button
                        onClick={() => addLinkToGroup(groupIndex)}
                        size="sm"
                        variant="outline"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm Link
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {group.links.map((link, linkIndex) => (
                        <div key={linkIndex} className="flex gap-2 items-center">
                          <Input
                            value={link.label}
                            onChange={(e) => updateLinkInGroup(groupIndex, linkIndex, { label: e.target.value })}
                            placeholder="Label"
                            className="flex-1"
                          />
                          <Input
                            value={link.href}
                            onChange={(e) => updateLinkInGroup(groupIndex, linkIndex, { href: e.target.value })}
                            placeholder="/link"
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteLinkFromGroup(groupIndex, linkIndex)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Info
            </h3>
            <Button onClick={addContactInfo} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Thêm Contact Info
            </Button>
          </div>

          <div className="space-y-2">
            {(footer.contactInfo || []).map((item, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Contact Info #{index + 1}</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteContactInfo(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={item.icon}
                        onChange={(e) => updateContactInfo(index, { icon: e.target.value })}
                      >
                        {CONTACT_ICON_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input
                        value={item.label}
                        onChange={(e) => updateContactInfo(index, { label: e.target.value })}
                        placeholder="Hotline"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input
                        value={item.value}
                        onChange={(e) => updateContactInfo(index, { value: e.target.value })}
                        placeholder="0918 267 715"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Link (Optional)</Label>
                      <Input
                        value={item.href || ''}
                        onChange={(e) => updateContactInfo(index, { href: e.target.value })}
                        placeholder="tel:+84918267715"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Newsletter
          </h3>

          <div className="flex items-center justify-between">
            <Label>Enable Newsletter</Label>
            <Switch
              checked={footer.newsletterEnabled}
              onCheckedChange={(checked) => updateField('newsletterEnabled', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Newsletter Title</Label>
            <Input
              value={footer.newsletterTitle || ''}
              onChange={(e) => updateField('newsletterTitle', e.target.value)}
              placeholder="Đăng ký nhận tin"
            />
          </div>
        </div>

        {/* Legal Info */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold">Thông tin Pháp lý</h3>

          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input
              value={footer.companyName || ''}
              onChange={(e) => updateField('companyName', e.target.value)}
              placeholder="CÔNG TY TNHH..."
            />
          </div>

          <div className="space-y-2">
            <Label>Tax Code</Label>
            <Input
              value={footer.taxCode || ''}
              onChange={(e) => updateField('taxCode', e.target.value)}
              placeholder="1300390306"
            />
          </div>

          <div className="space-y-2">
            <Label>Business License</Label>
            <Textarea
              value={footer.businessLicense || ''}
              onChange={(e) => updateField('businessLicense', e.target.value)}
              placeholder="GIẤY PHÉP..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Food Safety Certificate</Label>
            <Textarea
              value={footer.foodSafetyCert || ''}
              onChange={(e) => updateField('foodSafetyCert', e.target.value)}
              placeholder="GIẤY CHỨNG NHẬN..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Bank Account</Label>
            <Input
              value={footer.bankAccount || ''}
              onChange={(e) => updateField('bankAccount', e.target.value)}
              placeholder="Số tài khoản..."
            />
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea
              value={footer.address || ''}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Địa chỉ..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Copyright Text</Label>
            <Input
              value={footer.copyrightText || ''}
              onChange={(e) => updateField('copyrightText', e.target.value)}
              placeholder="© 2025 Khu Du Lịch Cồn Phụng..."
            />
          </div>
        </div>

        {/* Container Styling */}
        <Collapsible
          title="Container Styling"
          description="Tùy chỉnh styling cho toàn bộ footer container"
          icon={<Palette className="w-4 h-4" />}
          defaultOpen={false}
          className="border-t pt-4"
        >
          <div className="pt-2">
            <StyleEditor
              style={footer.styles?.container}
              onChange={(style) => {
                onChange({ ...footer, styles: { ...footer.styles, container: style } } as FooterSection);
              }}
              title="Container Styling"
            />
          </div>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
