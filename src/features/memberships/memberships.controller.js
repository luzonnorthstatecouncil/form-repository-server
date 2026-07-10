import * as membershipsService from "./memberships.service.js";

export const create = async (req, res) => {
   try {
      const membership = await membershipsService.createMembership(req.body);
      return res.status(201).json({ membership });
   } catch (err) {
      console.error("Error creating membership:", err);
      return res.status(500).json({ error: "Failed to save membership application" });
   }
};

export const list = async (req, res) => {
   try {
      const memberships = await membershipsService.findAllMemberships();
      return res.json({ memberships });
   } catch (err) {
      console.error("Error listing memberships:", err);
      return res.status(500).json({ error: "Failed to fetch membership applications" });
   }
};
