// Hand-maintained to match supabase/migrations. Keep in step with the SQL.

export type ItemStatus = "new" | "in_progress" | "closed";
export type BookingStatus = "new" | "confirmed" | "completed" | "cancelled";
export type ChatSender = "visitor" | "agent";
export type EmailDirection = "inbound" | "outbound";

export const ITEM_STATUSES: readonly ItemStatus[] = ["new", "in_progress", "closed"];
export const BOOKING_STATUSES: readonly BookingStatus[] = [
  "new",
  "confirmed",
  "completed",
  "cancelled",
];

export type Enquiry = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  subject: string | null;
  scope: string | null;
  status: ItemStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  patient_name: string;
  email: string;
  phone: string | null;
  service: string;
  preferred_date: string;
  preferred_time: string;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
};

export type ChatSession = {
  id: string;
  visitor_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  last_message_at: string;
  status: ItemStatus;
  created_at: string;
};

export type ChatMessage = {
  id: string;
  session_id: string;
  sender: ChatSender;
  body: string;
  created_at: string;
};

export type EmailThread = {
  id: string;
  subject: string;
  participant_email: string;
  participant_name: string | null;
  last_message_at: string;
  status: ItemStatus;
  created_at: string;
};

export type EmailMessage = {
  id: string;
  thread_id: string;
  direction: EmailDirection;
  from_email: string;
  from_name: string | null;
  to_email: string | null;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  message_id: string | null;
  in_reply_to: string | null;
  has_attachments: boolean;
  created_at: string;
};

export type AdminRow = { user_id: string; email: string; created_at: string };
