import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const replySchema = z.object({
  threadId: z.string().uuid(),
  body: z.string().trim().min(1, "Write something first").max(20000),
});

export type SendEmailReplyResult = { ok: true; messageId: string | null };

/**
 * Admin only. Sends through Resend threaded onto the newest inbound
 * `message_id` so the correspondent's client files it in the same
 * conversation, records the outbound message, and moves the thread on.
 */
export const sendEmailReply = createServerFn({ method: "POST" })
  .validator((input: unknown) => replySchema.parse(input))
  .handler(async ({ data }): Promise<SendEmailReplyResult> => {
    const shared = await import("./_shared.server");
    const { getRequest } = await import("@tanstack/react-start/server");

    const admin = await shared.requireAdmin(getRequest());
    const db = shared.adminClient();

    const { data: thread, error: threadError } = await db
      .from("email_threads")
      .select("id, subject, participant_email, participant_name")
      .eq("id", data.threadId)
      .single();

    if (threadError || !thread) {
      throw new Error(`No such email thread: ${threadError?.message ?? data.threadId}`);
    }

    // Thread onto the newest inbound Message-Id we know about.
    const { data: newestInbound } = await db
      .from("email_messages")
      .select("message_id")
      .eq("thread_id", data.threadId)
      .eq("direction", "inbound")
      .not("message_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const inReplyTo = newestInbound?.["message_id"] as string | null | undefined;
    const baseSubject = String(thread["subject"] ?? "").trim() || "Blueprint Haven";
    const subject = /^re:/i.test(baseSubject) ? baseSubject : `Re: ${baseSubject}`;
    const to = String(thread["participant_email"] ?? "");

    const html = `<div style="font:15px/1.6 system-ui,-apple-system,sans-serif;color:#111827">${shared
      .escapeHtml(data.body)
      .replace(/\n/g, "<br />")}</div>`;

    const messageId = await shared.sendEmail({
      to,
      subject,
      html,
      text: data.body,
      replyTo: shared.MAIL_REPLY_TO,
      ...(inReplyTo ? { inReplyTo } : {}),
    });

    const { error: insertError } = await db.from("email_messages").insert({
      thread_id: data.threadId,
      direction: "outbound",
      from_email: shared.MAIL_REPLY_TO,
      from_name: admin.email,
      to_email: to,
      subject,
      body_text: data.body,
      body_html: html,
      message_id: messageId,
      in_reply_to: inReplyTo ?? null,
      has_attachments: false,
    });

    if (insertError) {
      throw new Error(`The mail was sent but could not be recorded: ${insertError.message}`);
    }

    await db.from("email_threads").update({ status: "in_progress" }).eq("id", data.threadId);

    return { ok: true, messageId };
  });
