# detect-sql-calls.ps1

$frontendDir = "./src"

Write-Host "Scanning frontend files for usage of 'mysql', 'mysql2', or 'pool'..."

# Get all .ts and .tsx files and search for SQL-related keywords
$matches = Get-ChildItem -Recurse -Path $frontendDir -Include *.ts, *.tsx -File |
    Select-String -Pattern "mysql", "mysql2", "pool"

if ($matches) {
    Write-Host "`nFound potential SQL usage in the frontend:`n" -ForegroundColor Red
    foreach ($match in $matches) {
        Write-Host "$($match.Path):$($match.LineNumber): $($match.Line.Trim())" -ForegroundColor Yellow
    }
} else {
    Write-Host "`nNo SQL usage ('mysql', 'mysql2', or 'pool') found in the frontend." -ForegroundColor Green
}
