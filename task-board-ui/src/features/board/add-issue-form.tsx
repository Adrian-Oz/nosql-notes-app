import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CreateIssueInput } from "@/types/issue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
const addIssueSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(32, "Title must be at most 32 characters."),
  body: z
    .string()
    .min(5, "Desription must be at least 5 characters")
    .max(150, "Why are you making a book here ? "),
});
export default function AddIssueForm({
  onSubmit,
}: {
  onSubmit: (data: CreateIssueInput) => void;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
      body: "",
    },
    validators: {
      onSubmit: addIssueSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
      toast.success("Issue added ? Maybe ? I have no idea");
      form.reset();
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-(--surface-4) text-white hover:text-black">
          Add Issue
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-(--surface-3)">
        <DialogHeader>
          <DialogTitle>Create Issue</DialogTitle>
          <DialogDescription>Add a new issue to the board.</DialogDescription>
        </DialogHeader>

        <form
          id="add-issue-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="title"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field className="w-44" data-invalid={isInvalid}>
                    <FieldLabel
                      className="text-md font-bold"
                      htmlFor={field.name}
                    >
                      Issue Title
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Thats a task for sure"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <FieldSeparator />
            <form.Field
              name="body"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="form-tanstack-textarea-about">
                      About the issue :
                    </FieldLabel>
                    <Textarea
                      id="form-tanstack-textarea-about"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="I want to be great at things"
                      className="min-h-30"
                    />
                    <FieldDescription>
                      Please describe what you want to do
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button type="submit" form="add-issue-form">
            Add Issue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
