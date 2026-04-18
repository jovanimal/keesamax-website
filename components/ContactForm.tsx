"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please write at least a short message"),
  cv: z
    .custom<FileList>()
    .optional()
    .refine(
      (list) => !list || list.length === 0 || list[0].size <= MAX_FILE_SIZE,
      "CV must be 5MB or smaller",
    )
    .refine(
      (list) =>
        !list || list.length === 0 || ACCEPTED_CV_TYPES.includes(list[0].type),
      "CV must be PDF or DOC",
    ),
});

type FormValues = z.infer<typeof schema>;

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setStatus("submitting");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      if (values.phone) formData.append("phone", values.phone);
      formData.append("message", values.message);
      if (values.cv && values.cv.length > 0) {
        formData.append("cv", values.cv[0]);
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Unexpected error");
    }
  };

  const inputBase =
    "w-full rounded-[var(--radius-sm)] border bg-white px-4 py-[13px] font-body text-[0.9375rem] text-[var(--color-slate-900)] transition-all duration-200 focus:outline-none focus:shadow-[0_0_0_3px_rgba(15,35,65,0.08)]";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-[var(--radius-lg)] border border-[var(--color-slate-100)] bg-[var(--color-slate-50)] p-7 md:p-10"
    >
      <div className="grid gap-3.5 sm:grid-cols-2">
        <Field label="Full Name *" error={errors.fullName?.message}>
          <input
            type="text"
            placeholder="Your full name"
            className={cn(
              inputBase,
              errors.fullName
                ? "border-red-400 focus:border-red-500"
                : "border-[var(--color-slate-200)] focus:border-[var(--color-navy-900)]",
            )}
            {...register("fullName")}
          />
        </Field>
        <Field label="Email *" error={errors.email?.message}>
          <input
            type="email"
            placeholder="you@company.com"
            className={cn(
              inputBase,
              errors.email
                ? "border-red-400 focus:border-red-500"
                : "border-[var(--color-slate-200)] focus:border-[var(--color-navy-900)]",
            )}
            {...register("email")}
          />
        </Field>
      </div>

      <Field label="Phone Number" error={errors.phone?.message}>
        <input
          type="tel"
          placeholder="+60 12-345 6789"
          className={cn(inputBase, "border-[var(--color-slate-200)] focus:border-[var(--color-navy-900)]")}
          {...register("phone")}
        />
      </Field>

      <Field label="Message *" error={errors.message?.message}>
        <textarea
          rows={5}
          placeholder="Tell us about your hiring needs or career goals..."
          className={cn(
            inputBase,
            "min-h-[120px] resize-y",
            errors.message
              ? "border-red-400 focus:border-red-500"
              : "border-[var(--color-slate-200)] focus:border-[var(--color-navy-900)]",
          )}
          {...register("message")}
        />
      </Field>

      <Field label="Upload CV (optional, PDF/DOC, max 5MB)" error={errors.cv?.message}>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className={cn(
            inputBase,
            "cursor-pointer border-dashed py-2.5",
            errors.cv
              ? "border-red-400 focus:border-red-500"
              : "border-[var(--color-slate-200)] focus:border-[var(--color-navy-900)]",
          )}
          {...register("cv")}
        />
      </Field>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-navy-900)] px-6 py-[15px] text-[0.9375rem] font-semibold leading-none text-white shadow-[0_2px_8px_rgba(15,35,65,0.2)] transition-all duration-[250ms] ease-[var(--ease-brand)] hover:-translate-y-px hover:bg-[var(--color-navy-800)] hover:shadow-[0_6px_20px_rgba(15,35,65,0.3)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? "Sending..." : "Send Message →"}
      </button>

      {status === "success" ? (
        <div className="mt-5 rounded-[var(--radius-sm)] border border-[var(--color-emerald-600)]/30 bg-[var(--color-emerald-50)] px-4 py-3 text-sm text-[var(--color-emerald-600)]">
          Thanks! Your message is on its way. We&apos;ll reply within 1–2 business days.
        </div>
      ) : null}

      {status === "error" ? (
        <div className="mt-5 rounded-[var(--radius-sm)] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage || "Something went wrong. Please try again."}
        </div>
      ) : null}
    </form>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-[0.8125rem] font-semibold text-[var(--color-slate-700)]">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
