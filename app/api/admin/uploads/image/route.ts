import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminSupabaseEnv, getAdminUser } from "@/lib/admin-server";

const BUCKET = "article-images";
const MAX_BYTES = 6 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extensionFor(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

async function ensureBucket(url: string, key: string) {
  const response = await fetch(new URL("/storage/v1/bucket", url), {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      id: BUCKET,
      name: BUCKET,
      public: true,
      file_size_limit: MAX_BYTES,
      allowed_mime_types: [...ALLOWED_TYPES]
    }),
    cache: "no-store"
  });
  // Supabase returns an error when the bucket already exists. That is fine.
  if (response.ok || response.status === 400 || response.status === 409) return;
  throw new Error(`Nepavyko paruošti nuotraukų saugyklos (HTTP ${response.status}).`);
}

export async function POST(request: NextRequest) {
  const user = await getAdminUser(request);
  if (!user) return NextResponse.json({ error: "Prisijungimo sesija baigėsi." }, { status: 401 });

  const { url, serviceRoleKey } = getAdminSupabaseEnv();
  if (!url || !serviceRoleKey) return NextResponse.json({ error: "Nuotraukų saugykla dar nesukonfigūruota." }, { status: 500 });

  const formData = await request.formData();
  const file = formData.get("image");
  if (!(file instanceof File)) return NextResponse.json({ error: "Pasirinkite nuotraukos failą." }, { status: 400 });
  if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: "Leidžiami JPG, PNG, WebP ir GIF failai." }, { status: 400 });
  if (!file.size || file.size > MAX_BYTES) return NextResponse.json({ error: "Nuotrauka turi būti iki 6 MB dydžio." }, { status: 400 });

  try {
    await ensureBucket(url, serviceRoleKey);
    const path = `manual/${Date.now()}-${randomUUID()}.${extensionFor(file.type)}`;
    const upload = await fetch(new URL(`/storage/v1/object/${BUCKET}/${path}`, url), {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": file.type,
        "x-upsert": "false",
        "cache-control": "31536000"
      },
      body: file,
      cache: "no-store"
    });
    if (!upload.ok) {
      const details = await upload.text();
      return NextResponse.json({ error: `Nuotraukos įkelti nepavyko: ${details || `HTTP ${upload.status}`}` }, { status: 502 });
    }
    return NextResponse.json({ url: new URL(`/storage/v1/object/public/${BUCKET}/${path}`, url).toString(), path });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nuotraukos įkelti nepavyko.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
