import db from "../../database/db.js";

/**
 * Reusable audit log recorder.
 *
 * @param {object} params
 * @param {number|null} params.userId      - ID of the authenticated user (null for pre-auth events)
 * @param {string}      params.actorName   - Display name of the actor
 * @param {string}      params.action      - Event key e.g. "USER_LOGIN", "TEMPLATE_CREATED"
 * @param {string}      [params.entity]    - Resource type e.g. "User", "Template"
 * @param {number}      [params.entityId]  - ID of the affected resource
 * @param {object}      [params.metadata]  - Any extra structured data
 * @param {string}      [params.ipAddress] - Client IP
 */
export const createAuditLog = async ({
   userId = null,
   actorName,
   action,
   entity = null,
   entityId = null,
   metadata = null,
   ipAddress = null,
}) => {
   await db("audit_logs").insert({
      user_id: userId,
      actor_name: actorName,
      action,
      entity,
      entity_id: entityId,
      metadata: metadata ? JSON.stringify(metadata) : null,
      ip_address: ipAddress,
   });
};
