import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Square, FolderOpen, Loader2,
  AlertCircle, CheckCircle2, ArrowRightLeft, GitMerge,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';

type ToolTab = 'bf16' | 'merge';

interface AnalyzeResult {
  sourceType: string;
  displayName: string;
  safetensorCount: number;
  supportCount: number;
  totalSizeMb: number;
  hasIndex?: boolean;
}

interface ToolStatus {
  status: 'idle' | 'running' | 'done' | 'error';
  error?: string;
  lastEvent?: Record<string, unknown>;
  events?: Array<Record<string, unknown>>;
  totalEvents?: number;
  elapsed?: number;
}

// ── Shared Section component (defined before usage) ──────────────────

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
    <h3 className="text-xs font-semibold text-zinc-300 mb-2">{title}</h3>
    {children}
  </div>
);

// ── Shared helpers ───────────────────────────────────────────────────

function useAuthHeaders() {
  const { token } = useAuth();
  const headersRef = useRef({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` });
  useEffect(() => {
    headersRef.current = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  }, [token]);
  return headersRef;
}

function formatEventLog(e: Record<string, unknown>): string | null {
  switch (e.event) {
    case 'tensor_progress': return null; // skip, shown in progress bar
    case 'file_start': return `Converting: ${e.file} (${e.file_idx}/${e.total_files})`;
    case 'file_done': return `Done: ${e.file} (${e.tensors} tensors)`;
    case 'status': return String(e.message);
    case 'done': return `Complete! ${e.source_size_mb ?? ''}MB → ${e.output_size_mb ?? ''}MB ${e.savings_pct ? `(${e.savings_pct}% saved)` : ''}`.trim();
    case 'analyze': return `Source: ${e.display_name} | ${e.safetensor_count ?? e.files_a ?? ''} safetensors`;
    case 'error': return `Error: ${e.message}`;
    default: return JSON.stringify(e);
  }
}

/** Shared polling hook for tool processes */
function useToolPolling(endpoint: string) {
  const headersRef = useAuthHeaders();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [status, setStatus] = useState<ToolStatus>({ status: 'idle' });
  const [log, setLog] = useState<string[]>([]);
  const logEndRef = useRef<HTMLSpanElement>(null);
  const seenEventsRef = useRef(0);

  const startPolling = useCallback(() => {
    seenEventsRef.current = 0;
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(endpoint, { headers: headersRef.current });
        if (!res.ok) return;
        const data: ToolStatus = await res.json();
        setStatus(data);

        if (data.events && data.events.length > 0) {
          const newLines = data.events
            .map(formatEventLog)
            .filter((l): l is string => l !== null);
          if (newLines.length > 0) {
            setLog(prev => [...prev, ...newLines].slice(-200));
          }
        }

        if (data.status === 'done' || data.status === 'error') {
          if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
        }
      } catch {
        // Connection lost — will retry on next interval
      }
    }, 500);
  }, [endpoint]);

  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  const reset = useCallback(() => {
    setStatus({ status: 'idle' });
    setLog([]);
    seenEventsRef.current = 0;
  }, []);

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  return { status, log, logEndRef, startPolling, stopPolling, reset, setStatus, setLog };
}

// ── Progress display component ───────────────────────────────────────

const ProgressSection: React.FC<{
  title: string;
  status: ToolStatus;
  log: string[];
  logEndRef: React.RefObject<HTMLSpanElement | null>;
  color: string;
  doneText: string;
  runningText: string;
}> = ({ title, status, log, logEndRef, color, doneText, runningText }) => {
  const isRunning = status.status === 'running';
  const isDone = status.status === 'done';
  const isError = status.status === 'error';

  const lastEvt = status.lastEvent;
  const progressText = lastEvt?.event === 'tensor_progress'
    ? `${lastEvt.file}: ${lastEvt.current}/${lastEvt.total} tensors (file ${lastEvt.file_idx}/${lastEvt.total_files})`
    : isDone && lastEvt?.event === 'done'
    ? `${lastEvt.source_size_mb ?? ''}MB → ${lastEvt.output_size_mb ?? ''}MB ${lastEvt.savings_pct ? `(${lastEvt.savings_pct}% saved)` : ''}`.trim()
    : isError ? (status.error || 'Error') : runningText;
  const progressPct = lastEvt?.event === 'tensor_progress' && lastEvt.total
    ? Math.round((Number(lastEvt.current) / Number(lastEvt.total)) * 100)
    : isDone ? 100 : 0;

  return (
    <Section title={title}>
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-zinc-400">{progressText}</span>
          <span className="text-[10px] text-zinc-500">{progressPct}%</span>
        </div>
        <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${isDone ? 'bg-green-500' : isError ? 'bg-red-500' : `bg-${color}-500`}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        {isRunning && <Loader2 size={14} className={`animate-spin text-${color}-400`} />}
        {isDone && <CheckCircle2 size={14} className="text-green-400" />}
        {isError && <AlertCircle size={14} className="text-red-400" />}
        <span className={`text-xs ${isDone ? 'text-green-400' : isError ? 'text-red-400' : 'text-zinc-300'}`}>
          {isDone ? doneText : isError ? (status.error || 'Error') : runningText}
        </span>
        {status.elapsed && (
          <span className="text-[10px] text-zinc-500 ml-auto">
            {Math.round(status.elapsed / 1000)}s
          </span>
        )}
      </div>

      {log.length > 0 && (
        <pre className="text-[10px] text-zinc-400 bg-black/20 rounded-lg p-2 max-h-32 overflow-y-auto whitespace-pre-wrap">
          {log.join('\n')}
          <span ref={logEndRef} />
        </pre>
      )}
    </Section>
  );
};

// ── BF16 Converter Tool ──────────────────────────────────────────────

const BF16Tool: React.FC = () => {
  const headersRef = useAuthHeaders();
  const { t } = useI18n();

  const [sourcePath, setSourcePath] = useState('');
  const [outputDir, setOutputDir] = useState('');
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');

  const { status, log, logEndRef, startPolling, stopPolling, reset, setStatus, setLog } =
    useToolPolling('/api/tools/bf16/status');

  const handleAnalyze = useCallback(async () => {
    if (!sourcePath.trim()) return;
    setAnalyzing(true);
    setAnalyzeError('');
    setAnalyzeResult(null);
    try {
      const res = await fetch('/api/tools/bf16/analyze', {
        method: 'POST', headers: headersRef.current, body: JSON.stringify({ sourcePath: sourcePath.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setAnalyzeResult(data);
      if (!outputDir.trim()) {
        setOutputDir(sourcePath.trim().replace(/[\\/]$/, '') + '-bf16-output');
      }
    } catch (e) {
      setAnalyzeError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  }, [sourcePath, outputDir]);

  const handleStart = useCallback(async () => {
    if (!sourcePath.trim() || !outputDir.trim()) return;
    reset();
    setStatus({ status: 'running' });
    setLog(['Conversion started...']);

    await fetch('/api/tools/bf16/reset', { method: 'POST', headers: headersRef.current }).catch(() => {});

    try {
      const res = await fetch('/api/tools/bf16/start', {
        method: 'POST', headers: headersRef.current,
        body: JSON.stringify({ sourcePath: sourcePath.trim(), outputDir: outputDir.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start');
      startPolling();
    } catch (e) {
      setStatus({ status: 'error', error: e instanceof Error ? e.message : 'Failed' });
    }
  }, [sourcePath, outputDir, startPolling, reset, setStatus, setLog]);

  const handleStop = useCallback(async () => {
    await fetch('/api/tools/bf16/stop', { method: 'POST', headers: headersRef.current }).catch(() => {});
    stopPolling();
    setStatus({ status: 'error', error: 'Cancelled' });
    setLog(prev => [...prev, 'Cancelled by user']);
  }, [stopPolling, setStatus, setLog]);

  const isRunning = status.status === 'running';

  return (
    <div className="space-y-3">
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
        <p className="text-xs text-blue-300">{t('bf16Description')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Section title={t('bf16Source')}>
          <div className="flex gap-2">
            <input
              type="text" value={sourcePath}
              onChange={e => { setSourcePath(e.target.value); setAnalyzeResult(null); }}
              placeholder="./models/acestep-v15-xl"
              className="flex-1 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-pink-500/50"
            />
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !sourcePath.trim()}
              className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs font-medium flex items-center gap-1.5 disabled:opacity-50"
            >
              {analyzing ? <Loader2 size={14} className="animate-spin" /> : <FolderOpen size={14} />}
              {t('bf16Analyze')}
            </button>
          </div>
          {analyzeError && <p className="text-xs text-red-400 mt-1.5">{analyzeError}</p>}
          {analyzeResult && (
            <div className="mt-2 text-xs text-zinc-400 space-y-0.5">
              <p>Type: <span className="text-zinc-200">{analyzeResult.sourceType === 'folder' ? 'Model folder' : 'Single file'}</span></p>
              <p>Name: <span className="text-zinc-200">{analyzeResult.displayName}</span></p>
              <p>Files: <span className="text-zinc-200">{analyzeResult.safetensorCount} safetensors</span>{analyzeResult.supportCount > 0 && <span> + {analyzeResult.supportCount} support</span>}</p>
              <p>Size: <span className="text-zinc-200">{analyzeResult.totalSizeMb} MB</span> → ~<span className="text-green-400">{Math.round(analyzeResult.totalSizeMb / 2)} MB</span></p>
            </div>
          )}
        </Section>

        <Section title={t('bf16Output')}>
          <input
            type="text" value={outputDir} onChange={e => setOutputDir(e.target.value)}
            placeholder="./models"
            className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-pink-500/50"
          />
          <p className="text-[10px] text-zinc-500 mt-1">{t('bf16OutputHint')}</p>
        </Section>
      </div>

      <div className="flex gap-2">
        {!isRunning ? (
          <button onClick={handleStart} disabled={!sourcePath.trim() || !outputDir.trim() || analyzing}
            className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
            <ArrowRightLeft size={16} />
            {t('bf16Start')}
          </button>
        ) : (
          <button onClick={handleStop}
            className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
            <Square size={16} />
            {t('bf16Stop')}
          </button>
        )}
      </div>

      {status.status !== 'idle' && (
        <ProgressSection
          title={t('bf16Progress')} status={status} log={log} logEndRef={logEndRef}
          color="blue" doneText={t('bf16Done')} runningText={t('bf16Running')}
        />
      )}
    </div>
  );
};

// ── Merge Tool ───────────────────────────────────────────────────────

const MergeTool: React.FC = () => {
  const headersRef = useAuthHeaders();
  const { t } = useI18n();

  const [modelA, setModelA] = useState('');
  const [modelB, setModelB] = useState('');
  const [outputDir, setOutputDir] = useState('');
  const [alpha, setAlpha] = useState(0.5);

  const { status, log, logEndRef, startPolling, stopPolling, reset, setStatus, setLog } =
    useToolPolling('/api/tools/merge/status');

  const handleStart = useCallback(async () => {
    if (!modelA.trim() || !modelB.trim() || !outputDir.trim()) return;
    reset();
    setStatus({ status: 'running' });
    setLog(['Merge started...']);

    await fetch('/api/tools/merge/reset', { method: 'POST', headers: headersRef.current }).catch(() => {});

    try {
      const res = await fetch('/api/tools/merge/start', {
        method: 'POST', headers: headersRef.current,
        body: JSON.stringify({ modelA: modelA.trim(), modelB: modelB.trim(), outputDir: outputDir.trim(), alpha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start');
      startPolling();
    } catch (e) {
      setStatus({ status: 'error', error: e instanceof Error ? e.message : 'Failed' });
    }
  }, [modelA, modelB, outputDir, alpha, startPolling, reset, setStatus, setLog]);

  const handleStop = useCallback(async () => {
    await fetch('/api/tools/merge/stop', { method: 'POST', headers: headersRef.current }).catch(() => {});
    stopPolling();
    setStatus({ status: 'error', error: 'Cancelled' });
    setLog(prev => [...prev, 'Cancelled by user']);
  }, [stopPolling, setStatus, setLog]);

  const isRunning = status.status === 'running';

  return (
    <div className="space-y-3">
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
        <p className="text-xs text-purple-300">{t('mergeDescription')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Section title={`${t('mergeModelA')} (base)`}>
          <input type="text" value={modelA} onChange={e => setModelA(e.target.value)}
            placeholder="./models/acestep-v15-xl"
            className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-pink-500/50" />
        </Section>
        <Section title={`${t('mergeModelB')} (merge)`}>
          <input type="text" value={modelB} onChange={e => setModelB(e.target.value)}
            placeholder="./models/acestep-sft-turbo-xl"
            className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-pink-500/50" />
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Section title={t('mergeOutput')}>
          <input type="text" value={outputDir} onChange={e => setOutputDir(e.target.value)}
            placeholder="./models/merged-output"
            className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-pink-500/50" />
        </Section>
        <Section title={`${t('mergeAlpha')} (${alpha.toFixed(2)})`}>
          <input type="range" min={0} max={1} step={0.05} value={alpha}
            onChange={e => setAlpha(parseFloat(e.target.value))}
            className="w-full accent-purple-500 h-1.5" />
          <div className="flex justify-between text-[10px] text-zinc-500 mt-0.5">
            <span>0 = {t('mergeModelA')}</span>
            <span>1 = {t('mergeModelB')}</span>
          </div>
        </Section>
      </div>

      <div className="flex gap-2">
        {!isRunning ? (
          <button onClick={handleStart} disabled={!modelA.trim() || !modelB.trim() || !outputDir.trim()}
            className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
            <GitMerge size={16} />
            {t('mergeStart')}
          </button>
        ) : (
          <button onClick={handleStop}
            className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
            <Square size={16} />
            {t('mergeStop')}
          </button>
        )}
      </div>

      {status.status !== 'idle' && (
        <ProgressSection
          title={t('mergeProgress')} status={status} log={log} logEndRef={logEndRef}
          color="purple" doneText={t('bf16Done')} runningText={t('bf16Running')}
        />
      )}
    </div>
  );
};

// ── Main ToolsPanel ──────────────────────────────────────────────────

export const ToolsPanel: React.FC = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<ToolTab>('bf16');

  const tabs: { id: ToolTab; label: string; icon: React.ReactNode }[] = [
    { id: 'bf16', label: t('bf16Title'), icon: <ArrowRightLeft size={14} /> },
    { id: 'merge', label: t('mergeTitle'), icon: <GitMerge size={14} /> },
  ];

  return (
    <div className="h-full w-full flex flex-col bg-zinc-50 dark:bg-suno-panel overflow-hidden">
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t('tools')}</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{t('toolsDescription')}</p>
      </div>

      <div className="flex px-4 gap-1 flex-shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === tab.id ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-hide max-w-6xl mx-auto w-full">
        {activeTab === 'bf16' && <BF16Tool />}
        {activeTab === 'merge' && <MergeTool />}
      </div>
    </div>
  );
};
