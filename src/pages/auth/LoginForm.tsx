import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { userLoginSchema, type LoginFormSchema } from "@/schemas/authSchema";
import { AuthError } from "@/lib/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { setUser, setInitialized } from "@/store/slices/authSlice";
import { authApi } from "@/lib/api/authApi";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const handleSubmitForm = async (values: LoginFormSchema) => {
    try {
      const data = await authApi.login(values.email, values.password);
      dispatch(setUser(data.user));
      dispatch(setInitialized(true));
      toast.success("Login successful");
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof AuthError) {
        toast.error("Login failed", {
          description: err.message,
        });
      } else {
        toast.error("Login failed", {
          description: err instanceof Error ? err.message : "Something went wrong",
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="m@example.com"
              autoComplete="off"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
             
            </div>
            <div className="relative">
              <Input
                {...field}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="*******"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Field orientation="horizontal">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </Field>
    </form>
  );
}
