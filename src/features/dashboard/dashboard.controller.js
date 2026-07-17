import { getDashboardStats } from "./dashboard.service.js";

export const stats = async (req, res) => {
   try {
      const { year, month } = req.query;
      const data = await getDashboardStats({ year, month });
      return res.json(data);
   } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      return res.status(500).json({ error: "Failed to fetch dashboard statistics" });
   }
};
