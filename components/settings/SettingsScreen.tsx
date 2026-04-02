'use client'
import { useState } from 'react';
import { useClerk } from '@clerk/nextjs'
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { useSettings } from '@/hooks/useSettings';
import { X, Plus, LogOut } from 'lucide-react';

export function SettingsScreen() {
  const { settings, update } = useSettings();
  const { signOut } = useClerk();
  const [newJunk, setNewJunk] = useState('');

  if (!settings) return null;

  const addJunkItem = () => {
    const trimmed = newJunk.trim();
    if (trimmed && !settings.customJunkItems.includes(trimmed)) {
      update({ customJunkItems: [...settings.customJunkItems, trimmed] });
      setNewJunk('');
    }
  };

  const removeJunkItem = (item: string) => {
    update({ customJunkItems: settings.customJunkItems.filter(i => i !== item) });
  };

  const row = (label: string, control: React.ReactNode) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid var(--border-color)', marginBottom: 14 }}>
      <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 600 }}>{label}</span>
      {control}
    </div>
  );

  return (
    <div>
      <PageHeader title="Settings" subtitle="Customize cheyyam!" />
      <div style={{ padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Profile */}
        <Card>
          <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800, color: 'var(--text-secondary)' }}>PROFILE</h4>
          {row('Name', (
            <input
              value={settings.name}
              onChange={e => update({ name: e.target.value })}
              style={{ background: 'var(--border-color)', border: 'none', borderRadius: 8, padding: '6px 10px', fontSize: 14, color: 'var(--text-primary)', width: 140, textAlign: 'right' }}
            />
          ))}
        </Card>

        {/* Hydration */}
        <Card>
          <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800, color: 'var(--text-secondary)' }}>HYDRATION</h4>
          {row('Unit', (
            <div style={{ display: 'flex', gap: 6 }}>
              {(['glasses', 'liters'] as const).map(u => (
                <button
                  key={u}
                  onClick={() => update({ waterGoalUnit: u })}
                  style={{ padding: '5px 12px', borderRadius: 8, border: 'none', background: settings.waterGoalUnit === u ? 'var(--brand-sky)' : 'var(--border-color)', color: settings.waterGoalUnit === u ? '#fff' : 'var(--text-secondary)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  {u}
                </button>
              ))}
            </div>
          ))}
          {row('Daily Goal', (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => update({ waterGoalValue: Math.max(1, settings.waterGoalValue - 1) })} style={{ background: 'var(--border-color)', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: 18, color: 'var(--text-secondary)' }}>-</button>
              <span style={{ fontWeight: 800, fontSize: 16, minWidth: 24, textAlign: 'center' }}>{settings.waterGoalValue}</span>
              <button onClick={() => update({ waterGoalValue: settings.waterGoalValue + 1 })} style={{ background: 'var(--brand-sky)', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: 18, color: '#fff' }}>+</button>
            </div>
          ))}
        </Card>

        {/* Sugar */}
        <Card>
          <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800, color: 'var(--text-secondary)' }}>SUGAR LIMIT</h4>
          <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--text-secondary)' }}>What counts as "too much" for you?</p>
          <input
            value={settings.sugarLimitDescriptor}
            onChange={e => update({ sugarLimitDescriptor: e.target.value })}
            placeholder='e.g. "1 mithai or 2 biscuits"'
            style={{ width: '100%', background: 'var(--border-color)', border: 'none', borderRadius: 10, padding: '10px 12px', fontSize: 13, color: 'var(--text-primary)' }}
          />
        </Card>

        {/* Junk food list */}
        <Card>
          <h4 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 800, color: 'var(--text-secondary)' }}>JUNK FOOD LIST</h4>
          <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--text-secondary)' }}>Your personal "junk" items</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
            {settings.customJunkItems.map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(224,159,62,0.15)', borderRadius: 20, padding: '4px 10px 4px 12px' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-amber)' }}>{item}</span>
                <button onClick={() => removeJunkItem(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}>
                  <X size={12} color="var(--brand-amber)" />
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={newJunk}
              onChange={e => setNewJunk(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addJunkItem()}
              placeholder="Add junk item..."
              style={{ flex: 1, background: 'var(--border-color)', border: 'none', borderRadius: 10, padding: '8px 12px', fontSize: 13, color: 'var(--text-primary)' }}
            />
            <button onClick={addJunkItem} style={{ background: 'var(--brand-amber)', border: 'none', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Plus size={18} color="#fff" />
            </button>
          </div>
        </Card>

        {/* Theme */}
        <Card>
          <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800, color: 'var(--text-secondary)' }}>APPEARANCE</h4>
          {row('Theme', (
            <div style={{ display: 'flex', gap: 6 }}>
              {(['light', 'dark', 'system'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => update({ theme: t })}
                  style={{ padding: '5px 10px', borderRadius: 8, border: 'none', background: settings.theme === t ? 'var(--brand-forest)' : 'var(--border-color)', color: settings.theme === t ? '#fff' : 'var(--text-secondary)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                >
                  {t}
                </button>
              ))}
            </div>
          ))}
        </Card>

        {/* Streak freeze info */}
        <Card>
          <h4 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 800, color: 'var(--text-secondary)' }}>STREAK FREEZE TOKENS</h4>
          <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--text-secondary)' }}>Earn 1 token every 30-day perfect streak. Use to protect a missed day.</p>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#4A90D9' }}>
            ❄️ ×{settings.streakFreezeTokens}
          </div>
        </Card>

        {/* Sign out */}
        <button
          onClick={() => signOut({ redirectUrl: '/' })}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(193,18,31,0.1)', border: '1px solid rgba(193,18,31,0.2)', borderRadius: 14, padding: '14px', cursor: 'pointer', color: 'var(--brand-ember)', fontWeight: 700, fontSize: 14 }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
