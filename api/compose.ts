export const config = { runtime: "edge" };

const COMPOSE_URL =
  "https://storage.googleapis.com/docker-compose-yml/docker-compose-vrmobileserver.yml";

export default async function handler(_req: Request): Promise<Response> {
  try {
    const res = await fetch(COMPOSE_URL, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `Falha ao buscar compose remoto (${res.status})` }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    }
    const text = await res.text();
    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "text/yaml; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Erro desconhecido" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
