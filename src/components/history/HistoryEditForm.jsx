import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

export default function HistoryEditForm({ values, onChange, onSave, onCancel, isSaving }) {
  return (
    <div className="grid gap-4 rounded-xl border border-blue-200 bg-blue-50 p-4 sm:grid-cols-2">
      <label className="space-y-2 text-sm font-medium text-slate-700">
        סך הכנסות
        <Input type="number" value={values.totalIncome} onChange={event => onChange({ ...values, totalIncome: event.target.value })} />
      </label>
      <label className="space-y-2 text-sm font-medium text-slate-700">
        סך הוצאות
        <Input type="number" value={values.totalExpenses} onChange={event => onChange({ ...values, totalExpenses: event.target.value })} />
      </label>
      <div className="flex gap-2 sm:col-span-2">
        <Button onClick={onSave} disabled={isSaving} className="min-h-11 bg-blue-600 hover:bg-blue-700">
          <Save className="ml-2 h-4 w-4" />{isSaving ? 'שומר…' : 'שמור שינויים'}
        </Button>
        <Button variant="outline" onClick={onCancel} className="min-h-11"><X className="ml-2 h-4 w-4" />ביטול</Button>
      </div>
    </div>
  );
}