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
} from "@/components/ui/dialog";
import type { CreateIssueInput } from "@/types/issue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBoardStore } from "@/store/board-store";
import { useEffect } from "react";

// Form Schema
const addIssueSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(32, "Title must be at most 32 characters."),
  body: z.string().max(150),
});

// FUNCTION
export default function IssueDialog() {
  const { mode, issueId, targetColumnId } = useBoardStore((s) => s.issueDialog);
  const board = useBoardStore((s) => s.board);

  //store actions
  const editIssue = useBoardStore((s) => s.editIssue);
  const addIssue = useBoardStore((s) => s.addIssue);
  const close = useBoardStore((s) => s.closeIssueDialog);

  const form = useForm({
    defaultValues: {
      title: "",
      body: "",
    },
    validators: {
      onSubmit: addIssueSchema,
    },
    onSubmit: async ({ value }) => {
      if (mode === "create") {
        if (!targetColumnId) return;

        addIssue({
          ...value,
          columnId: targetColumnId,
        });

        toast.success("Issue created");
      }

      if (mode === "edit" && issueId) {
        editIssue({
          issueId,
          ...value,
        });

        toast.success("Issue updated");
      }

      form.reset();
      close();
    },
  });
  useEffect(() => {
    if (mode === "edit" && issueId) {
      const issue = board.issues[issueId];
      if (!issue) return;

      form.setFieldValue("title", issue.title);
      form.setFieldValue("body", issue.body ?? "");
    }

    if (mode === "create") {
      form.reset();
    }
  }, [mode, issueId, board]);

  return (
    <Dialog
      open={mode === "create" || mode === "edit"}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
          close();
        }
      }}
    >
      <DialogContent className="sm:max-w-125 bg-(--surface-3)">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Issue" : "Create Issue"}
          </DialogTitle>
          <DialogDescription>
            <DialogDescription>
              {mode === "edit"
                ? "Update issue details."
                : "Add a new issue to the board."}
            </DialogDescription>
          </DialogDescription>
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
            {mode === "edit" ? "Save Changes" : "Add Issue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
