'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/attendance/status-badge';
import { CheckinResponse, postCheckin } from '@/lib/attendance/api';
import { cn } from '@/lib/utils';
import { Camera, CameraOff, Loader2 } from 'lucide-react';

interface ScanOutcome extends CheckinResponse {
  code: string;
}

type ReaderControls = { stop: () => void } | null;

export default function AttendanceScanPage() {
  const [scannerId, setScannerId] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [latest, setLatest] = useState<ScanOutcome | null>(null);
  const [history, setHistory] = useState<ScanOutcome[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [supportsCamera, setSupportsCamera] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const deviceInfoRef = useRef<string | undefined>(undefined);
  const controlsRef = useRef<ReaderControls>(null);
  const lastScanRef = useRef<{ code: string; at: number } | null>(null);

  const handleVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    setVideoReady(Boolean(node));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedScannerId = window.localStorage.getItem('attendance.scannerId');
    if (storedScannerId) {
      setScannerId(storedScannerId);
    }

    deviceInfoRef.current = window.navigator.userAgent;
    const cameraSupported = Boolean(window.navigator.mediaDevices?.getUserMedia);
    setSupportsCamera(cameraSupported);
    setIsCameraActive(cameraSupported);
  }, []);

  const updateScannerId = useCallback((value: string) => {
    setScannerId(value);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('attendance.scannerId', value);
    }
  }, []);

  const runCheckin = useCallback(
    async (code: string) => {
      const normalized = code.trim();
      if (!normalized) {
        return;
      }

      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        const response = await postCheckin({
          code: normalized,
          scannerId: scannerId.trim() ? scannerId.trim() : undefined,
          deviceInfo: deviceInfoRef.current,
        });

        const outcome: ScanOutcome = { ...response, code: normalized };
        setLatest(outcome);
        setHistory((prev) => [outcome, ...prev].slice(0, 6));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Không thể kết nối đến máy chủ';
        setErrorMessage(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [scannerId],
  );

  const handleScan = useCallback(
    (rawCode: string | null | undefined) => {
      const normalized = rawCode?.trim();
      if (!normalized) {
        return;
      }

      const now = Date.now();
      const last = lastScanRef.current;
      if (last && last.code === normalized && now - last.at < 1500) {
        return;
      }

      lastScanRef.current = { code: normalized, at: now };
      void runCheckin(normalized);
    },
    [runCheckin],
  );

  useEffect(() => {
    if (!isCameraActive || !videoReady) {
      return;
    }

    let isMounted = true;

    async function startScanner() {
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/browser');
        if (!videoRef.current) {
          return;
        }

        const reader = new BrowserMultiFormatReader();
        // Library exposes this property at runtime but the types are missing.
        Reflect.set(reader as unknown as Record<string, unknown>, 'timeBetweenDecodingAttempts', 200);

        const controls = await reader.decodeFromConstraints(
          {
            audio: false,
            video: {
              facingMode: 'environment',
            },
          },
          videoRef.current,
          (result) => {
            if (!isMounted || !result) {
              return;
            }

            const text = result.getText();
            if (text) {
              handleScan(text);
            }
          },
        );

        controlsRef.current = controls;
        setCameraError(null);
        setIsCameraReady(true);
      } catch (error) {
        console.error('Failed to initialise camera scanner', error);
        setCameraError('Không thể truy cập camera. Vui lòng kiểm tra quyền hoặc chọn thiết bị khác.');
        setIsCameraReady(false);
        setIsCameraActive(false);
      }
    }

    void startScanner();

    return () => {
      isMounted = false;
      controlsRef.current?.stop();
      controlsRef.current = null;
      setIsCameraReady(false);
    };
  }, [handleScan, isCameraActive, videoReady]);

  useEffect(() => {
    if (!isCameraActive) {
      controlsRef.current?.stop();
      controlsRef.current = null;
      setIsCameraReady(false);
    }
  }, [isCameraActive]);

  const handleManualSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const normalized = manualCode.trim();
      if (!normalized) {
        setErrorMessage('Vui lòng nhập mã trước khi điểm danh.');
        return;
      }

      lastScanRef.current = { code: normalized, at: Date.now() };
      await runCheckin(normalized);
      setManualCode('');
    },
    [manualCode, runCheckin],
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Attendance</p>
        <h1 className="text-3xl font-semibold sm:text-4xl">Điểm danh bằng QR/Barcode</h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Mở camera, quét mã trên vé hoặc nhập thủ công nếu thiết bị không hỗ trợ. Kết quả sẽ hiển thị ngay lập tức cùng trạng thái của người tham gia.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border/80 bg-background/60 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Quét bằng camera</h2>
              <p className="text-sm text-muted-foreground">Thiết lập thiết bị quét và trạng thái camera.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={!supportsCamera}
              onClick={() => setIsCameraActive((prev) => !prev)}
            >
              {isCameraActive ? (
                <>
                  <CameraOff className="mr-2 h-4 w-4" />
                  Tắt camera
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Bật camera
                </>
              )}
            </Button>
          </div>

          {!supportsCamera && (
            <p className="rounded-md border border-dashed border-amber-300 bg-amber-100/60 px-3 py-2 text-sm text-amber-700">
              Thiết bị này không hỗ trợ truy cập camera. Vui lòng sử dụng máy quét USB hoặc nhập mã thủ công ở khung bên cạnh.
            </p>
          )}

          <div
            className={cn(
              'relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-black/80',
              !isCameraActive && 'opacity-40 grayscale',
            )}
          >
            <video
              ref={handleVideoRef}
              className="h-full w-full object-cover"
              muted
              playsInline
            />
            {isCameraActive && !isCameraReady && !cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-sm text-white">
                <Loader2 className="mb-2 h-6 w-6 animate-spin" />
                Đang khởi động camera...
              </div>
            )}
            {(!isCameraActive || cameraError) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 px-4 text-center text-sm text-white">
                <p>{cameraError ?? 'Camera đang tắt.'}</p>
                <p className="mt-2 text-xs text-white/70">Bạn vẫn có thể quét bằng máy quét USB hoặc nhập mã thủ công.</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="scannerId">
              Mã thiết bị quét
            </label>
            <input
              id="scannerId"
              value={scannerId}
              onChange={(event) => updateScannerId(event.target.value)}
              placeholder="Ví dụ: gate-01 hoặc thiết bị quét"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            />
            <p className="text-xs text-muted-foreground">Trường này sẽ được lưu trên thiết bị để đối chiếu lịch sử quét.</p>
          </div>
        </div>

        <form
          onSubmit={handleManualSubmit}
          className="flex flex-col justify-between gap-6 rounded-xl border border-border/80 bg-background/60 p-6 shadow-sm backdrop-blur"
        >
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-medium">Nhập mã thủ công</h2>
              <p className="text-sm text-muted-foreground">Dành cho trường hợp thiết bị không quét được hoặc sử dụng đầu đọc mã vạch USB.</p>
            </div>

            <input
              value={manualCode}
              onChange={(event) => setManualCode(event.target.value)}
              placeholder="Nhập mã QR/Barcode"
              className="w-full rounded-md border border-border bg-background px-3 py-3 text-base font-medium uppercase tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              maxLength={64}
              disabled={isSubmitting}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Điểm danh nhanh
            </Button>

            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
          </div>

          {latest && (
            <div className="rounded-lg border border-border/70 bg-muted/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Mã vừa quét</p>
                  <p className="text-lg font-semibold uppercase tracking-wide">{latest.code}</p>
                </div>
                <StatusBadge status={latest.status} />
              </div>
              {latest.participant && (
                <div className="mt-3 text-sm">
                  <p className="font-medium">{latest.participant.fullName}</p>
                  <p className="text-muted-foreground">Trạng thái hiện tại: {latest.participant.status}</p>
                </div>
              )}
              {latest.message && <p className="mt-3 text-sm text-muted-foreground">{latest.message}</p>}
              <p className="mt-3 text-xs text-muted-foreground">
                Thời gian quét: {new Date(latest.scannedAt).toLocaleString('vi-VN')}
              </p>
            </div>
          )}
        </form>
      </section>

      {history.length > 0 && (
        <section className="space-y-3 rounded-xl border border-border/80 bg-background/60 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Lịch sử gần đây</h2>
            <span className="text-xs uppercase text-muted-foreground">Tối đa 6 lượt quét mới nhất</span>
          </div>
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={`${item.code}-${item.scannedAt}-${index}`}
                className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/80 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col">
                  <span className="text-xs uppercase text-muted-foreground">{new Date(item.scannedAt).toLocaleTimeString('vi-VN')}</span>
                  <span className="font-semibold uppercase tracking-wide">{item.code}</span>
                  {item.participant?.fullName && (
                    <span className="text-muted-foreground">{item.participant.fullName}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={item.status} />
                  {item.message && <span className="text-xs text-muted-foreground">{item.message}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
