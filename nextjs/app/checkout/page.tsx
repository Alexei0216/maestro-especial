import type { Metadata } from "next";
import Container from "@/components/layouts/Container";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finaliza tu pedido en Maestro Especial.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-[calc(100vh-76px)] bg-[#f8f6ef] py-10 text-neutral-950 lg:py-14">
      <Container>
        <CheckoutForm />
      </Container>
    </main>
  );
}
