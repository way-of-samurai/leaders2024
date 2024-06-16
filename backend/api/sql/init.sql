create table if not exists users(
    id uuid primary key default gen_random_uuid(),
    login varchar(30) not null unique,
    password varchar(50) not null,
    role varchar(30) not null
);

create table if not exists clients(
    id uuid primary key,
    features jsonb not null,
    name varchar(100) not null
);

create table if not exists recommendations(
    id uuid primary key,
    user_id uuid not null,
    client_id uuid not null,
    image_id uuid not null,
    model_id uuid not null,
    product_features jsonb,
    user_promt text,
    keywords text,
    rating int,
    created_at timestamp
);

create table if not exists images(
    id uuid primary key,
    name varchar(100) not null,
    path text not null
);

create table if not exists models(
    id uuid primary key default gen_random_uuid(),
    is_active boolean not null,
    system_promt text not null,
    weights_path text not null
);

create unique index if not exists active_model
    ON models (is_active)
    WHERE (is_active);

insert into users(login, password, role) values('admin','admin','ADMIN') on conflict do nothing;