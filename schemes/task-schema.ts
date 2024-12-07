import * as yup from "yup";

export const taskSchema = yup.object({
  title: yup
    .string()
    .label("title")
    .min(2, "Title length must be at least 2 characters")
    .max(40, "The length of the title must be a maximum of 40 characters.")
    .required("This field is required"),
  description: yup
    .string()
    .label("description")
    .min(6, "Description length must be at least 6 characters")
    .required("This field is required"),
});

export type taskSchemaType = yup.InferType<typeof taskSchema>;
