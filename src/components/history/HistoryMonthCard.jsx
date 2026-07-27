import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import HistoryDetails from './HistoryDetails';
import HistoryEditForm from './HistoryEditForm';

const money = value => `₪${Number(value || 0).toLocaleString('he-IL')}`;

export default function HistoryMonthCard({ record, monthName, isAdmin, editing, editData, setEditData, onEdit, onSave, onCancel, onDelete, isSaving }) {
  return (
    <AccordionItem value={record.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 shadow-sm">
      <AccordionTrigger className="min-h-20 cursor-pointer hover:no-underline">
        <div className="flex min-w-0 flex-1 flex-col gap-3 text-right sm:flex-row sm:items-center sm:justify-between">
          <span className="text-lg font-bold text-slate-900">{monthName}</span>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm tabular-nums"><span className="text-green-700">הכנסות {money(record.totalIncome)}</span><span className="text-red-700">הוצאות {money(record.totalExpenses)}</span><span className="font-semibold text-slate-800">יתרה {money(record.balance)}</span></div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-5 border-t border-slate-100 pt-5">
        {editing ? <HistoryEditForm values={editData} onChange={setEditData} onSave={onSave} onCancel={onCancel} isSaving={isSaving} /> : <HistoryDetails categories={record.categoryDetails} transactions={record.transactionDetails} />}
        {isAdmin && !editing && <div className="flex gap-2 border-t border-slate-100 pt-4"><Button variant="outline" onClick={onEdit} className="min-h-11"><Edit className="ml-2 h-4 w-4" />ערוך סיכום</Button><Button variant="outline" onClick={onDelete} className="min-h-11 text-red-700 hover:bg-red-50 hover:text-red-800"><Trash2 className="ml-2 h-4 w-4" />מחק חודש</Button></div>}
      </AccordionContent>
    </AccordionItem>
  );
}