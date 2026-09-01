# Service Layer — deferred backend integration notes

Every screen talks to `src/services/api.ts` only. All functions are async and
shaped like their future database counterparts, so a real backend later
touches **one file**, not the UI.

**Status: intentionally deferred.** The prototype ships mock/in-memory data.
The notes below describe where the seams are when that work starts.

## Intended schema

```sql
create table public.categories (
  id text primary key,
  name text not null,
  tagline text
);

create table public.products (
  id text primary key,
  name text not null,
  slug text not null unique,
  category text references public.categories(id),
  short_description text,
  description text,
  price integer check (price >= 0),
  compare_at_price integer,
  rating numeric(3,2) default 0,
  review_count integer default 0,
  ingredients jsonb default '[]',
  benefits jsonb default '[]',
  usage text,
  origin text,
  stock integer default 0,
  tags jsonb default '[]',
  visual jsonb default '{}',
  featured boolean default false,
  is_new boolean default false,
  created_at timestamptz default now()
);

create table public.orders (
  id text primary key,
  user_id uuid references auth.users(id),
  items jsonb not null,
  subtotal integer not null,
  shipping integer not null,
  total integer not null,
  address jsonb not null,
  payment_method text not null,
  status text not null default 'Confirmed',
  placed_at timestamptz default now(),
  estimated_delivery date
);

alter table public.orders enable row level security;
create policy "own orders" on public.orders
  for all using (auth.uid() = user_id);

-- reviews table mirrors src/types Review; wishlist = (user_id, product_id) pairs.
```

## Swap map

| Service call today | Backend equivalent later |
|---|---|
| `productService.query` | `.from('products').select()` + filters in PostgREST |
| `productService.bySlug` | `.from('products').select().eq('slug', slug).single()` |
| `reviewService.byProduct` | `.from('reviews').select().eq('product_id', id)` |
| `orderService.place` | RPC/Edge Function (never trust client totals) |
| `authService.login` | identity provider's sign-in API |

## Rules carried over from the mock

- Totals are recomputed server-side at order placement.
- Auth moves to a real identity provider; sessions must never hold raw passwords.
- RLS owns row access; the client never filters on trust alone.
