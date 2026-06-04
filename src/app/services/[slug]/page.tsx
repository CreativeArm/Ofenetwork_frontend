import { notFound } from "next/navigation";
import { AppShell } from "../../../components/shell";
import { ServiceWorkspace } from "../../../components/service-workspace";
import { serviceConfigs, type UserServiceSlug } from "../../../lib/mock-data";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = serviceConfigs.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <AppShell activeSlug={slug as UserServiceSlug}>
      <ServiceWorkspace activeSlug={slug as UserServiceSlug} />
    </AppShell>
  );
}
