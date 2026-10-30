import { createFileRoute } from "@tanstack/react-router";
import { PromptForge } from "@/components/prompt-forge";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <PromptForge />;
}
