import { z } from 'zod';

const emptyToUndefined = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.preprocess(emptyToUndefined, z.string().optional()),
  company: z.preprocess(emptyToUndefined, z.string().optional()),
  serviceId: z.preprocess(emptyToUndefined, z.string().optional()),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});

export const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.preprocess(emptyToUndefined, z.string().optional()),
  serviceId: z.preprocess(emptyToUndefined, z.string().optional()),
  datetime: z.string().datetime(),
  notes: z.preprocess(emptyToUndefined, z.string().optional()),
});