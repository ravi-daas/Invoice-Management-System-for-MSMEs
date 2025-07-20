import { z } from "zod";

export const clientSchema = z.object({
  businessName: z.string().min(2, "Business Name is required"),
  industry: z.string().optional(),
  address: z.string().min(2, "Address is required").optional(),
  logo: z.string().optional(),
  taxId: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 5, {
      message: "Tax ID must be at least 5 characters long",
    }),
  gstIn: z.string().optional(),
  type: z.enum(["Individual", "Organization"]),
});

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required."),
  selectedClient: z
    .array(clientSchema)
    .min(1, "At least one client must be selected."),
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required."),
      })
    )
    .min(1, "At least one item is required."),
});

export const invoiceSchemaRetail = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required."),
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required."),
      })
    )
    .min(1, "At least one item is required."),
});

export const quotationSchema = z.object({
  quotationNumber: z.string().min(1, "quotation number is required."),
  selectedClient: z
    .array(clientSchema)
    .min(1, "At least one client must be selected."),
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required."),
      })
    )
    .min(1, "At least one item is required."),
});
