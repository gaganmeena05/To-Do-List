import { Button, Card, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEyeCheck, IconEyeOff } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function RegisterComponent() {
  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validateInputOnBlur: true,
    validate: {
      //email check
      email: (value) =>
        !value.includes("@") ? "Please enter a valid email address" : null,
      username: (value) =>
        value.length < 2 ? "username must have at least 3 characters" : null,
      password: (value) =>
        value.length < 6 ? "password must have at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  });

  const router = useRouter();

  const submitForm = async (values) => {
    //send request to api/register
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: values.email,
        username: values.username,
        password: values.password,
      }),
    });

    //if error is username exists add error to usernmae field
    const data = await response.json();
    if (data.error && data.errorField === "username") {
      form.setFieldError("username", data.error);
    }
    //if error is email exists add error to email field
    else if (data.error && data.errorField === "email") {
      form.setFieldError("email", data.error);
    } else if (data.error && data.errorField === "password") {
      form.setFieldError("password", data.error);
    }
    //if no errors, sign in
    else {
      signIn("credentials", {
        email: values.email,
        username: values.username,
        password: values.password,
        callbackUrl: "/",
      });
    }
  };

  return (
    <Card className="w-full lg:w-1/3 md:w-1/2">
      <h1 className="text-center font-medium text-2xl">Register</h1>
      <form
        className="space-y-5"
        onSubmit={form.onSubmit((values) => submitForm(values))}
      >
        <TextInput
          label="Username"
          placeholder="Username"
          {...form.getInputProps("username")}
        />
        <TextInput
          label="Email"
          placeholder="Email"
          type="email"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          visibilityToggleIcon={({ reveal }) =>
            reveal ? <IconEyeOff /> : <IconEyeCheck />
          }
          label="Password"
          placeholder="Password"
          {...form.getInputProps("password")}
        />
        <PasswordInput
          visibilityToggleIcon={({ reveal }) =>
            reveal ? <IconEyeOff /> : <IconEyeCheck />
          }
          label="Confirm Password"
          placeholder="Confirm Password"
          {...form.getInputProps("confirmPassword")}
        />
        <div className="flex flex-grow justify-center">
          <Button type="submit">Register</Button>
        </div>
      </form>
      <div
        className="text-gray-500 text-sm text-center mt-6 cursor-pointer"
        onClick={() => router.push("/login")}
      >
        <p>Already Have an account, Sign In!</p>
      </div>
    </Card>
  );
}

export default RegisterComponent;
