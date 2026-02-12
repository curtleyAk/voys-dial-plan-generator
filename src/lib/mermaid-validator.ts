export interface MermaidValidationResult {
  valid: boolean;
  errors: string[];
  sanitized: string;
}

export function validateMermaidSyntax(
  mermaidCode: string,
): MermaidValidationResult {
  const errors: string[] = [];
  let sanitized = mermaidCode;

  // Rule 1: Fix arrow syntax (Mermaid needs --> not ->)
  if (sanitized.includes("->") && !sanitized.includes("-->")) {
    errors.push("Invalid arrow syntax");
    sanitized = sanitized.replace(/->/g, "-->");
  }

  // Rule 2: Quote labels with spaces (e.g. [Call Arrives] -> ["Call Arrives"])
  // This regex finds brackets containing spaces that aren't already quoted
  const unquotedLabelRegex = /\[(?!"|')([^\]]*\s[^\]]*)(?!"|')\]/g;
  if (unquotedLabelRegex.test(sanitized)) {
    errors.push("Unquoted labels with spaces");
    sanitized = sanitized.replace(unquotedLabelRegex, '["$1"]');
  }

  // Rule 3: Quote edge labels (e.g. |Yes| -> |"Yes"|)
  const unquotedEdgeRegex = /\|([^"|]+)\|/g;
  if (unquotedEdgeRegex.test(sanitized)) {
    // Only replace if it doesn't look like a boolean or number
    sanitized = sanitized.replace(unquotedEdgeRegex, '|"$1"|');
  }

  // Rule 4: Ensure graph declaration exists
  if (!sanitized.trim().startsWith("graph")) {
    sanitized = "graph TD\n" + sanitized;
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized,
  };
}
