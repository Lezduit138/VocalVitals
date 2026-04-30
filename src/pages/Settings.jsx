import { useState } from 'react';
import { Settings2, Key, Download, Trash2, Bell, Globe, MonitorSmartphone, Wifi, Moon, VolumeX, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('offline');

  const tabs = [
    { id: 'offline', name: 'Offline & Sync', icon: Wifi },
    { id: 'profiles', name: 'Child Profiles', icon: Settings2 },
    { id: 'preferences', name: 'Preferences', icon: Globe },
    { id: 'account', name: 'Account & Security', icon: ShieldCheck },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col md:flex-row gap-8">
      
      {/* Sidebar */}
      <div className="md:w-64 flex-shrink-0">
        <h1 className="text-3xl font-display text-white mb-6">Settings</h1>
        <div className="space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-left ${
                activeTab === tab.id 
                  ? 'bg-primary/10 text-primary border border-primary/20 font-medium' 
                  : 'text-text hover:bg-surface-elevated border border-transparent'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        
        {activeTab === 'offline' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MonitorSmartphone className="w-5 h-5 text-primary" />
                  <span>PWA & Offline Mode</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start justify-between p-4 bg-surface-elevated rounded-xl border border-white/5">
                  <div className="flex-1 pr-6">
                    <h4 className="text-white font-medium mb-1">Install VocalVitals</h4>
                    <p className="text-sm text-text-muted">Install this app on your device for fast access and guaranteed offline availability.</p>
                  </div>
                  <Button variant="primary">Install App</Button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Local Cache Management</h4>
                  <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl">
                    <div>
                      <div className="text-white text-sm font-medium">Cached AI Models</div>
                      <div className="text-xs text-text-muted">v2.4.1 (142 MB)</div>
                    </div>
                    <Button variant="secondary" size="sm"><Download className="w-4 h-4 mr-2" /> Download Update</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl">
                    <div>
                      <div className="text-white text-sm font-medium">Saved Profiles & Audio</div>
                      <div className="text-xs text-text-muted">3 Profiles, 12 Scans (45 MB)</div>
                    </div>
                    <Button variant="danger" size="sm"><Trash2 className="w-4 h-4 mr-2" /> Clear Local Data</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-white">Sync Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-white text-sm font-medium">Sync over Wi-Fi only</div>
                    <div className="text-xs text-text-muted">Save mobile data by restricting heavy model updates.</div>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-surface-elevated peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                </label>
              </CardContent>
            </Card>
          </>
        )}

        {/* Placeholders for other tabs */}
        {activeTab !== 'offline' && (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-white/10 rounded-2xl">
            <Settings2 className="w-12 h-12 text-text-muted mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-white mb-2">Options Coming Soon</h3>
            <p className="text-text-muted max-w-sm">This section is currently under development for the production release.</p>
          </div>
        )}

      </div>
    </div>
  );
}
