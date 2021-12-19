CREATE DATABASE `mail_management_db`;

create table user
(
	id int auto_increment,
	email text not null,
	first_name text not null,
	last_name text default '' not null,
	age int not null,
	constraint user_pk
		primary key (id)
);

create unique index user_email_uindex
	on user (email);

create table logs
(
	id int auto_increment,
	created_ts timestamp default current_timestamp not null,
	email_id text default '' not null,
	newsletter_name text default '' not null,
	constraint logs_pk
		primary key (id)
);

