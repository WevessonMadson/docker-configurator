export interface ComposeParams {
  DATABASE_IP: string;
  DATABASE_PORTA: string;
  DATABASE_NOME: string;
  DATABASE_USUARIO: string;
  DATABASE_SENHA: string;
  SYSTEM_NUMEROLOJA: string;
  RABBITMQ_IP: string;
}

const KEYS: (keyof ComposeParams)[] = [
  "DATABASE_IP",
  "DATABASE_PORTA",
  "DATABASE_NOME",
  "DATABASE_USUARIO",
  "DATABASE_SENHA",
  "SYSTEM_NUMEROLOJA",
  "RABBITMQ_IP",
];

/**
 * Replaces only the values of the known KEY= entries inside the YAML content,
 * preserving everything else (quoting style, indentation, comments, etc.).
 *
 * Matches patterns like:
 *   - DATABASE_IP=...
 *   - "DATABASE_IP=..."
 *   - 'DATABASE_IP=...'
 * Whether they appear in `environment:` list form or as raw strings.
 */
export function applyComposeParams(yaml: string, params: ComposeParams): string {
  let out = yaml;
  for (const key of KEYS) {
    const value = params[key] ?? "";
    // Match KEY= followed by optional value until end of line or closing quote.
    // Handles: KEY=value | "KEY=value" | 'KEY=value'
    const re = new RegExp(
      `(${escapeRegex(key)}=)([^"'\\r\\n]*)`,
      "g",
    );
    out = out.replace(re, (_m, prefix) => `${prefix}${value}`);
  }
  return out;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
