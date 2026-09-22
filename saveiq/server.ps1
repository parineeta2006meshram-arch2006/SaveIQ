# SaveIQ Local Development Server (Zero Dependencies)
# Uses native .NET HttpListener built into Windows PowerShell

param (
    [int]$Port = 3000
)

$scriptPath = $PSScriptRoot
if (-not $scriptPath -or -not (Test-Path $scriptPath)) {
    $scriptPath = "C:\Users\amolm\.gemini\antigravity\scratch\saveiq"
}
Set-Location $scriptPath

$listener = New-Object System.Net.HttpListener

# Try port, if in use try next ports
$bound = $false
while (-not $bound -and $Port -le 3050) {
    try {
        $listener.Prefixes.Clear()
        $listener.Prefixes.Add("http://localhost:$Port/")
        $listener.Start()
        $bound = $true
    } catch {
        $Port++
    }
}

if (-not $bound) {
    Write-Error "Could not bind to any port between 3000 and 3050."
    exit 1
}

$url = "http://localhost:$Port/"
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " SaveIQ - AI Savings Goal Tracker is Live!" -ForegroundColor White
Write-Host " Local URL: $url" -ForegroundColor Cyan
Write-Host " Press Ctrl+C in this window to stop the server" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""

# Open default web browser
Start-Process $url

$mimeMap = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".ico"  = "image/x-icon"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        try {
            $request = $context.Request
            $response = $context.Response

            $rawUrl = $request.RawUrl
            if ($rawUrl -match "\?") {
                $rawUrl = $rawUrl.Substring(0, $rawUrl.IndexOf("?"))
            }

            if ($rawUrl -eq "/" -or [string]::IsNullOrWhiteSpace($rawUrl)) {
                $localPath = "index.html"
            } else {
                $localPath = $rawUrl.TrimStart("/").Replace("/", "\")
            }

            $fullPath = Join-Path $scriptPath $localPath

            if (Test-Path $fullPath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
                $contentType = $mimeMap[$ext]
                if (-not $contentType) {
                    $contentType = "application/octet-stream"
                }

                $bytes = [System.IO.File]::ReadAllBytes($fullPath)
                $response.ContentType = $contentType
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $response.StatusCode = 404
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.ContentType = "text/plain"
                $response.ContentLength64 = $errBytes.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
                }
            }

            $response.Close()
        } catch {
            Write-Warning "Request handling error: $_"
            try { $context.Response.Close() } catch {}
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
