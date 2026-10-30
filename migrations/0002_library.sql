create table if not exists user_blobs (
  user_id text not null,
  kind text not null,
  payload text not null,
  primary key (user_id, kind)
);

create table if not exists bookmark_images (
  user_id text not null,
  bookmark_id text not null,
  data text not null,
  primary key (user_id, bookmark_id)
);
