set /p DB="D1 DB Name: "
set /p MIGRATION="Migration Name: "
set /p LOCAL="l (local) or r (remote): "

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