
import React, { useState } from 'react';
import { ConnectionState } from '../types';

interface DiscoveredDevice {
  name: string;
  ip: string;
}

interface SettingsModalProps {
  connection: ConnectionState;
  onConnect: (ip: string) => void;
  onClose: () => void;
  bridgeUrl: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ connection, onConnect, onClose, bridgeUrl }) => {
  const [ipInput, setIpInput] = useState(connection.ip);
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<DiscoveredDevice[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);
    try {
      const res = await fetch(`${bridgeUrl}/discover`, { method: 'GET' });
      if (!res.ok) throw new Error('Discovery failed. Is the bridge running?');
      const data = await res.json();
      setDiscoveredDevices(data.devices || []);
      if (data.devices?.length === 0) {
        setError("No devices found. Ensure they're on the same Wi-Fi.");
      }
    } catch (err) {
      setError("Bridge unreachable. Please ensure bridge.py is running locally.");
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const selectDevice = (ip: string) => {
    setIpInput(ip);
    onConnect(ip);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[32px] p-8 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex-shrink-0">
          <h2 className="text-2xl font-bold mb-2 tracking-tight">Technical Setup</h2>
          <p className="text-zinc-500 text-sm mb-6">Link your Editor's Remote to a physical Fire TV.</p>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-6">
          {/* Scanning Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600">Auto Discovery</label>
              {isScanning && <div className="text-[10px] text-blue-500 animate-pulse font-bold uppercase">Scanning...</div>}
            </div>
            
            <button 
              onClick={handleScan}
              disabled={isScanning}
              className="w-full py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center gap-3 transition-all active:scale-95 group"
            >
              <svg className={`w-5 h-5 text-blue-500 ${isScanning ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm font-bold">Scan Network</span>
            </button>

            {error && <p className="text-[11px] text-rose-500 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">{error}</p>}

            {discoveredDevices.length > 0 && (
              <div className="grid gap-2">
                {discoveredDevices.map((device) => (
                  <button
                    key={device.ip}
                    onClick={() => selectDevice(device.ip)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-zinc-800 hover:border-blue-500/50 transition-all text-left group"
                  >
                    <div>
                      <div className="text-sm font-bold text-zinc-200">{device.name}</div>
                      <div className="text-xs font-mono text-zinc-500">{device.ip}</div>
                    </div>
                    <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-zinc-700 bg-zinc-900 px-2">Or Manual Entry</div>
          </div>

          {/* Manual Entry Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Device IP Address</label>
              <input 
                type="text" 
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="e.g. 192.168.1.100"
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors font-mono"
              />
            </div>
            <button 
              onClick={() => onConnect(ipInput)}
              disabled={connection.isConnecting}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                connection.isConnected 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              } ${connection.isConnecting ? 'opacity-50 animate-pulse' : ''}`}
            >
              {connection.isConnecting ? 'Linking...' : connection.isConnected ? 'Connected' : 'Connect to Fire TV'}
            </button>
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-zinc-800 pt-6 mt-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-3">Bridge Instructions</h3>
          <div className="bg-black/50 p-4 rounded-xl border border-zinc-800/50 text-[11px] font-mono text-zinc-400 space-y-2 overflow-x-auto">
            <p>1. Ensure ADB Debugging is ON in Fire TV Settings.</p>
            <p>2. Run <code className="text-zinc-200">python bridge.py</code></p>
            <p>3. Discovery requires <code className="text-zinc-200">zeroconf</code> or <code className="text-zinc-200">scapy</code> on bridge.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
