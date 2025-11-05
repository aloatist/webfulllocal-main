'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Palette, 
  CheckCircle2, 
  Eye, 
  Upload,
  Trash2,
  Download,
  Settings,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Theme {
  id: string;
  name: string;
  version: string;
  author?: string;
  description?: string;
  preview?: string;
  path: string;
  active: boolean;
  canDelete: boolean;
  parent?: string;
}

export default function ThemesManagementPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('themes');

  useEffect(() => {
    loadThemes();
  }, []);

  async function loadThemes() {
    try {
      setLoading(true);
      const response = await fetch('/api/themes');
      const data = await response.json();
      
      if (data.success) {
        setThemes(data.themes || []);
      } else {
        setError('Failed to load themes');
      }
    } catch (error) {
      console.error('Error loading themes:', error);
      setError('Failed to load themes');
    } finally {
      setLoading(false);
    }
  }

  async function handleActivate(themeId: string) {
    try {
      setError(null);
      const response = await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: themeId }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Theme "${themeId}" activated successfully`);
        await loadThemes();
        // Reload page to apply new theme
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setError(data.error || 'Failed to activate theme');
      }
    } catch (error) {
      console.error('Error activating theme:', error);
      setError('Failed to activate theme');
    }
  }

  async function handleDelete(themeId: string) {
    if (!confirm(`Are you sure you want to delete theme "${themeId}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/themes?theme=${themeId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Theme "${themeId}" deleted successfully`);
        await loadThemes();
      } else {
        setError(data.error || 'Failed to delete theme');
      }
    } catch (error) {
      console.error('Error deleting theme:', error);
      setError('Failed to delete theme');
    }
  }

  async function handlePreview(themeId: string) {
    setPreviewTheme(themeId);
    // Open preview in new window
    window.open(`/?preview_theme=${themeId}`, '_blank');
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      setError('Please upload a .zip file');
      return;
    }

    try {
      setError(null);
      const formData = new FormData();
      formData.append('theme', file);

      const response = await fetch('/api/themes/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Theme "${data.themeName}" uploaded successfully`);
        setUploadDialogOpen(false);
        await loadThemes();
      } else {
        setError(data.error || 'Failed to upload theme');
      }
    } catch (error) {
      console.error('Error uploading theme:', error);
      setError('Failed to upload theme');
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Theme Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your website themes - Upload, activate, preview, and customize
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadThemes} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Theme
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Theme</DialogTitle>
                  <DialogDescription>
                    Upload a theme .zip file. The zip should contain theme.json and pages/ directory.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme-file">Theme ZIP File</Label>
                    <Input
                      id="theme-file"
                      type="file"
                      accept=".zip"
                      onChange={handleUpload}
                    />
                  </div>
                  <Alert>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      Make sure your theme.zip contains:
                      <ul className="list-disc list-inside mt-2">
                        <li>theme.json (required)</li>
                        <li>pages/ directory (required)</li>
                        <li>layout/ directory (optional)</li>
                        <li>components/ directory (optional)</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="customizer">Customizer</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="themes">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : themes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Palette className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No themes found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upload your first theme to get started
                </p>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Theme
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme) => (
                <Card 
                  key={theme.id} 
                  className={`relative ${theme.active ? 'ring-2 ring-emerald-500' : ''}`}
                >
                  {theme.active && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-emerald-500">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  )}
                  
                  {theme.parent && (
                    <div className="absolute top-4 left-4 z-10">
                      <Badge variant="outline" className="bg-blue-50">
                        Child of {theme.parent}
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
                        <Palette className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{theme.name}</CardTitle>
                        <CardDescription>v{theme.version}</CardDescription>
                      </div>
                    </div>
                    {theme.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {theme.description}
                      </p>
                    )}
                    {theme.author && (
                      <p className="text-xs text-gray-500 mt-2">
                        by {theme.author}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant={theme.active ? 'default' : 'outline'}
                        onClick={() => handleActivate(theme.id)}
                        disabled={theme.active}
                        className="flex-1"
                      >
                        {theme.active ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Active
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreview(theme.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {theme.canDelete && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(theme.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="customizer">
          <ThemeCustomizer activeTheme={themes.find(t => t.active)} />
        </TabsContent>

        <TabsContent value="settings">
          <ThemeSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ThemeCustomizer({ activeTheme }: { activeTheme?: Theme }) {
  if (!activeTheme) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Please activate a theme first to customize it</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customize: {activeTheme.name}</CardTitle>
          <CardDescription>
            Adjust theme options and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeCustomizerForm themeId={activeTheme.id} />
        </CardContent>
      </Card>
    </div>
  );
}

function ThemeCustomizerForm({ themeId }: { themeId: string }) {
  const [options, setOptions] = useState({
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: '#ffffff',
      text: '#1f2937',
    },
    typography: {
      fontFamily: 'Inter',
      headingFont: 'Inter',
      fontSize: '16px',
    },
    layout: {
      containerWidth: '1280px',
      spacing: 'normal',
    },
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadOptions();
  }, [themeId]);

  async function loadOptions() {
    try {
      const response = await fetch(`/api/themes/customizer?theme=${themeId}`);
      const data = await response.json();
      if (data.success && data.options) {
        setOptions({ ...options, ...data.options });
      }
    } catch (error) {
      console.error('Error loading customizer options:', error);
    }
  }

  async function handleSave() {
    try {
      setLoading(true);
      const response = await fetch('/api/themes/customizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ options, theme: themeId }),
      });

      const data = await response.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving customizer options:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Colors Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Colors</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(options.colors).map(([key, value]) => (
            <div key={key}>
              <Label className="capitalize">{key}</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  type="color"
                  value={value}
                  onChange={(e) => setOptions({
                    ...options,
                    colors: { ...options.colors, [key]: e.target.value }
                  })}
                  className="w-20 h-10"
                />
                <Input
                  value={value}
                  onChange={(e) => setOptions({
                    ...options,
                    colors: { ...options.colors, [key]: e.target.value }
                  })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Typography</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Font Family</Label>
            <Input
              value={options.typography.fontFamily}
              onChange={(e) => setOptions({
                ...options,
                typography: { ...options.typography, fontFamily: e.target.value }
              })}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Heading Font</Label>
            <Input
              value={options.typography.headingFont}
              onChange={(e) => setOptions({
                ...options,
                typography: { ...options.typography, headingFont: e.target.value }
              })}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Font Size</Label>
            <Input
              value={options.typography.fontSize}
              onChange={(e) => setOptions({
                ...options,
                typography: { ...options.typography, fontSize: e.target.value }
              })}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Layout Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Layout</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Container Width</Label>
            <Input
              value={options.layout.containerWidth}
              onChange={(e) => setOptions({
                ...options,
                layout: { ...options.layout, containerWidth: e.target.value }
              })}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Spacing</Label>
            <select
              value={options.layout.spacing}
              onChange={(e) => setOptions({
                ...options,
                layout: { ...options.layout, spacing: e.target.value }
              })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-2"
            >
              <option value="compact">Compact</option>
              <option value="normal">Normal</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Settings className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function ThemeSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
        <CardDescription>Global theme configuration</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Theme settings coming soon...</p>
      </CardContent>
    </Card>
  );
}

