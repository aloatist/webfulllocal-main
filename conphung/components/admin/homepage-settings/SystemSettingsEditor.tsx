'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SettingField } from '@/components/admin/settings/setting-field';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Settings } from 'lucide-react';
import { defaultSettings, categoryLabels, SettingCategory } from '@/lib/settings/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SystemSettingsEditorProps {
  onSave?: () => void;
}

export function SystemSettingsEditor({ onSave }: SystemSettingsEditorProps) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Load settings from API
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data.settings || {});
        } else {
          // Fallback to defaults
          const initialSettings: Record<string, string> = {};
          defaultSettings.forEach(setting => {
            initialSettings[setting.key] = setting.value;
          });
          setSettings(initialSettings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        // Fallback to defaults
        const initialSettings: Record<string, string> = {};
        defaultSettings.forEach(setting => {
          initialSettings[setting.key] = setting.value;
        });
        setSettings(initialSettings);
      } finally {
        setIsLoading(false);
      }
    };
    void loadSettings();
  }, []);

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
        onSave?.();
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Không thể kết nối. Vui lòng thử lại sau.');
    } finally {
      setIsSaving(false);
    }
  };

  const getSettingsByCategory = (category: SettingCategory) => {
    return defaultSettings.filter(s => s.category === category);
  };

  if (isLoading) {
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
          <Settings className="w-5 h-5" />
          System Settings
        </CardTitle>
        <CardDescription>
          Cấu hình hệ thống website - Chung, Liên hệ, Mạng xã hội, Đặt phòng, Chat
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Messages */}
        {status === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">✅ Đã lưu thành công!</p>
          </div>
        )}

        {status === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* Settings Tabs - SEO removed (merged into main SEO tab) */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            <TabsTrigger value="general">Chung</TabsTrigger>
            <TabsTrigger value="contact">Liên hệ</TabsTrigger>
            <TabsTrigger value="social">Mạng XH</TabsTrigger>
            <TabsTrigger value="booking">Đặt phòng</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          {/* General */}
          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="rounded-lg border bg-blue-50 dark:bg-blue-950/20 p-4 mb-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Lưu ý:</strong> SEO settings đã được merge vào tab &ldquo;SEO&rdquo; chính. Vui lòng cấu hình SEO tại đó.
              </p>
            </div>
            <div className="space-y-4">
              {getSettingsByCategory('general').map(setting => (
                <SettingField
                  key={setting.key}
                  id={setting.key}
                  label={setting.label}
                  description={setting.description}
                  type={setting.type}
                  value={settings[setting.key] || ''}
                  onChange={(value) => handleSettingChange(setting.key, value)}
                  placeholder={setting.placeholder}
                  required={setting.required}
                  disabled={isSaving}
                />
              ))}
            </div>
          </TabsContent>

          {/* Contact */}
          <TabsContent value="contact" className="space-y-4 mt-4">
            <div className="space-y-4">
              {getSettingsByCategory('contact').map(setting => (
                <SettingField
                  key={setting.key}
                  id={setting.key}
                  label={setting.label}
                  description={setting.description}
                  type={setting.type}
                  value={settings[setting.key] || ''}
                  onChange={(value) => handleSettingChange(setting.key, value)}
                  placeholder={setting.placeholder}
                  required={setting.required}
                  disabled={isSaving}
                />
              ))}
            </div>
          </TabsContent>

          {/* Social */}
          <TabsContent value="social" className="space-y-4 mt-4">
            <div className="space-y-4">
              {getSettingsByCategory('social').map(setting => (
                <SettingField
                  key={setting.key}
                  id={setting.key}
                  label={setting.label}
                  description={setting.description}
                  type={setting.type}
                  value={settings[setting.key] || ''}
                  onChange={(value) => handleSettingChange(setting.key, value)}
                  placeholder={setting.placeholder}
                  required={setting.required}
                  disabled={isSaving}
                />
              ))}
            </div>
          </TabsContent>

          {/* Booking */}
          <TabsContent value="booking" className="space-y-4 mt-4">
            <div className="space-y-4">
              {getSettingsByCategory('booking').map(setting => (
                <SettingField
                  key={setting.key}
                  id={setting.key}
                  label={setting.label}
                  description={setting.description}
                  type={setting.type}
                  value={settings[setting.key] || ''}
                  onChange={(value) => handleSettingChange(setting.key, value)}
                  placeholder={setting.placeholder}
                  required={setting.required}
                  disabled={isSaving}
                />
              ))}
            </div>
          </TabsContent>

          {/* Chat */}
          <TabsContent value="chat" className="space-y-4 mt-4">
            <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/20 p-4 mb-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                💡 <strong>Lưu ý:</strong> Cấu hình Chat widget (Tawk.to, Facebook Messenger) để khách hàng liên hệ trực tiếp trên website.
              </p>
            </div>
            <div className="space-y-4">
              {getSettingsByCategory('chat').map(setting => (
                <SettingField
                  key={setting.key}
                  id={setting.key}
                  label={setting.label}
                  description={setting.description}
                  type={setting.type}
                  value={settings[setting.key] || ''}
                  onChange={(value) => handleSettingChange(setting.key, value)}
                  placeholder={setting.placeholder}
                  required={setting.required}
                  disabled={isSaving}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Lưu System Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

