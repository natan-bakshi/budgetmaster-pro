import { Category } from '@/entities/Category';
import { CategoryInstance } from '@/entities/CategoryInstance';
import { MonthlyHistory } from '@/entities/MonthlyHistory';
import { Transaction } from '@/entities/Transaction';

const periodBounds = (month, resetDay) => {
  const [year, monthIndex] = month.split('-').map(Number);
  return {
    start: new Date(year, monthIndex - 1, resetDay),
    end: new Date(year, monthIndex, resetDay)
  };
};

export async function archiveCompletedMonths(householdId, currentMonth, resetDay) {
  const [instances, categories, transactions, history] = await Promise.all([
    CategoryInstance.filter({ householdId }),
    Category.filter({ householdId }),
    Transaction.filter({ householdId }),
    MonthlyHistory.filter({ householdId })
  ]);
  const archived = new Set(history.map(record => record.month));
  const months = [...new Set(instances.map(item => item.month))]
    .filter(month => month < currentMonth && !archived.has(month))
    .sort();
  const categoryMap = new Map(categories.map(category => [category.id, category]));

  for (const month of months) {
    const monthInstances = instances.filter(item => item.month === month);
    const categoryDetails = monthInstances.map(item => {
      const category = categoryMap.get(item.categoryId);
      return { categoryId: item.categoryId, name: category?.name || 'קטגוריה שנמחקה', type: category?.type || 'expense', amount: Number(item.currentAmount) || 0, notes: item.notes || '', order: category?.order || 0 };
    });
    const totalIncome = categoryDetails.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = categoryDetails.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
    const { start, end } = periodBounds(month, resetDay);
    const transactionDetails = transactions.filter(item => {
      const date = new Date(item.date);
      return date >= start && date < end;
    }).map(({ categoryId, accountId, amount, date, notes, type, isAutomatic, isExecuted }) => ({ categoryId, accountId, amount, date, notes: notes || '', type, isAutomatic: !!isAutomatic, isExecuted: !!isExecuted }));

    await MonthlyHistory.create({ month, totalIncome, totalExpenses, balance: totalIncome - totalExpenses, categoryDetails, transactionDetails, householdId });
  }
}