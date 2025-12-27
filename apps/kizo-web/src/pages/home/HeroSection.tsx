import { HeroContent } from "@kizo/ui";
import { useAppNavigation } from "../../utils/useAppNavigation";
import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setSignupEmail } from "@kizo/store";
import { regex } from "../../../shared/validators";

export function HeroSection() {
  const dispatch = useAppDispatch();
  const { goToSignUp } = useAppNavigation();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const isValid = regex.email.test(email);

  const handleSubmit = () => {
    if (!isValid) {
      setError("Please enter a valid email address");
      return;
    }
    dispatch(setSignupEmail(email));
    goToSignUp();
  };

  return (
    <HeroContent
      email={email}
      error={error}
      isValid={isValid}
      onEmailChange={(e) => setEmail(e.target.value)}
      onSubmit={handleSubmit}
      onPrimary={goToSignUp}
    />
  );
}
