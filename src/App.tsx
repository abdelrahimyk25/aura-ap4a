import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Server, 
  Cpu, 
  FileText, 
  Play, 
  Plus, 
  RotateCcw, 
  Code, 
  Activity, 
  Clock, 
  CheckCircle2, 
  Database,
  Terminal,
  Layers
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Sensor {
  id: number;
  type: string;
  period: number;
  counter: number;
  luminosity: number;
}

interface LogFile {
  filename: string;
  content: string;
}

interface SourceFile {
  path: string;
  content: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs' | 'sensors' | 'code'>('dashboard');
  const [serverStatus, setServerStatus] = useState<any>({ server: { name: 'Server', port: 8080 }, sensorCount: 1 });
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [logFiles, setLogFiles] = useState<LogFile[]>([]);
  const [sourceFiles, setSourceFiles] = useState<SourceFile[]>([]);
  const [simulationSteps, setSimulationSteps] = useState<number>(5);
  const [chartData, setChartData] = useState<{ time: string; luminosity: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newSensorPeriod, setNewSensorPeriod] = useState<number>(3);

  const fetchData = async () => {
    try {
      const [statusRes, sensorsRes, logsRes, codeRes] = await Promise.all([
        fetch('/api/status').then(r => r.json()),
        fetch('/api/sensors').then(r => r.json()),
        fetch('/api/logs').then(r => r.json()),
        fetch('/api/source-code').then(r => r.json())
      ]);

      setServerStatus(statusRes);
      setSensors(sensorsRes);
      setConsoleLogs(logsRes.consoleLogs || []);
      setLogFiles(logFilesRes => logsRes.logFiles || logFilesRes);
      setSourceFiles(codeRes);

      // Initialize chart from logs if empty
      if (chartData.length === 0 && logsRes.consoleLogs) {
        const initialChart = logsRes.consoleLogs.map((log: string, idx: number) => {
          const parts = log.split(' : ');
          const val = parts[3] ? parseFloat(parts[3]) : 0;
          return { time: `Step ${idx + 1} (${parts[1] || '12:00'})`, luminosity: val };
        });
        setChartData(initialChart);
      }
    } catch (e) {
      console.error("Failed to fetch backend data", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/simulation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalSteps: simulationSteps })
      });
      const data = await res.json();
      if (data.success) {
        setSensors(data.sensors);
        setConsoleLogs(data.consoleLogs);
        
        // Refresh log files
        const logsRes = await fetch('/api/logs').then(r => r.json());
        setLogFiles(logsRes.logFiles || []);

        // Update chart
        const newChartPoints = (logsRes.consoleLogs || []).map((log: string, idx: number) => {
          const parts = log.split(' : ');
          const val = parts[3] ? parseFloat(parts[3]) : 0;
          return { time: `#${idx + 1} ${parts[1] || ''}`, luminosity: val };
        });
        setChartData(newChartPoints);
      }
    } catch (e) {
      console.error("Simulation failed", e);
    } finally {
      setLoading(false);
    }
  };

  const addSensor = async () => {
    try {
      const res = await fetch('/api/sensors/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period: Number(newSensorPeriod) })
      });
      const data = await res.json();
      if (data.success) {
        setSensors(data.sensors);
      }
    } catch (e) {
      console.error("Failed to add sensor", e);
    }
  };

  const clearLogs = async () => {
    try {
      await fetch('/api/logs/clear', { method: 'POST' });
      setConsoleLogs([]);
      setLogFiles([]);
      setChartData([]);
    } catch (e) {
      console.error("Failed to clear logs", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30 text-amber-400">
            <Sun className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Aura AP4A <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Luxmeter & Sensor Hub</span>
            </h1>
            <p className="text-xs text-slate-400">C++ Aura AP4A Architecture Web Migration (Scheduler, Sensor, Server)</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-semibold' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button 
            onClick={() => setActiveTab('logs')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'logs' 
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-semibold' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Server Logs</span>
          </button>

          <button 
            onClick={() => setActiveTab('sensors')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'sensors' 
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-semibold' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Sensors & Scheduler</span>
          </button>

          <button 
            onClick={() => setActiveTab('code')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'code' 
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-semibold' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>C++ Source Code</span>
          </button>
        </nav>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Server Status</span>
                  <Server className="w-5 h-5 text-blue-400" />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{serverStatus.server?.name || "Server"}</div>
                    <div className="text-xs text-blue-400 font-mono mt-0.5">Port: {serverStatus.server?.port || 8080}</div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-ping"></span>
                    Online
                  </span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Sensors</span>
                  <Cpu className="w-5 h-5 text-amber-400" />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{sensors.length} units</div>
                    <div className="text-xs text-amber-400 font-mono mt-0.5">Type: LUXMETER</div>
                  </div>
                  <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                    Sched: Active
                  </span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Latest Luminosity</span>
                  <Sun className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {sensors.length > 0 ? sensors[sensors.length - 1].luminosity.toFixed(1) : '0.0'} <span className="text-sm font-normal text-slate-400">Lux</span>
                    </div>
                    <div className="text-xs text-yellow-400 font-mono mt-0.5">Range: 0 - 1000 Lux</div>
                  </div>
                  <span className="text-xs font-medium text-yellow-400 bg-yellow-500/10 px-2.5 py-1 rounded-lg border border-yellow-500/20">
                    Live Telemetry
                  </span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Simulation Logs</span>
                  <Database className="w-5 h-5 text-purple-400" />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{consoleLogs.length} events</div>
                    <div className="text-xs text-purple-400 font-mono mt-0.5">Stored in ../data/log_*.txt</div>
                  </div>
                  <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                    Disk Synced
                  </span>
                </div>
              </div>
            </div>

            {/* Simulation Controller & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Scheduler Control Panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-amber-500/10 p-2 rounded-lg text-amber-400 border border-amber-500/20">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Scheduler Simulation</h2>
                      <p className="text-xs text-slate-400">Triggers `ordonanceur.simulation(steps)`</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    The C++ Scheduler notifies each registered sensor at every time step. When the sensor's internal counter meets its period threshold, it executes a random reading (`rand() % 1000`) and logs the result to the server console and files.
                  </p>

                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Total Steps: <span className="text-amber-400 font-bold text-sm">{simulationSteps}</span>
                      </label>
                      <input 
                        type="range" 
                        min="1" 
                        max="20" 
                        value={simulationSteps}
                        onChange={(e) => setSimulationSteps(Number(e.target.value))}
                        className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <button 
                    onClick={runSimulation}
                    disabled={loading}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    <Play className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    <span>{loading ? 'Running Simulation...' : 'Run Scheduler Simulation'}</span>
                  </button>

                  <button 
                    onClick={clearLogs}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all text-sm border border-slate-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Clear Logs & Reset</span>
                  </button>
                </div>
              </div>

              {/* Luminosity Chart */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-yellow-500/10 p-2 rounded-lg text-yellow-400 border border-yellow-500/20">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Luminosity Telemetry (Lux)</h2>
                      <p className="text-xs text-slate-400">Real-time sensor output stream</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-slate-800 px-3 py-1 rounded-full text-amber-400 border border-slate-700">
                    LUXMETER #1
                  </span>
                </div>

                <div className="flex-1 w-full min-h-[260px] mt-2">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                        <XAxis dataKey="time" stroke="#64748b" textAnchor="end" fontSize={11} />
                        <YAxis stroke="#64748b" fontSize={11} domain={[0, 1000]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                          itemStyle={{ color: '#fbbf24' }}
                        />
                        <Line type="monotone" dataKey="luminosity" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} activeDot={{ r: 7 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500">
                      <Sun className="w-12 h-12 mb-2 opacity-30" />
                      <p>No simulation data yet. Run simulation to populate telemetry.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Console Output */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[520px]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400 border border-blue-500/20">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Server Console Output</h2>
                      <p className="text-xs text-slate-400">`Server::consoleWrite()` stream</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded border border-blue-500/20">
                    std::cout
                  </span>
                </div>

                <div className="flex-1 bg-slate-950 rounded-xl p-4 font-mono text-xs overflow-y-auto space-y-2 border border-slate-800/80 shadow-inner">
                  {consoleLogs.length > 0 ? (
                    consoleLogs.map((log, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-slate-300 border-b border-slate-900/50 pb-1.5">
                        <span className="text-slate-600 select-none">[{idx + 1}]</span>
                        <span className="text-emerald-400">{log}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-600 italic text-center py-20">Console output is empty. Run simulation.</div>
                  )}
                </div>
              </div>

              {/* File Write Logs */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[520px]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400 border border-purple-500/20">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Log Files (`../data/`)</h2>
                      <p className="text-xs text-slate-400">`Server::fileWrite()` persistence</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded border border-purple-500/20">
                    std::ofstream
                  </span>
                </div>

                <div className="flex-1 bg-slate-950 rounded-xl p-4 font-mono text-xs overflow-y-auto space-y-4 border border-slate-800/80 shadow-inner">
                  {logFiles.length > 0 ? (
                    logFiles.map((file, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="text-amber-400 font-semibold border-b border-slate-800 pb-1 flex items-center justify-between">
                          <span>File: {file.filename}</span>
                          <span className="text-[10px] text-slate-500">mode: std::ios::app</span>
                        </div>
                        <pre className="text-slate-300 whitespace-pre-wrap bg-slate-900/80 p-3 rounded-lg border border-slate-800/50">
                          {file.content || '(empty)'}
                        </pre>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-600 italic text-center py-20">No log files recorded yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SENSORS & SCHEDULER TAB */}
        {activeTab === 'sensors' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add Sensor Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-500/10 p-2 rounded-lg text-amber-400 border border-amber-500/20">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Add Luxmeter Sensor</h2>
                    <p className="text-xs text-slate-400">Instantiate new `Luxmeter` object</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Sensor Period (_period)
                    </label>
                    <input 
                      type="number" 
                      min="1" 
                      max="10" 
                      value={newSensorPeriod}
                      onChange={(e) => setNewSensorPeriod(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-all font-mono text-sm"
                    />
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      Interval required between 2 measurements (e.g., triggers every N time steps).
                    </p>
                  </div>

                  <button 
                    onClick={addSensor}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Sensor to Scheduler</span>
                  </button>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-400">
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>C++ Inheritance Model</span>
                  </div>
                  <p>
                    `Luxmeter` inherits from abstract base class `Sensor`. The `Scheduler` maintains a `std::vector&lt;Sensor*&gt;` and animates all registered sensors.
                  </p>
                </div>
              </div>

              {/* Sensor List Table */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400 border border-blue-500/20">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Registered Sensors List</h2>
                      <p className="text-xs text-slate-400">Managed by `Scheduler`</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                    Total: {sensors.length}
                  </span>
                </div>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Period</th>
                        <th className="py-3 px-4">Counter</th>
                        <th className="py-3 px-4">Luminosity</th>
                        <th className="py-3 px-4">Server Binding</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-sm font-mono">
                      {sensors.map((sensor, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4 text-white font-bold">#{sensor.id}</td>
                          <td className="py-3 px-4 text-amber-400">{sensor.type}</td>
                          <td className="py-3 px-4 text-slate-300">{sensor.period} steps</td>
                          <td className="py-3 px-4 text-slate-400">{sensor.counter}</td>
                          <td className="py-3 px-4 text-yellow-400 font-bold">{sensor.luminosity.toFixed(2)} Lux</td>
                          <td className="py-3 px-4 text-emerald-400 text-xs">Connected (&amp;serv)</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* C++ SOURCE CODE TAB */}
        {activeTab === 'code' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-500/10 p-2 rounded-lg text-amber-400 border border-amber-500/20">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Original C++ Source Code Repository</h2>
                    <p className="text-xs text-slate-400">Imported from <code className="text-amber-400">abdelrahimyk25/aura-ap4a</code></p>
                  </div>
                </div>
                <span className="text-xs font-mono bg-slate-800 px-3 py-1 rounded-full text-slate-300 border border-slate-700">
                  C++ / OOP Architecture
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {sourceFiles.map((file, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
                    <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between font-mono text-xs text-slate-300">
                      <span className="font-semibold text-amber-400">{file.path}</span>
                      <span className="text-slate-500">{file.content.split('\n').length} lines</span>
                    </div>
                    <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-96 leading-relaxed">
                      {file.content}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
