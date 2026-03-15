import ResultadoView from "@/components/result/ResultadoView";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function ResultadoPage({ searchParams }: Props) {
  const params = await searchParams;
  return <ResultadoView participantId={params.id ?? ""} />;
}
