FROM postgres:17-alpine

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=home_library

COPY docker/db/init.sql /docker-entrypoint-initdb.d/init.sql
