// Admin-side editor for a PowerFlow definition.
// Lets you toggle two-column layout and add/remove/reorder typed steps.
import React from 'react';
import { PowerFlow, FlowStep, StepType, ServiceName, STEP_TYPES, SERVICE_NAMES } from '../data/powerFlows';
import { SERVICE_DISPLAY, ServiceIcon } from './ServiceIcon';

interface Props {
  value: PowerFlow | null;
  onChange: (next: PowerFlow | null) => void;
  /** used to seed a flow id when the user enables a flow on a new item */
  fallbackId?: string;
  /** title to seed when enabling */
  fallbackTitle?: string;
}

const emptyStep = (): FlowStep => ({
  type: 'action',
  service: 'compose',
  label: '',
  sub: '',
});

const STEP_TYPE_LABEL: Record<StepType, string> = {
  trigger:   'TRIGGER',
  action:    'ACTION',
  condition: 'CONDITION',
  loop:      'APPLY TO EACH',
  end:       'END / FINAL',
};

const STEP_TYPE_COLOR: Record<StepType, string> = {
  trigger:   '#D13438',
  action:    '#0066FF',
  condition: '#F0A30A',
  loop:      '#7B1FA2',
  end:       '#107C10',
};

export const FlowEditor: React.FC<Props> = ({ value, onChange, fallbackId, fallbackTitle }) => {
  const enabled = !!value;

  const enable = () => {
    onChange({
      id: fallbackId || `pp-${Date.now()}`,
      title: fallbackTitle || 'New Flow',
      steps: [
        { type: 'trigger', service: 'forms', label: 'When a new response is submitted', sub: 'Microsoft Forms' },
        { type: 'end',     service: 'outlook', label: 'Send notification email',          sub: 'Office 365 Outlook' },
      ],
      preferTwoColumn: false,
    });
  };

  const disable = () => onChange(null);

  const update = (patch: Partial<PowerFlow>) => {
    if (!value) return;
    onChange({ ...value, ...patch });
  };

  const updateStep = (idx: number, patch: Partial<FlowStep>) => {
    if (!value) return;
    const steps = value.steps.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    onChange({ ...value, steps });
  };

  const addStep = () => {
    if (!value) return;
    onChange({ ...value, steps: [...value.steps, emptyStep()] });
  };

  const removeStep = (idx: number) => {
    if (!value) return;
    const steps = value.steps.filter((_, i) => i !== idx);
    onChange({ ...value, steps });
  };

  const moveStep = (idx: number, dir: -1 | 1) => {
    if (!value) return;
    const j = idx + dir;
    if (j < 0 || j >= value.steps.length) return;
    const steps = [...value.steps];
    [steps[idx], steps[j]] = [steps[j], steps[idx]];
    onChange({ ...value, steps });
  };

  return (
    <div className="border-4 border-black bg-[#FFFBEA] p-4">
      <div className="flex items-center justify-between mb-3">
        <label className="font-black uppercase text-xs flex items-center gap-2">
          ⚡ Power Automate Flow Diagram
          <span className="text-[10px] font-bold text-gray-500 normal-case">
            (optional — overrides built-in flow lookup)
          </span>
        </label>
        {!enabled ? (
          <button
            type="button"
            onClick={enable}
            className="px-3 py-1.5 bg-black text-white font-black uppercase text-[11px] border-2 border-black hover:bg-gray-800"
          >
            + Build Flow
          </button>
        ) : (
          <button
            type="button"
            onClick={disable}
            className="px-3 py-1.5 bg-white text-red-600 font-black uppercase text-[11px] border-2 border-black hover:bg-red-50"
          >
            Remove Flow
          </button>
        )}
      </div>

      {!enabled && (
        <p className="text-[11px] text-gray-500 font-semibold">
          No custom flow attached. The diagram will fall back to a built-in definition if one matches this item's title.
        </p>
      )}

      {enabled && value && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 bg-white border-2 border-black p-2">
            <label className="flex items-center gap-2 font-black uppercase text-[11px]">
              <input
                type="checkbox"
                checked={!!value.preferTwoColumn}
                onChange={e => update({ preferTwoColumn: e.target.checked })}
                className="w-4 h-4 accent-black"
              />
              Two-column layout
            </label>
            <span className="text-[10px] font-bold text-gray-500">
              {value.steps.length} step{value.steps.length === 1 ? '' : 's'}
            </span>
          </div>

          {/* Step rows */}
          <div className="space-y-2">
            {value.steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-black p-2"
                style={{ borderLeftWidth: 6, borderLeftColor: STEP_TYPE_COLOR[step.type] }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-black text-white font-black text-[11px] flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div className="flex-shrink-0">
                    <ServiceIcon service={step.service} size={22} />
                  </div>
                  <select
                    value={step.type}
                    onChange={e => updateStep(idx, { type: e.target.value as StepType })}
                    className="text-[11px] font-black uppercase border-2 border-black px-1.5 py-1 bg-white"
                  >
                    {STEP_TYPES.map(t => (
                      <option key={t} value={t}>{STEP_TYPE_LABEL[t]}</option>
                    ))}
                  </select>
                  <select
                    value={step.service}
                    onChange={e => updateStep(idx, { service: e.target.value as ServiceName })}
                    className="text-[11px] font-bold border-2 border-black px-1.5 py-1 bg-white flex-1 min-w-[120px]"
                  >
                    {SERVICE_NAMES.map(s => (
                      <option key={s} value={s}>{SERVICE_DISPLAY[s]}</option>
                    ))}
                  </select>
                  <div className="flex gap-1 ml-auto">
                    <button
                      type="button"
                      onClick={() => moveStep(idx, -1)}
                      disabled={idx === 0}
                      className="w-7 h-7 border-2 border-black bg-white font-black text-[12px] disabled:opacity-30 hover:bg-gray-100"
                      title="Move up"
                    >↑</button>
                    <button
                      type="button"
                      onClick={() => moveStep(idx, 1)}
                      disabled={idx === value.steps.length - 1}
                      className="w-7 h-7 border-2 border-black bg-white font-black text-[12px] disabled:opacity-30 hover:bg-gray-100"
                      title="Move down"
                    >↓</button>
                    <button
                      type="button"
                      onClick={() => removeStep(idx)}
                      className="w-7 h-7 border-2 border-black bg-red-500 text-white font-black text-[12px] hover:bg-red-600"
                      title="Remove step"
                    >×</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Label (e.g. 'Get response details')"
                    value={step.label}
                    onChange={e => updateStep(idx, { label: e.target.value })}
                    className="text-[12px] font-bold border-2 border-black px-2 py-1.5 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Sub-label (e.g. 'Microsoft Forms')"
                    value={step.sub}
                    onChange={e => updateStep(idx, { sub: e.target.value })}
                    className="text-[12px] font-semibold border-2 border-black px-2 py-1.5 w-full text-gray-700"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addStep}
            className="w-full py-2 bg-black text-white font-black uppercase text-[11px] border-2 border-black hover:bg-gray-800"
          >
            + Add Step
          </button>
        </div>
      )}
    </div>
  );
};
