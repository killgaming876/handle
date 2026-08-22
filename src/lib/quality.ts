export type QualityTier = 'ultra' | 'high' | 'medium' | 'low' | 'fallback';

export type QualityConfig = {
  particles: number;
  blur: number;
  postprocessing: 'full' | 'light' | 'bloom' | 'none';
  webgl: 'full' | 'simplified' | 'flat' | 'css';
};

export const QUALITY_CONFIG: Record<QualityTier, QualityConfig> = {
  ultra: { particles: 220, blur: 1, postprocessing: 'full', webgl: 'full' },
  high: { particles: 150, blur: 1, postprocessing: 'light', webgl: 'full' },
  medium: { particles: 85, blur: 0.65, postprocessing: 'bloom', webgl: 'simplified' },
  low: { particles: 36, blur: 0, postprocessing: 'none', webgl: 'flat' },
  fallback: { particles: 0, blur: 0, postprocessing: 'none', webgl: 'css' },
};

export function getManualQuality(): QualityTier | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem('handle-quality');
  return value === 'ultra' || value === 'high' || value === 'medium' || value === 'low' || value === 'fallback' ? value : null;
}

export function setManualQuality(tier: QualityTier | null) {
  if (typeof window === 'undefined') return;
  if (tier) window.localStorage.setItem('handle-quality', tier);
  else window.localStorage.removeItem('handle-quality');
}

export async function detectQuality(reducedMotion: boolean): Promise<QualityTier> {
  if (reducedMotion) return 'low';
  const manual = getManualQuality();
  if (manual) return manual;

  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 4;
  const cores = nav.hardwareConcurrency ?? 4;
  const dpr = Math.min(3, window.devicePixelRatio || 1);

  let renderer = '';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const ext = gl?.getExtension('WEBGL_debug_renderer_info');
    renderer = String(ext && gl ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '').toLowerCase();
  } catch {
    renderer = '';
  }

  const lowGpu = /intel\s+hd|uhd|mali-4|adreno\s+[3-5]|powervr|swiftshader|llvmpipe/.test(renderer);
  const gpuScore = lowGpu ? -2 : renderer ? 1 : 0;
  const hardwareScore = (cores >= 12 ? 2 : cores >= 8 ? 1 : 0) + (memory >= 16 ? 2 : memory >= 8 ? 1 : 0) - (dpr >= 2.75 ? 1 : 0) + gpuScore;

  const probe = document.createElement('canvas');
  probe.width = 96;
  probe.height = 96;
  const ctx = probe.getContext('2d');
  const start = performance.now();
  for (let i = 0; i < 10; i += 1) {
    ctx?.clearRect(0, 0, 96, 96);
    for (let j = 0; j < 180; j += 1) {
      ctx?.fillRect((j * 13 + i * 3) % 96, (j * 17 + i * 7) % 96, 2, 2);
    }
  }
  const probeMs = performance.now() - start;

  const score = hardwareScore + (probeMs < 8 ? 2 : probeMs < 16 ? 1 : probeMs > 34 ? -2 : 0);
  if (score >= 5) return 'ultra';
  if (score >= 2) return 'high';
  if (score >= -1) return 'medium';
  if (score >= -3) return 'low';
  return 'fallback';
}
