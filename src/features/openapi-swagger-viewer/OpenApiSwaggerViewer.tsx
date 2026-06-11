import { useState, useMemo } from "react";
import YAML from "yaml";
import Button from "../../ui/Button";
import CopyButton from "../../ui/CopyButton";
import ToolTextarea from "../../components/tool/ToolTextarea";

// Helper to resolve ref schema from components
function resolveRef(ref: string, components: any): any {
  if (!ref || !ref.startsWith("#/components/")) return null;
  const parts = ref.split("/");
  let current = components;
  for (let i = 2; i < parts.length; i++) {
    if (!current) return null;
    current = current[parts[i]];
  }
  return current;
}

// Generate sample JSON structure recursively from OpenAPI schema
function generateSampleJson(schema: any, components: any, visited = new Set<string>()): any {
  if (!schema) return null;

  if (schema.$ref) {
    if (visited.has(schema.$ref)) return {}; // Prevent infinite recursion
    const resolved = resolveRef(schema.$ref, components);
    if (!resolved) return {};
    visited.add(schema.$ref);
    const result = generateSampleJson(resolved, components, visited);
    visited.delete(schema.$ref);
    return result;
  }

  if (schema.type === "object") {
    const obj: any = {};
    if (schema.properties) {
      for (const [key, value] of Object.entries(schema.properties)) {
        obj[key] = generateSampleJson(value, components, visited);
      }
    }
    return obj;
  }

  if (schema.type === "array") {
    return [generateSampleJson(schema.items, components, visited)];
  }

  if (schema.example !== undefined) return schema.example;
  if (schema.default !== undefined) return schema.default;

  switch (schema.type) {
    case "string":
      if (schema.format === "date-time") return new Date().toISOString();
      return "string";
    case "integer":
    case "number":
      return 0;
    case "boolean":
      return true;
    default:
      return null;
  }
}

// Generate copyable mockup curl command
function generateCurl(path: string, method: string, operation: any, components: any, serverUrl: string): string {
  const base = serverUrl || "https://api.example.com";
  let finalPath = path;

  // Resolve path parameters
  if (operation.parameters) {
    const pathParams = operation.parameters.filter((p: any) => p.in === "path");
    pathParams.forEach((p: any) => {
      const name = p.name;
      const example = p.example || p.schema?.example || `{${name}}`;
      finalPath = finalPath.replace(`{${name}}`, example);
    });
  }

  // Resolve query parameters
  const queryParts: string[] = [];
  if (operation.parameters) {
    const queryParams = operation.parameters.filter((p: any) => p.in === "query");
    queryParams.forEach((p: any) => {
      const name = p.name;
      const example = p.example || p.schema?.example || "value";
      queryParts.push(`${name}=${encodeURIComponent(example)}`);
    });
  }

  const queryStr = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  let curl = `curl -X ${method.toUpperCase()} "${base}${finalPath}${queryStr}"`;

  // Add JSON request body if present
  if (operation.requestBody) {
    const content = operation.requestBody.content;
    if (content && content["application/json"]) {
      const schema = content["application/json"].schema;
      const sampleObj = generateSampleJson(schema, components);
      const jsonStr = JSON.stringify(sampleObj, null, 2);
      curl += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${jsonStr.replace(/'/g, "'\\''")}'`;
    }
  }

  return curl;
}

// Recursive React component to render OpenAPI Schemas
function SchemaItem({
  name,
  schema,
  components,
  required,
  depth = 0,
}: {
  name?: string;
  schema: any;
  components: any;
  required?: boolean;
  depth?: number;
}) {
  if (!schema) return null;

  let resolvedSchema = { ...schema };
  if (schema.$ref) {
    const refSchema = resolveRef(schema.$ref, components);
    if (refSchema) {
      resolvedSchema = { ...refSchema, ...schema };
    }
  }

  const hasChildren = resolvedSchema.type === "object" && resolvedSchema.properties;
  const isArray = resolvedSchema.type === "array" && resolvedSchema.items;

  let typeLabel = resolvedSchema.type || "any";
  if (isArray) {
    let itemType = resolvedSchema.items.type || "any";
    if (resolvedSchema.items.$ref) {
      const refName = resolvedSchema.items.$ref.split("/").pop();
      itemType = refName || "object";
    }
    typeLabel = `array of ${itemType}`;
  } else if (resolvedSchema.type === "object" && resolvedSchema.properties && schema.$ref) {
    const refName = schema.$ref.split("/").pop();
    typeLabel = refName || "object";
  }

  return (
    <div className="text-sm font-sans" style={{ paddingLeft: depth > 0 ? "1.25rem" : "0" }}>
      <div className="flex flex-wrap items-baseline gap-2 py-1.5 border-b border-border/40 hover:bg-muted/10 rounded px-1">
        {name && <span className="font-mono text-accent font-semibold">{name}</span>}
        <span className="text-xs font-mono text-muted bg-surface border border-border px-1.5 py-0.5 rounded">
          {typeLabel}
        </span>
        {required && <span className="text-[10px] text-danger font-semibold uppercase">required</span>}
        {resolvedSchema.default !== undefined && (
          <span className="text-xs text-secondary italic">
            default: <code className="bg-surface px-1 py-0.5 rounded">{String(resolvedSchema.default)}</code>
          </span>
        )}
        {resolvedSchema.description && (
          <span className="text-xs text-secondary ml-1">{resolvedSchema.description}</span>
        )}
      </div>
      {hasChildren && (
        <div className="border-l border-border/60 pl-2 mt-1 space-y-1">
          {Object.keys(resolvedSchema.properties).map((propName) => {
            const isPropRequired =
              Array.isArray(resolvedSchema.required) && resolvedSchema.required.includes(propName);
            return (
              <SchemaItem
                key={propName}
                name={propName}
                schema={resolvedSchema.properties[propName]}
                components={components}
                required={isPropRequired}
                depth={depth + 1}
              />
            );
          })}
        </div>
      )}
      {isArray && resolvedSchema.items && (resolvedSchema.items.type === "object" || resolvedSchema.items.$ref) && (
        <div className="border-l border-border/60 pl-2 mt-1">
          <SchemaItem schema={resolvedSchema.items} components={components} depth={depth + 1} />
        </div>
      )}
    </div>
  );
}

const SAMPLE_SPEC = `openapi: 3.0.0
info:
  title: User Directory API
  description: A sample API to manage users, roles, and retrieve profile information.
  version: 1.0.0
servers:
  - url: https://api.userdirectory.com/v1
    description: Production Server
  - url: https://staging-api.userdirectory.com/v1
    description: Staging Server
paths:
  /users:
    get:
      summary: Retrieve a list of users
      description: Returns a paginated list of users. You can filter by role or status.
      tags:
        - Users
      parameters:
        - name: limit
          in: query
          description: Max number of users to return
          required: false
          schema:
            type: integer
            default: 10
            example: 20
        - name: role
          in: query
          description: Filter users by role
          required: false
          schema:
            type: string
            enum: [admin, member, guest]
            example: member
      responses:
        '200':
          description: Successful response returning list of users
          content:
            application/json:
              schema:
                type: object
                properties:
                  total:
                    type: integer
                    example: 120
                  users:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
        '401':
          description: Unauthorized request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
    post:
      summary: Create a new user
      description: Register a new user in the directory.
      tags:
        - Users
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserCreateInput'
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          description: Bad request (validation failed)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
  /users/{id}:
    get:
      summary: Get user by ID
      description: Retrieve profile information for a specific user.
      tags:
        - Users
      parameters:
        - name: id
          in: path
          description: Unique identifier of the user
          required: true
          schema:
            type: string
            example: "usr_998822"
      responses:
        '200':
          description: Profile information retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: User not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
    delete:
      summary: Delete user
      description: Permanently delete a user from the directory.
      tags:
        - Users
      parameters:
        - name: id
          in: path
          description: Unique identifier of the user
          required: true
          schema:
            type: string
            example: "usr_998822"
      responses:
        '204':
          description: User deleted successfully
        '404':
          description: User not found
components:
  schemas:
    User:
      type: object
      required:
        - id
        - email
        - name
        - role
      properties:
        id:
          type: string
          description: Unique identifier of the user
          example: "usr_998822"
        email:
          type: string
          description: Email address of the user
          example: "john.doe@example.com"
        name:
          type: string
          description: Full name of the user
          example: "John Doe"
        role:
          type: string
          description: Access role of the user
          example: "member"
        createdAt:
          type: string
          description: Timestamp when the user was created
          example: "2026-06-11T09:44:43Z"
    UserCreateInput:
      type: object
      required:
        - email
        - name
      properties:
        email:
          type: string
          description: Email address for the new account
          example: "jane.smith@example.com"
        name:
          type: string
          description: Full name of the new user
          example: "Jane Smith"
        role:
          type: string
          description: Default role to assign
          default: "member"
          example: "member"
    ErrorResponse:
      type: object
      required:
        - code
        - message
      properties:
        code:
          type: string
          example: "INVALID_REQUEST"
        message:
          type: string
          example: "The request body failed validation checks."
`;

export default function OpenApiSwaggerViewer() {
  const [inputSpec, setInputSpec] = useState(SAMPLE_SPEC);
  const [parsedSpec, setParsedSpec] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEndpoints, setExpandedEndpoints] = useState<Record<string, boolean>>({});

  // Parse Spec trigger
  const handleParse = (value: string) => {
    setError(null);
    if (!value.trim()) {
      setParsedSpec(null);
      return;
    }
    try {
      let parsed: any;
      try {
        parsed = JSON.parse(value);
      } catch {
        parsed = YAML.parse(value);
      }

      if (!parsed || typeof parsed !== "object") {
        throw new Error("Parsed spec is not a valid OpenAPI Object.");
      }
      if (!parsed.openapi && !parsed.swagger) {
        throw new Error("Could not find openapi or swagger key in specification.");
      }

      setParsedSpec(parsed);
      // Auto expand all by default
      const initialExpand: Record<string, boolean> = {};
      if (parsed.paths) {
        Object.keys(parsed.paths).forEach((p) => {
          Object.keys(parsed.paths[p]).forEach((m) => {
            initialExpand[`${m}-${p}`] = true;
          });
        });
      }
      setExpandedEndpoints(initialExpand);
    } catch (err: any) {
      setError(err.message || "Failed to parse JSON/YAML.");
      setParsedSpec(null);
    }
  };

  // Run initial parse on sample load
  useMemo(() => {
    handleParse(inputSpec);
  }, []);

  const handleClear = () => {
    setInputSpec("");
    setParsedSpec(null);
    setError(null);
  };

  const handleLoadSample = () => {
    setInputSpec(SAMPLE_SPEC);
    handleParse(SAMPLE_SPEC);
  };

  // Grouped and filtered endpoints
  const groupedEndpoints = useMemo(() => {
    if (!parsedSpec || !parsedSpec.paths) return [];

    const endpoints: any[] = [];
    Object.entries(parsedSpec.paths).forEach(([pathName, pathObj]: [string, any]) => {
      Object.entries(pathObj).forEach(([methodName, operationObj]: [string, any]) => {
        // Only accept HTTP Methods
        if (!["get", "post", "put", "delete", "patch", "options", "head"].includes(methodName.toLowerCase())) {
          return;
        }

        const tags = operationObj.tags || ["Default"];
        tags.forEach((tag: string) => {
          endpoints.push({
            tag,
            path: pathName,
            method: methodName.toUpperCase(),
            operation: operationObj,
          });
        });
      });
    });

    // Filter by query
    const filtered = endpoints.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        item.path.toLowerCase().includes(q) ||
        item.method.toLowerCase().includes(q) ||
        (item.operation.summary && item.operation.summary.toLowerCase().includes(q)) ||
        (item.operation.description && item.operation.description.toLowerCase().includes(q))
      );
    });

    // Group by tag name
    const groups: Record<string, any[]> = {};
    filtered.forEach((item) => {
      if (!groups[item.tag]) {
        groups[item.tag] = [];
      }
      groups[item.tag].push(item);
    });

    return Object.entries(groups).map(([tag, items]) => ({
      tag,
      items,
    }));
  }, [parsedSpec, searchQuery]);

  // Styling helper for HTTP methods
  const getMethodBadge = (method: string) => {
    const base = "px-2.5 py-1 text-xs font-bold rounded-md font-mono border uppercase tracking-wider ";
    switch (method) {
      case "GET":
        return base + "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "POST":
        return base + "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "PUT":
        return base + "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "PATCH":
        return base + "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "DELETE":
        return base + "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default:
        return base + "text-secondary bg-elevated border-border";
    }
  };

  const toggleEndpoint = (key: string) => {
    setExpandedEndpoints((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const activeServerUrl = parsedSpec?.servers?.[0]?.url || "";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor (Left Column) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-border bg-surface p-4 flex flex-col space-y-4 shadow-sm">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <span className="text-sm font-semibold text-secondary">Swagger Specification</span>
              <div className="flex gap-2">
                <button
                  onClick={handleLoadSample}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-all active:scale-95"
                >
                  Load Example
                </button>
                <button
                  onClick={handleClear}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-elevated text-secondary hover:bg-border transition-all active:scale-95"
                >
                  Clear
                </button>
              </div>
            </div>

            <ToolTextarea
              value={inputSpec}
              onChange={(val) => {
                setInputSpec(val);
                handleParse(val);
              }}
              placeholder="Paste your OpenAPI spec (YAML or JSON) here..."
              rows={25}
            />

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-500 text-xs font-mono whitespace-pre-wrap">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Documentation Viewer (Right Column) */}
        <div className="lg:col-span-7 space-y-6">
          {!parsedSpec ? (
            <div className="rounded-xl border border-border border-dashed bg-surface/50 p-12 text-center text-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-3 text-muted/60"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
                <path d="M6 14h10" />
              </svg>
              <h3 className="font-semibold text-primary mb-1">No API Spec Loaded</h3>
              <p className="text-sm">Paste a valid OpenAPI 3.0 configuration or load the example to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overview Card */}
              <div className="rounded-xl border border-border bg-surface p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="text-xl font-bold text-primary">{parsedSpec.info?.title || "API Documentation"}</h3>
                  {parsedSpec.info?.version && (
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/20">
                      v{parsedSpec.info.version}
                    </span>
                  )}
                </div>

                {parsedSpec.info?.description && (
                  <p className="text-sm text-secondary leading-relaxed">{parsedSpec.info.description}</p>
                )}

                {parsedSpec.servers && parsedSpec.servers.length > 0 && (
                  <div className="pt-3 border-t border-border/60">
                    <span className="text-xs font-semibold text-secondary block mb-1">Servers</span>
                    <div className="space-y-1.5">
                      {parsedSpec.servers.map((server: any, idx: number) => (
                        <div key={idx} className="flex flex-wrap items-center gap-2 text-xs font-mono">
                          <code className="bg-ground border border-border px-2 py-1 rounded text-accent">
                            {server.url}
                          </code>
                          {server.description && (
                            <span className="text-muted">({server.description})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Endpoints & Search */}
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search operations by path, method, or description..."
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 pl-10 text-sm outline-none focus:border-accent/50"
                  />
                  <div className="absolute left-3.5 top-3.5 text-muted pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                </div>

                {groupedEndpoints.length === 0 ? (
                  <div className="text-center py-6 text-muted text-sm border border-border border-dashed rounded-xl bg-surface/35">
                    No matching endpoints found.
                  </div>
                ) : (
                  groupedEndpoints.map((group) => (
                    <div key={group.tag} className="space-y-3">
                      <h4 className="text-xs font-bold text-muted uppercase tracking-wider pl-1">{group.tag}</h4>

                      <div className="space-y-2">
                        {group.items.map((endpoint) => {
                          const key = `${endpoint.method.toLowerCase()}-${endpoint.path}`;
                          const isExpanded = !!expandedEndpoints[key];

                          return (
                            <div
                              key={key}
                              className={`rounded-xl border border-border bg-surface transition-all overflow-hidden ${
                                isExpanded ? "shadow-sm border-border-hover" : ""
                              }`}
                            >
                              {/* Accordion Trigger */}
                              <button
                                onClick={() => toggleEndpoint(key)}
                                className="w-full flex items-center justify-between p-3.5 text-left hover:bg-muted/10 transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className={getMethodBadge(endpoint.method)}>{endpoint.method}</span>
                                  <code className="text-sm font-semibold font-mono text-primary truncate">
                                    {endpoint.path}
                                  </code>
                                  {endpoint.operation.summary && (
                                    <span className="text-xs text-secondary hidden md:inline truncate pl-1">
                                      — {endpoint.operation.summary}
                                    </span>
                                  )}
                                </div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  className={`text-muted transition-transform duration-200 ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                >
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              </button>

                              {/* Accordion Content */}
                              {isExpanded && (
                                <div className="p-4 border-t border-border space-y-5 bg-ground/25 animate-in fade-in duration-200">
                                  {/* Description */}
                                  {endpoint.operation.description && (
                                    <div className="text-sm text-secondary leading-relaxed bg-surface/35 p-3 rounded-lg border border-border/50">
                                      {endpoint.operation.description}
                                    </div>
                                  )}

                                  {/* Copy Path Helper */}
                                  <div className="flex gap-2 items-center text-xs font-mono bg-surface border border-border px-3 py-2 rounded-lg justify-between">
                                    <span className="truncate text-secondary">
                                      Endpoint Path: <code className="text-primary font-bold">{endpoint.path}</code>
                                    </span>
                                    <CopyButton value={endpoint.path} />
                                  </div>

                                  {/* Parameters */}
                                  {endpoint.operation.parameters &&
                                    endpoint.operation.parameters.length > 0 && (
                                      <div className="space-y-2">
                                        <h5 className="text-xs font-bold uppercase tracking-wider text-muted">
                                          Parameters
                                        </h5>
                                        <div className="overflow-x-auto border border-border rounded-lg bg-surface">
                                          <table className="w-full text-left text-sm border-collapse">
                                            <thead>
                                              <tr className="bg-muted/30 border-b border-border text-secondary font-semibold">
                                                <th className="p-2.5">Name</th>
                                                <th className="p-2.5">Located In</th>
                                                <th className="p-2.5">Type</th>
                                                <th className="p-2.5">Required</th>
                                                <th className="p-2.5">Description</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {endpoint.operation.parameters.map((param: any, pIdx: number) => (
                                                <tr key={pIdx} className="border-b border-border/40 last:border-0">
                                                  <td className="p-2.5 font-mono font-bold text-accent">
                                                    {param.name}
                                                  </td>
                                                  <td className="p-2.5 text-xs text-secondary capitalize">
                                                    {param.in}
                                                  </td>
                                                  <td className="p-2.5 font-mono text-xs text-secondary">
                                                    {param.schema?.type || "any"}
                                                  </td>
                                                  <td className="p-2.5 text-xs">
                                                    {param.required ? (
                                                      <span className="text-danger font-semibold uppercase text-[10px]">
                                                        yes
                                                      </span>
                                                    ) : (
                                                      <span className="text-muted text-[10px]">no</span>
                                                    )}
                                                  </td>
                                                  <td className="p-2.5 text-xs text-secondary">
                                                    {param.description}
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    )}

                                  {/* Request Body */}
                                  {endpoint.operation.requestBody && (
                                    <div className="space-y-2">
                                      <h5 className="text-xs font-bold uppercase tracking-wider text-muted">
                                        Request Body
                                      </h5>
                                      {endpoint.operation.requestBody.description && (
                                        <p className="text-xs text-secondary">
                                          {endpoint.operation.requestBody.description}
                                        </p>
                                      )}
                                      {Object.entries(endpoint.operation.requestBody.content || {}).map(
                                        ([mediaType, contentObj]: [string, any]) => (
                                          <div key={mediaType} className="space-y-1.5">
                                            <span className="text-xs font-mono font-semibold bg-surface border border-border px-2 py-0.5 rounded text-accent">
                                              {mediaType}
                                            </span>
                                            {contentObj.schema && (
                                              <div className="border border-border/50 rounded-lg p-3 bg-surface/30">
                                                <SchemaItem
                                                  schema={contentObj.schema}
                                                  components={parsedSpec.components}
                                                />
                                              </div>
                                            )}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}

                                  {/* Responses */}
                                  {endpoint.operation.responses && (
                                    <div className="space-y-2">
                                      <h5 className="text-xs font-bold uppercase tracking-wider text-muted">
                                        Responses
                                      </h5>
                                      <div className="space-y-3">
                                        {Object.entries(endpoint.operation.responses).map(
                                          ([statusCode, responseObj]: [string, any]) => {
                                            const isSuccess = statusCode.startsWith("2");
                                            const isError = statusCode.startsWith("4") || statusCode.startsWith("5");
                                            let codeBadge =
                                              "px-2 py-0.5 text-xs font-bold rounded-md font-mono border ";
                                            if (isSuccess) {
                                              codeBadge += "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
                                            } else if (isError) {
                                              codeBadge += "text-rose-500 bg-rose-500/10 border-rose-500/20";
                                            } else {
                                              codeBadge += "text-secondary bg-elevated border-border";
                                            }

                                            return (
                                              <div
                                                key={statusCode}
                                                className="border border-border/60 rounded-xl p-3 bg-surface/20 space-y-2"
                                              >
                                                <div className="flex items-center gap-3">
                                                  <span className={codeBadge}>{statusCode}</span>
                                                  <span className="text-xs text-secondary font-medium">
                                                    {responseObj.description}
                                                  </span>
                                                </div>

                                                {responseObj.content &&
                                                  Object.entries(responseObj.content).map(
                                                    ([resMediaType, resContentObj]: [string, any]) => (
                                                      <div key={resMediaType} className="space-y-1.5 pl-2 pt-1 border-l-2 border-border/40">
                                                        <span className="text-xs font-mono font-semibold bg-surface border border-border px-1.5 py-0.5 rounded text-accent">
                                                          {resMediaType}
                                                        </span>
                                                        {resContentObj.schema && (
                                                          <div className="border border-border/50 rounded-lg p-2 bg-surface/30">
                                                            <SchemaItem
                                                              schema={resContentObj.schema}
                                                              components={parsedSpec.components}
                                                            />
                                                          </div>
                                                        )}
                                                      </div>
                                                    )
                                                  )}
                                              </div>
                                            );
                                          }
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Mock Curl Command */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <h5 className="text-xs font-bold uppercase tracking-wider text-muted">
                                        Mock Curl Request
                                      </h5>
                                      <CopyButton
                                        value={generateCurl(
                                          endpoint.path,
                                          endpoint.method,
                                          endpoint.operation,
                                          parsedSpec.components,
                                          activeServerUrl
                                        )}
                                      />
                                    </div>
                                    <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-primary max-h-48 custom-scrollbar">
                                      {generateCurl(
                                        endpoint.path,
                                        endpoint.method,
                                        endpoint.operation,
                                        parsedSpec.components,
                                        activeServerUrl
                                      )}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
