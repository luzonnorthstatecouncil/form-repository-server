import db from "../../database/db.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

export const findAll = async (search) => {
   let query = db("form_links").select("*");
   if (search) {
      query = query.where((builder) => {
         builder.where("name", "like", `%${search}%`)
                .orWhere("description", "like", `%${search}%`);
      });
   }
   return query.orderBy("created_at", "desc");
};

export const create = async ({ name, url, description, is_visible }, actor) => {
   const [id] = await db("form_links").insert({
      name,
      url,
      description: description || null,
      is_visible: is_visible === false ? 0 : 1,
   });
   const form = await db("form_links").where({ id }).first();

   const dbUser = actor?.id ? await db("users").where({ id: actor.id }).first() : null;
   const actorName = dbUser?.full_name || actor?.full_name || "Unknown Admin";

   await createAuditLog({
      userId: actor?.id ?? null,
      actorName,
      action: "FORM_LINK_CREATED",
      entity: "FormLink",
      entityId: id,
      metadata: { name, url, is_visible: is_visible !== false },
   });

   return form;
};

export const remove = async (id, actor) => {
   const form = await db("form_links").where({ id }).first();
   if (!form) throw { status: 404, message: "Form link not found" };

   await db("form_links").where({ id }).delete();

   const dbUser = actor?.id ? await db("users").where({ id: actor.id }).first() : null;
   const actorName = dbUser?.full_name || actor?.full_name || "Unknown Admin";

   await createAuditLog({
      userId: actor?.id ?? null,
      actorName,
      action: "FORM_LINK_DELETED",
      entity: "FormLink",
      entityId: id,
      metadata: { name: form.name },
   });
};

export const update = async (id, { name, url, description, is_visible }, actor) => {
   const oldForm = await db("form_links").where({ id }).first();
   if (!oldForm) throw { status: 404, message: "Form link not found" };

   await db("form_links")
      .where({ id })
      .update({
         name,
         url,
         description: description || null,
         is_visible: is_visible ? 1 : 0,
         updated_at: db.fn.now(),
      });

   const updatedForm = await db("form_links").where({ id }).first();

   const dbUser = actor?.id ? await db("users").where({ id: actor.id }).first() : null;
   const actorName = dbUser?.full_name || actor?.full_name || "Unknown Admin";

   await createAuditLog({
      userId: actor?.id ?? null,
      actorName,
      action: "FORM_LINK_UPDATED",
      entity: "FormLink",
      entityId: id,
      metadata: {
         old_name: oldForm.name,
         new_name: name,
         old_url: oldForm.url,
         new_url: url,
         old_visibility: !!oldForm.is_visible,
         new_visibility: !!is_visible,
      },
   });

   return updatedForm;
};

