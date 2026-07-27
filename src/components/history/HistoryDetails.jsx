import { Badge } from '@/components/ui/badge';

const money = value => `₪${Number(value || 0).toLocaleString('he-IL')}`;

export default function HistoryDetails({ categories = [], transactions = [] }) {
  const sorted = [...categories].sort((a, b) => (a.order || 0) - (b.order || 0));
  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-3 font-semibold text-slate-800">פירוט קטגוריות</h3>
        {sorted.length ? <div className="grid gap-3 sm:grid-cols-2">{sorted.map((item, index) => (
          <div key={`${item.categoryId}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3"><span className="font-medium text-slate-800">{item.name}</span><Badge variant="outline">{item.type === 'income' ? 'הכנסה' : 'הוצאה'}</Badge></div>
            <p className={`mt-2 text-lg font-bold tabular-nums ${item.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>{money(item.amount)}</p>
            {item.notes && <p className="mt-2 break-words text-sm text-slate-600">{item.notes}</p>}
          </div>
        ))}</div> : <p className="text-slate-600">לא נשמר פירוט קטגוריות לחודש זה.</p>}
      </section>
      {transactions.length > 0 && <section><h3 className="mb-3 font-semibold text-slate-800">עסקאות שנשמרו</h3><div className="space-y-2">{transactions.map((item, index) => <div key={`${item.date}-${index}`} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-3 text-sm"><span className="min-w-0 break-words text-slate-700">{item.notes || 'עסקה ללא הערה'}</span><span className="shrink-0 font-semibold tabular-nums">{money(item.amount)}</span></div>)}</div></section>}
    </div>
  );
}