import db from "../../database/db.js";

export const getDashboardStats = async ({ year, month } = {}) => {
   const applyDateFilter = (query, col = "created_at") => {
      if (year) query.whereRaw(`YEAR(${col}) = ?`, [Number(year)]);
      if (month) query.whereRaw(`MONTH(${col}) = ?`, [Number(month)]);
      return query;
   };

   const [{ total: totalSubmissions }] = await applyDateFilter(
      db("memberships").count("id as total")
   );

   const [{ total: totalLogins }] = await applyDateFilter(
      db("audit_logs").where("action", "USER_LOGIN").count("id as total")
   );

   const [{ total: totalDownloads }] = await applyDateFilter(
      db("audit_logs").where("action", "MEMBERSHIP_PDF_DOWNLOADED").count("id as total")
   );

   // Monthly submissions for current year (always full year for chart)
   const chartYear = year || new Date().getFullYear();
   const monthlyRows = await db("memberships")
      .whereRaw("YEAR(created_at) = ?", [chartYear])
      .select(db.raw("MONTH(created_at) as month"), db.raw("COUNT(id) as count"))
      .groupByRaw("MONTH(created_at)")
      .orderByRaw("MONTH(created_at)");

   const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
   const monthlySubmissions = MONTH_NAMES.map((name, i) => {
      const row = monthlyRows.find((r) => Number(r.month) === i + 1);
      return { month: name, submissions: row ? Number(row.count) : 0 };
   });

   // Transaction type breakdown
   const typeRows = await applyDateFilter(
      db("memberships")
         .select("transaction_type")
         .count("id as count")
         .groupBy("transaction_type")
   );

   const byTransactionType = typeRows.map((r) => ({
      type: r.transaction_type,
      count: Number(r.count),
   }));

   return {
      totalForms: 1,
      totalSubmissions: Number(totalSubmissions),
      totalLogins: Number(totalLogins),
      totalDownloads: Number(totalDownloads),
      monthlySubmissions,
      byTransactionType,
      chartYear,
   };
};
