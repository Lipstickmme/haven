import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Form submissions never touch the database from the browser. `enquiries` and
// `bookings` have no anon policy at all — this server function holds the
// service-role key, so a leaked anon key cannot stuff the inbox.

const trimmed = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : undefined));

// Bots fill every field they can see. A real person leaves this one empty.
const honeypot = z.string().max(200).optional();

const enquirySchema = z.object({
  kind: z.literal("enquiry"),
  name: trimmed(200).min(1, "Your name is required"),
  company: optionalText(200),
  email: trimmed(320).email("That does not look like an email address"),
  phone: optionalText(60),
  subject: optionalText(300),
  scope: trimmed(4000).min(1, "Tell us a little about the project"),
  website: honeypot,
});

const bookingSchema = z.object({
  kind: z.literal("booking"),
  name: trimmed(200).min(1, "Your name is required"),
  email: trimmed(320).email("That does not look like an email address"),
  phone: optionalText(60),
  service: trimmed(200).min(1, "Choose a consultation type"),
  preferredDate: trimmed(40).min(1, "Pick a date"),
  preferredTime: trimmed(40).min(1, "Pick a time"),
  notes: optionalText(4000),
  website: honeypot,
});

const chatSchema = z.object({
  kind: z.literal("chat"),
  sessionId: trimmed(80).min(1),
  name: trimmed(200).min(1),
  email: optionalText(320),
  message: trimmed(4000).min(1),
  website: honeypot,
});

export const submitFormSchema = z.discriminatedUnion("kind", [
  enquirySchema,
  bookingSchema,
  chatSchema,
]);

export type SubmitFormInput = z.infer<typeof submitFormSchema>;
export type SubmitFormResult = { ok: true; id: string | null };

export const submitForm = createServerFn({ method: "POST" })
  .validator((input: unknown) => submitFormSchema.parse(input))
  .handler(async ({ data }): Promise<SubmitFormResult> => {
    const shared = await import("./_shared.server");

    // Honeypot: answer as if it worked, write nothing, send nothing.
    if (data.website && data.website.trim() !== "") {
      return { ok: true, id: null };
    }

    if (data.kind === "chat") {
      // The widget writes its own rows under the visitor's session — RLS can
      // express "your own chat" precisely. All this does is ring the bell.
      await notify(shared, {
        subject: `New chat message from ${data.name}`,
        heading: "A visitor started a chat",
        rows: [
          ["Name", data.name],
          ["Email", data.email ?? "—"],
          ["Message", data.message],
          ["Session", data.sessionId],
        ],
        ...(data.email ? { replyTo: data.email } : {}),
        footer: "Reply in the Live chat tab of the dashboard.",
      });
      return { ok: true, id: data.sessionId };
    }

    const db = shared.adminClient();

    if (data.kind === "enquiry") {
      const { data: row, error } = await db
        .from("enquiries")
        .insert({
          name: data.name,
          company: data.company ?? null,
          email: data.email,
          phone: data.phone ?? null,
          subject: data.subject ?? null,
          scope: data.scope,
        })
        .select("id")
        .single();

      if (error) throw new Error(`Could not save the enquiry: ${error.message}`);

      await notify(shared, {
        subject: `New enquiry — ${data.subject || data.name}`,
        heading: "New project enquiry",
        rows: [
          ["Name", data.name],
          ["Company", data.company ?? ""],
          ["Email", data.email],
          ["Phone", data.phone ?? ""],
          ["Subject", data.subject ?? ""],
          ["Brief", data.scope],
        ],
        replyTo: data.email,
        footer: "Open the Enquiries tab of the dashboard to reply.",
      });

      return { ok: true, id: String(row?.["id"] ?? "") || null };
    }

    const { data: row, error } = await db
      .from("bookings")
      .insert({
        patient_name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        service: data.service,
        preferred_date: data.preferredDate,
        preferred_time: data.preferredTime,
        notes: data.notes ?? null,
      })
      .select("id")
      .single();

    if (error) throw new Error(`Could not save the booking: ${error.message}`);

    await notify(shared, {
      subject: `New booking request — ${data.name}`,
      heading: "New consultation booking",
      rows: [
        ["Name", data.name],
        ["Email", data.email],
        ["Phone", data.phone ?? ""],
        ["Consultation", data.service],
        ["Preferred date", data.preferredDate],
        ["Preferred time", data.preferredTime],
        ["Notes", data.notes ?? ""],
      ],
      replyTo: data.email,
      footer: "Open the Bookings tab of the dashboard to confirm.",
    });

    return { ok: true, id: String(row?.["id"] ?? "") || null };
  });

type SharedModule = typeof import("./_shared.server");

/** The write already succeeded; a mail failure must not undo it. */
async function notify(
  shared: SharedModule,
  options: {
    subject: string;
    heading: string;
    rows: Array<[string, string]>;
    replyTo?: string;
    footer: string;
  },
): Promise<void> {
  try {
    await shared.sendEmail({
      to: shared.MAIL_NOTIFY_TO,
      subject: options.subject,
      html: shared.emailBody(options.heading, options.rows, options.footer),
      ...(options.replyTo ? { replyTo: options.replyTo } : {}),
    });
  } catch (error) {
    console.error("[mail] notification failed:", shared.errorMessage(error));
  }
}
