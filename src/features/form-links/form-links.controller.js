import * as formLinksService from "./form-links.service.js";

export const list = async (req, res) => {
   try {
      const { search } = req.query;
      const forms = await formLinksService.findAll(search);
      return res.json({ forms });
   } catch (err) {
      return res.status(500).json({ error: "Failed to fetch form links" });
   }
};

export const create = async (req, res) => {
   try {
      const { name, url, description, is_visible } = req.body;
      if (!name?.trim() || !url?.trim()) {
         return res.status(400).json({ error: "Name and URL are required" });
      }
      const form = await formLinksService.create({ name: name.trim(), url: url.trim(), description: description?.trim(), is_visible }, req.user);
      return res.status(201).json({ form });
   } catch (err) {
      console.error("Error creating form link:", err);
      return res.status(500).json({ error: "Failed to create form link" });
   }
};

export const remove = async (req, res) => {
   try {
      await formLinksService.remove(req.params.id, req.user);
      return res.json({ success: true });
   } catch (err) {
      return res.status(err.status || 500).json({ error: err.message || "Failed to delete form link" });
   }
};

export const update = async (req, res) => {
   try {
      const { name, url, description, is_visible } = req.body;
      if (!name?.trim() || !url?.trim()) {
         return res.status(400).json({ error: "Name and URL are required" });
      }
      const form = await formLinksService.update(req.params.id, { name: name.trim(), url: url.trim(), description: description?.trim(), is_visible }, req.user);
      return res.json({ form });
   } catch (err) {
      console.error("Error updating form link:", err);
      return res.status(err.status || 500).json({ error: err.message || "Failed to update form link" });
   }
};

