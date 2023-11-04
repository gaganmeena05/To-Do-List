import { Button, Card, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEyeCheck, IconEyeOff } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

function LoginComponent() {
  const form = useForm({
    initialValues: { email: "", password: "" },
    validateInputOnBlur: true,
    validate: {
      email: (value) =>
        !value.includes("@") ? "Please enter a valid email address" : null,
    },
  });

  const router = useRouter();

  const submitForm = async (values) => {
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: "/",
    });

    if (!res.ok) {
      form.setFieldError(
        "email",
        "Email and Password combination does not exist"
      );
      form.setFieldError(
        "password",
        "Email and Password combination does not exist"
      );
      return;
    }
    window.location.href = "/";
  };

  return (
    <Card className="w-full lg:w-1/3 md:w-1/2">
      <h1 className="text-center font-medium text-2xl">Log In</h1>
      <form
        className="space-y-5"
        onSubmit={form.onSubmit((values) => submitForm(values))}
      >
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
        <div className="flex flex-grow justify-center">
          <Button type="submit">Login</Button>
        </div>
      </form>
      <p className="text-gray-500 text-sm text-center mt-6 cursor-pointer" onClick={()=>router.push("/register")}>Register with us now!</p>
    </Card>
  );
}

export default LoginComponent;
