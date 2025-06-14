@echo off
:: Extract the D1 database name from wrangler.jsonc
for /f "tokens=2 delims=:" %%a in ('findstr /i "database_name" wrangler.jsonc') do (
    for /f "tokens=*" %%b in ("%%a") do (
        set "DB=%%b"
        goto :remove_quotes
    )
)

:remove_quotes
:: Remove quotes and any surrounding spaces
set "DB=%DB: =%"
set "DB=%DB:"=%"
set "DB=%DB:,=%"

set /p CORRECT_DB="Is %DB% the correct db? (y or n): "

if (%CORRECT_DB%=="n") (set /p DB="Database name: ")

:: Prompt for migration name and local/remote option
set /p MIGRATION="Migration Name: "
set /p LOCAL="l (local) or r (remote): "

call npx prisma generate

call npx wrangler d1 migrations create %DB% %MIGRATION%

set FILECOUNT=0
for /f "delims=" %%f in ('dir /b /o:n migrations') do (
  set /a FILECOUNT+=1
  set LAST_MIGRATION=%%f
)

if (%FILECOUNT%==1) (
  call npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/%LAST_MIGRATION%
) else (
  call npx prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/%LAST_MIGRATION%
)

if (%LOCAL%=="r") (
  call npx wrangler d1 migrations apply %DB% --remote
) else (
  call npx wrangler d1 migrations apply %DB% --local
)