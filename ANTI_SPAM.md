# 🛡️ Protection Anti-Spam et Anti-Doublons - RSVP

## Vue d'ensemble

Le formulaire RSVP est **public** (sans authentification), ce qui le rend vulnérable au spam et aux abus. Voici les protections mises en place et recommandées.

---

## ✅ Protections Actuellement Implémentées

### 1. Anti-Doublons par Email

**Mécanisme** : Vérification de l'email avant insertion

```typescript
// src/app/actions/rsvp.ts
const { data: existingRSVP } = await supabase
  .from("rsvp")
  .select("id")
  .eq("guest_email", validatedData.guest_email)
  .maybeSingle();

if (existingRSVP) {
  // Mettre à jour au lieu d'insérer
  await supabase.from("rsvp").update(...).eq("guest_email", email);
}
```

**Avantages** :
- ✅ Empêche les doublons dans la DB
- ✅ Permet aux invités de modifier leur réponse
- ✅ UX améliorée (pas d'erreur "email déjà utilisé")

**Limites** :
- ⚠️ Quelqu'un peut modifier la réponse d'un autre s'il connaît son email

---

### 2. Validation Stricte des Données

**Validation côté client (HTML5)** :
```tsx
<input type="email" required minLength={2} maxLength={255} />
```

**Validation côté serveur (zod)** :
```typescript
const rsvpSchema = z.object({
  guest_name: z.string().min(2).max(255).trim(),
  guest_email: z.string().email().max(255).toLowerCase(),
  // ...
});
```

**Protection contre** :
- ✅ Données malformées
- ✅ Injection SQL (Supabase échappe automatiquement)
- ✅ XSS (React échappe automatiquement)
- ✅ Valeurs trop longues (limite DB)

---

### 3. Contrainte Unique en Base de Données

**À ajouter dans Supabase** (recommandé) :

```sql
-- Empêcher les doublons d'email en DB
ALTER TABLE public.rsvp 
ADD CONSTRAINT rsvp_email_unique UNIQUE (guest_email);
```

**Avantages** :
- ✅ Protection au niveau DB (infaillible)
- ✅ Gère les cas de race condition

**Note** : Actuellement, la gestion est faite en application, mais une contrainte DB est plus robuste.

---

## 🚧 Protections Recommandées (À Implémenter)

### 1. Rate Limiting ⭐ **Priorité Haute**

**Problème** : Un script peut soumettre des centaines de RSVP

**Solution A : Rate Limiting Simple (Server Action)**

```typescript
// src/lib/rate-limit.ts
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(identifier);

  // Reset toutes les 5 minutes
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + 5 * 60 * 1000,
    });
    return true;
  }

  // Max 3 soumissions par 5 minutes
  if (limit.count >= 3) {
    return false;
  }

  limit.count++;
  return true;
}
```

**Utilisation** :
```typescript
// src/app/actions/rsvp.ts
export async function submitRSVP(formData: FormData) {
  const email = formData.get("guest_email") as string;
  
  if (!checkRateLimit(email)) {
    return {
      success: false,
      message: "Trop de tentatives. Veuillez réessayer dans 5 minutes.",
    };
  }
  
  // ... reste du code
}
```

**Limites** :
- ⚠️ Mémoire en RAM (perdu au redémarrage)
- ⚠️ Inefficace en serverless (instance éphémère)

---

**Solution B : Rate Limiting avec Upstash Redis (Recommandé)**

```bash
npm install @upstash/ratelimit @upstash/redis
```

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "5 m"), // 3 requêtes / 5 min
});
```

**Utilisation** :
```typescript
export async function submitRSVP(formData: FormData) {
  const email = formData.get("guest_email") as string;
  const { success } = await ratelimit.limit(email);
  
  if (!success) {
    return { success: false, message: "Trop de tentatives." };
  }
  // ...
}
```

**Upstash Free Tier** :
- ✅ 10,000 commandes/jour gratuit
- ✅ Suffisant pour un site de mariage
- ✅ Compatible Vercel

---

### 2. Honeypot Field ⭐ **Priorité Moyenne**

**Concept** : Champ caché invisible pour les humains, rempli par les bots

```tsx
// src/components/rsvp/RSVPForm.tsx
<input
  type="text"
  name="website" // Nom qui attire les bots
  autoComplete="off"
  tabIndex={-1}
  style={{ position: 'absolute', left: '-9999px' }}
/>
```

```typescript
// src/app/actions/rsvp.ts
export async function submitRSVP(formData: FormData) {
  // Si le honeypot est rempli, c'est un bot
  if (formData.get("website")) {
    return { success: false, message: "Erreur de validation." };
  }
  // ...
}
```

**Avantages** :
- ✅ Simple à implémenter
- ✅ Gratuit
- ✅ Pas d'impact UX

**Limites** :
- ⚠️ Bots sophistiqués peuvent le détecter

---

### 3. CAPTCHA ⭐ **Priorité Basse** (si spam important)

**Option A : Google reCAPTCHA v3** (Invisible)

```bash
npm install react-google-recaptcha-v3
```

```tsx
// src/app/layout.tsx
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

<GoogleReCaptchaProvider reCaptchaKey="YOUR_SITE_KEY">
  {children}
</GoogleReCaptchaProvider>
```

```tsx
// src/components/rsvp/RSVPForm.tsx
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const { executeRecaptcha } = useGoogleReCaptcha();

const handleSubmit = async () => {
  const token = await executeRecaptcha("rsvp_submit");
  formData.set("recaptcha_token", token);
  // ...
};
```

```typescript
// src/app/actions/rsvp.ts
async function verifyRecaptcha(token: string): Promise<boolean> {
  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    }
  );
  const data = await response.json();
  return data.success && data.score > 0.5; // Score > 0.5 = humain probable
}
```

**Avantages** :
- ✅ Très efficace contre les bots
- ✅ Invisible (v3)

**Inconvénients** :
- ❌ Nécessite Google (RGPD)
- ❌ Gratuit jusqu'à 1M requêtes/mois

---

**Option B : Cloudflare Turnstile** (Alternative RGPD-friendly)

Plus simple, sans tracking Google.

---

### 4. Timestamp Check (Anti-Bot Simple)

**Concept** : Un humain met au moins 3-5 secondes pour remplir un formulaire

```tsx
// src/components/rsvp/RSVPForm.tsx
const [formStartTime] = useState(Date.now());

const handleSubmit = async () => {
  const timeTaken = Date.now() - formStartTime;
  formData.set("form_time", timeTaken.toString());
  // ...
};
```

```typescript
// src/app/actions/rsvp.ts
export async function submitRSVP(formData: FormData) {
  const formTime = parseInt(formData.get("form_time") as string);
  
  // Rejeté si < 3 secondes (bot probable)
  if (formTime < 3000) {
    return { success: false, message: "Veuillez remplir le formulaire." };
  }
  // ...
}
```

**Avantages** :
- ✅ Très simple
- ✅ Gratuit
- ✅ Bloque les bots basiques

**Limites** :
- ⚠️ Peut être contourné
- ⚠️ Peut bloquer utilisateurs très rapides

---

### 5. IP-Based Rate Limiting (Vercel)

**Avec Vercel Edge Middleware** :

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimitMap = new Map<string, number[]>();

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/rsvp") {
    const ip = request.ip || "unknown";
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    
    // Garder seulement les 5 dernières minutes
    const recentTimestamps = timestamps.filter(t => now - t < 5 * 60 * 1000);
    
    // Max 5 requêtes / 5 min par IP
    if (recentTimestamps.length >= 5) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }
    
    recentTimestamps.push(now);
    rateLimitMap.set(ip, recentTimestamps);
  }
  
  return NextResponse.next();
}
```

**Limites** :
- ⚠️ Pas fiable avec Server Actions (pas de route API)
- ⚠️ Contournable avec VPN

---

## 📊 Stratégie Recommandée

### Phase 1 : MVP (Actuel) ✅

- [x] Validation stricte (zod)
- [x] Anti-doublon par email
- [x] Messages d'erreur clairs

**Suffisant pour** : Site privé avec invitations par email

---

### Phase 2 : Protection Basique 🔧

À implémenter **avant le lancement public** :

1. **Honeypot field** (30 min)
2. **Timestamp check** (15 min)
3. **Contrainte unique DB** (5 min)

**Total** : ~1h de dev
**Coût** : 0€

---

### Phase 3 : Protection Avancée 🚀

Si vous constatez du spam :

1. **Rate limiting Upstash** (1h)
   - Upstash free tier : 10k req/jour
   - Setup : https://upstash.com/

2. **CAPTCHA (v3)** (2h)
   - Google reCAPTCHA ou Cloudflare Turnstile
   - Seulement si spam massif

**Total** : 2-3h de dev
**Coût** : 0€ (free tiers suffisants)

---

## 🧪 Comment Tester la Protection

### Test Anti-Doublon

```bash
# Soumettre 2x avec le même email
# → La 2ème devrait mettre à jour, pas créer un doublon
```

### Test Rate Limiting (si implémenté)

```bash
# Soumettre 4x rapidement
# → La 4ème devrait être rejetée
```

### Test Honeypot (si implémenté)

```bash
# Remplir le champ caché
# → Devrait être rejeté
```

---

## 📈 Monitoring

### Détecter le Spam

**Dans Supabase Dashboard → Table Editor** :

```sql
-- Voir les RSVP récents
SELECT guest_name, guest_email, created_at
FROM public.rsvp
ORDER BY created_at DESC
LIMIT 50;

-- Détecter doublons d'email (ne devrait pas arriver)
SELECT guest_email, COUNT(*)
FROM public.rsvp
GROUP BY guest_email
HAVING COUNT(*) > 1;

-- Détecter spam (noms suspects)
SELECT *
FROM public.rsvp
WHERE guest_name LIKE '%test%'
   OR guest_name LIKE '%spam%'
   OR guest_email LIKE '%test%';
```

### Supprimer le Spam

```sql
-- Supprimer un RSVP spécifique
DELETE FROM public.rsvp WHERE guest_email = 'spam@example.com';

-- Supprimer tous les RSVP d'aujourd'hui (si attaque)
DELETE FROM public.rsvp 
WHERE created_at > CURRENT_DATE;
```

---

## 🔐 Sécurité Supabase (Row Level Security)

Les policies RLS sont déjà activées :

```sql
-- Lecture publique (OK)
CREATE POLICY "RSVP - Public Read" ON rsvp FOR SELECT USING (true);

-- Insertion publique (OK)
CREATE POLICY "RSVP - Public Insert" ON rsvp FOR INSERT WITH CHECK (true);

-- Modification publique (OK - permet mise à jour par email)
CREATE POLICY "RSVP - Public Update" ON rsvp FOR UPDATE USING (true);

-- Suppression interdite (seuls admins)
CREATE POLICY "RSVP - No Delete" ON rsvp FOR DELETE USING (false);
```

---

## 💡 Recommandations Finales

### Pour un site de mariage privé (~200 invités)

**Minimum viable** :
1. ✅ Validation zod (déjà fait)
2. ✅ Anti-doublon email (déjà fait)
3. 🔧 Honeypot field (30 min)
4. 🔧 Contrainte unique DB (5 min)

**Total** : ~30 min de travail supplémentaire
**Protection** : Suffisant pour 99% des cas

---

### Si le formulaire devient public (réseaux sociaux)

**Ajouter** :
1. Rate limiting (Upstash ou in-memory)
2. CAPTCHA invisible (reCAPTCHA v3)

---

### Budget

| Solution | Coût | Efficacité |
|----------|------|------------|
| Validation + Anti-doublon | 0€ | ⭐⭐⭐ |
| Honeypot | 0€ | ⭐⭐⭐⭐ |
| Timestamp check | 0€ | ⭐⭐⭐ |
| Rate limiting (Upstash) | 0€ (free tier) | ⭐⭐⭐⭐⭐ |
| reCAPTCHA v3 | 0€ (< 1M req) | ⭐⭐⭐⭐⭐ |

**Conclusion** : Protection complète possible pour **0€** ! 🎉

---

## 📚 Ressources

- [Upstash Rate Limiting](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
- [Google reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- [OWASP Rate Limiting](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html#rate-limiting)
