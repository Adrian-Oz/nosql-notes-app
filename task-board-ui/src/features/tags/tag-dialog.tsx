import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  Field,
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import { useBoardStore } from "@/store/board-store";
import { useEffect } from "react";

// Form Schema
const addTagSchema = z.object({
  name: z
    .string()
    .min(3, "Tag must be at least 3 characters")
    .max(12, "Title must be at most 12 characters."),
  //   body: z.string().max(150),
});

// FUNCTION
export default function TagDialog() {
  const { mode } = useBoardStore((s) => s.tagDialog);
  const boards = useBoardStore((s) => s.boards);
  const activeBoardId = useBoardStore((s) => s.activeBoardId);
  if (!activeBoardId) return;
  const board = boards[activeBoardId];

  //store actions
  //   const editIssue = useBoardStore((s) => s.editIssue);
  const addTag = useBoardStore((s) => s.addTag);
  const close = useBoardStore((s) => s.closeTagDialog);

  const form = useForm({
    defaultValues: {
      name: "",
      //   body: "",
    },
    validators: {
      onSubmit: addTagSchema,
    },
    onSubmit: async ({ value }) => {
      if (mode === "create") {
        const result = addTag({ name: value.name });

        if (!result.success) {
          toast.error(result.error);
          return;
        }

        toast.success("Tag created");
      }

      //   if (mode === "edit" && issueId) {
      //     editIssue({
      //       issueId,
      //       ...value,
      //     });

      //     toast.success("Issue updated");
      //   }

      form.reset();
      close();
    },
  });
  useEffect(() => {
    // if (mode === "edit" && issueId) {
    //   const issue = board.issues[issueId];
    //   if (!issue) return;

    //   form.setFieldValue("title", issue.title);
    //   form.setFieldValue("body", issue.body ?? "");
    // }

    if (mode === "create") {
      form.reset();
    }
  }, [mode, board]);

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
            {mode === "edit" ? "Edit tag" : "Create tag"}
          </DialogTitle>

          <DialogDescription>
            {mode === "edit"
              ? "Update tag details."
              : "Add a new tag to the board."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="add-tag-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field className="w-44" data-invalid={isInvalid}>
                    <FieldLabel
                      className="text-md font-bold"
                      htmlFor={field.name}
                    >
                      Tag name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="BUG"
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
            {/* <form.Field
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
            /> */}
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button type="submit" form="add-tag-form">
            {mode === "edit" ? "Save Changes" : "Add tag"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
