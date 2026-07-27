import React, { useEffect, useState } from 'react';
import { User } from '@/entities/User';
import { MonthlyHistory } from '@/entities/MonthlyHistory';
import { Accordion } from '@/components/ui/accordion';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import HistoryMonthCard from '@/components/history/HistoryMonthCard';
import LoggedOutState from '@/components/budget/LoggedOutState';
import LoadingSpinner from '@/components/budget/LoadingSpinner';

export default function History() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const loadHistory = async householdId => {
    const records = await MonthlyHistory.filter({ householdId }, '-month');
    setHistory(records);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        if (currentUser.householdId) await loadHistory(currentUser.householdId);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const beginEdit = record => {
    setEditingId(record.id);
    setEditData({ totalIncome: record.totalIncome, totalExpenses: record.totalExpenses });
  };

  const saveEdit = async () => {
    setIsSaving(true);
    const totalIncome = Number(editData.totalIncome) || 0;
    const totalExpenses = Number(editData.totalExpenses) || 0;
    await MonthlyHistory.update(editingId, { totalIncome, totalExpenses, balance: totalIncome - totalExpenses });
    await loadHistory(user.householdId);
    setEditingId(null);
    setIsSaving(false);
  };

  const deleteRecord = async record => {
    if (!window.confirm(`למחוק לצמיתות את ההיסטוריה של ${formatMonth(record.month)}?`)) return;
    await MonthlyHistory.delete(record.id);
    await loadHistory(user.householdId);
  };

  const formatMonth = month => {
    try { return format(new Date(`${month}-02T12:00:00`), 'MMMM yyyy', { locale: he }); }
    catch { return month; }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <LoggedOutState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 pt-24" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8"><h1 className="text-3xl font-bold text-slate-900">היסטוריה חודשית</h1><p className="mt-2 text-slate-600">סיכומי התקציב והפירוט המלא מכל תקופה שהסתיימה.</p></div>
        {history.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm"><Calendar className="mx-auto mb-4 h-14 w-14 text-slate-500" /><h2 className="text-xl font-semibold text-slate-800">עדיין אין חודשים בארכיון</h2><p className="mx-auto mt-2 max-w-xl text-slate-600">לאחר סיום תקופת התקציב הראשונה, הסיכום והפירוט שלה יישמרו כאן אוטומטית.</p></div>
        ) : (
          <Accordion type="multiple" className="space-y-4">{history.map(record => <HistoryMonthCard key={record.id} record={record} monthName={formatMonth(record.month)} isAdmin={user.role === 'admin'} editing={editingId === record.id} editData={editData} setEditData={setEditData} onEdit={() => beginEdit(record)} onSave={saveEdit} onCancel={() => setEditingId(null)} onDelete={() => deleteRecord(record)} isSaving={isSaving} />)}</Accordion>
        )}
      </div>
    </div>
  );
}