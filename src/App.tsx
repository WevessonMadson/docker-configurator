import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Loader2, Download, Copy, RefreshCw, FileCode2 } from "lucide-react";
import { applyComposeParams, type ComposeParams } from "@/lib/compose-generator";
import { InstallGuide } from "@/components/InstallGuide";

const DEFAULTS: ComposeParams = {
  DATABASE_IP: "",
  DATABASE_PORTA: "8745",
  DATABASE_NOME: "vr",
  DATABASE_USUARIO: "postgres",
  DATABASE_SENHA: "",
  SYSTEM_NUMEROLOJA: "1",
  RABBITMQ_IP: "",
};

export default function App() {
  const [yamlSource, setYamlSource] = useState<string>("");
  const [loadingSource, setLoadingSource] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [params, setParams] = useState<ComposeParams>(DEFAULTS);
  const [generated, setGenerated] = useState<string>("");

  const fetchCompose = async () => {
    setLoadingSource(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/compose", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      setYamlSource(text);
    } catch (e) {
      const msg = (e as Error).message;
      setLoadError(msg);
      toast.error("Falha ao carregar compose remoto", { description: msg });
    } finally {
      setLoadingSource(false);
    }
  };

  useEffect(() => {
    void fetchCompose();
  }, []);

  const update = <K extends keyof ComposeParams>(k: K, v: string) =>
    setParams((p) => ({ ...p, [k]: v }));

  const missingRequired = useMemo(() => {
    const req: (keyof ComposeParams)[] = [
      "DATABASE_IP",
      "DATABASE_SENHA",
      "RABBITMQ_IP",
      "SYSTEM_NUMEROLOJA",
      "DATABASE_USUARIO",
      "DATABASE_PORTA",
      "DATABASE_NOME",
    ];
    return req.filter((k) => !params[k].trim());
  }, [params]);

  const handleGenerate = () => {
    if (!yamlSource) {
      toast.error("Compose remoto ainda não carregado");
      return;
    }
    if (missingRequired.length > 0) {
      toast.error("Preencha os campos obrigatórios", {
        description: missingRequired.join(", "),
      });
      return;
    }
    try {
      const out = applyComposeParams(yamlSource, params);
      setGenerated(out);
      toast.success("Compose gerado com sucesso");
    } catch (e) {
      toast.error("Erro ao gerar arquivo", { description: (e as Error).message });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generated);
      toast.success("Conteúdo copiado");
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generated], { type: "text/yaml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "docker-compose-vrmobileserver.yml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-3">
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <FileCode2 className="h-3.5 w-3.5" />
              VRMobileServer
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Gerador do Docker Compose
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Preencha os parâmetros de ambiente e gere a versão personalizada do
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                docker-compose-vrmobileserver.yml
              </code>
              . O arquivo base é sempre carregado da da VR, sendo sempre a última versão.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCompose}
            disabled={loadingSource}
          >
            {loadingSource ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Recarregar base</span>
          </Button>
        </header>

        <Tabs defaultValue="generator" className="mt-6">
          <TabsList>
            <TabsTrigger value="generator">Gerador</TabsTrigger>
            <TabsTrigger value="guide">Guia de Instalação</TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            {loadError && (
              <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                Falha ao carregar o compose remoto: {loadError}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Parâmetros</CardTitle>
                <CardDescription>
                  Campos marcados com <span className="text-destructive">*</span> são obrigatórios.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Field
                    label="DATABASE_IP"
                    required
                    value={params.DATABASE_IP}
                    onChange={(v) => update("DATABASE_IP", v)}
                    placeholder="ex: 192.168.0.10"
                  />
                  <Field
                    label="DATABASE_PORTA"
                    required
                    type="number"
                    value={params.DATABASE_PORTA}
                    onChange={(v) => update("DATABASE_PORTA", v)}
                  />
                  <Field
                    label="DATABASE_NOME"
                    required
                    value={params.DATABASE_NOME}
                    onChange={(v) => update("DATABASE_NOME", v)}
                  />
                  <Field
                    label="DATABASE_USUARIO"
                    required
                    value={params.DATABASE_USUARIO}
                    onChange={(v) => update("DATABASE_USUARIO", v)}
                  />
                  <Field
                    label="DATABASE_SENHA"
                    required
                    value={params.DATABASE_SENHA}
                    onChange={(v) => update("DATABASE_SENHA", v)}
                    placeholder="senha do banco"
                  />
                  <Field
                    label="SYSTEM_NUMEROLOJA"
                    required
                    type="number"
                    value={params.SYSTEM_NUMEROLOJA}
                    onChange={(v) => update("SYSTEM_NUMEROLOJA", v)}
                  />
                  <Field
                    label="RABBITMQ_IP (Manager IP)"
                    required
                    value={params.RABBITMQ_IP}
                    onChange={(v) => update("RABBITMQ_IP", v)}
                    placeholder="ex: 192.168.0.20"
                  />
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button onClick={handleGenerate} disabled={loadingSource || !yamlSource}>
                    {loadingSource && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Gerar Compose
                  </Button>
                  {generated && (
                    <>
                      <Button variant="secondary" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Baixar Docker Compose
                      </Button>
                      <Button variant="outline" onClick={handleCopy}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {generated && (
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>Pré-visualização</CardTitle>
                  <CardDescription>
                    Conteúdo final do <code>docker-compose-vrmobileserver.yml</code>.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="max-h-[28rem] overflow-auto rounded-md border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed">
                    <code>{generated}</code>
                  </pre>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="guide">
            <InstallGuide />
          </TabsContent>
        </Tabs>

        <footer className="mt-3 text-center text-xs text-muted-foreground">
          Nenhum dado informado é armazenado. O arquivo é gerado localmente no seu navegador.
        </footer>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: "text" | "number";
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={label} className="font-mono text-xs">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={label}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="font-mono text-sm"
      />
    </div>
  );
}
