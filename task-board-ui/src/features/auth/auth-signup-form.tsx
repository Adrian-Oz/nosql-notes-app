import { useForm } from "@tanstack/react-form";
import { useAuthModalStore } from "./useAuthStore";
// import { useSignUp } from "./authHooks"; // i need to implement this
import * as z from "zod";
import type { Dispatch, SetStateAction } from "react";
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "../../components/ui/button";
import { useAuthActions } from "./authActions";

export default function RegisterForm({
  handleRegisterFlag,
}: {
  handleRegisterFlag: Dispatch<SetStateAction<boolean>>;
}) {
  const { signUp } = useAuthActions();
  const toggleAuthModal = useAuthModalStore((s) => s.toggleAuthModal);
  const signUpSchema = z
    .object({
      // firstName: z.string().min(1, "First name required"),
      // lastName: z.string().min(1, "Last name required"),
      email: z.string().email("Provide valid email"),
      password: z.string().min(8, "Password must be at least 8 characters."),
      confirmPassword: z.string().min(8, "Confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  const form = useForm({
    defaultValues: {
      // firstName: "",
      // lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async (values) => {
      const body = {
        email: values.value.email,
        // firstName: values.value.firstName,
        // lastName: values.value.lastName,
        password: values.value.password,
      };
      console.log("IM TRYING");
      try {
        await signUp(body);
        toast.success("Account created! You are now logged in.");
        toggleAuthModal();
      } catch (error) {
        toast.error(
          error instanceof FirebaseError
            ? error.message
            : "Registration failed",
        );
      }
    },
  });
  return (
    <div className="">
      <form
        className="p-6 flex items-center min-h-167"
        id="loginForm"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup className="">
          <div className="flex flex-col items-center gap-2 text-center ">
            <h1 className="text-2xl font-bold">Sing Up</h1>
            <p className="text-muted-foreground text-balance">
              Create an account
            </p>
          </div>
          {/* EMAIL FORM FIELD */}
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="">
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          {/* PASSWORD FORM FIELD  */}
          {/* <div className="flex gap-2">
            <form.Field
              name="firstName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="text"
                      placeholder="Jon"
                      required
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="lastName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="text"
                      placeholder="Doe"
                      required
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </div> */}
          <div className="flex gap-2">
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="password"
                      placeholder="******"
                      required
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="confirmPassword"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>
                        Confirm password
                      </FieldLabel>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="password"
                      placeholder="******"
                      required
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </div>

          {/* Submit FIELD */}
          <Field>
            <Button type="submit">Continue</Button>
          </Field>
          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card"></FieldSeparator>

          <FieldDescription className="text-center">
            Have an account?{" "}
            <Button
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                handleRegisterFlag(false);
              }}
            >
              Sign in
            </Button>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  );
}
