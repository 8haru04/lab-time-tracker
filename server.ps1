param(
    [int]$Port = 8080,
    [string]$BindAddress = "0.0.0.0"
)

$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$PublicDir = Join-Path $RootDir "public"
$PublicRoot = [System.IO.Path]::GetFullPath($PublicDir)

function Get-ReasonPhrase {
    param([int]$StatusCode)

    switch ($StatusCode) {
        200 { return "OK" }
        404 { return "Not Found" }
        405 { return "Method Not Allowed" }
        500 { return "Internal Server Error" }
        default { return "OK" }
    }
}

function Get-ContentType {
    param([string]$Path)

    switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
        ".html" { return "text/html; charset=utf-8" }
        ".css" { return "text/css; charset=utf-8" }
        ".js" { return "application/javascript; charset=utf-8" }
        ".webmanifest" { return "application/manifest+json; charset=utf-8" }
        ".json" { return "application/json; charset=utf-8" }
        ".txt" { return "text/plain; charset=utf-8" }
        ".svg" { return "image/svg+xml" }
        ".png" { return "image/png" }
        ".jpg" { return "image/jpeg" }
        ".jpeg" { return "image/jpeg" }
        ".ico" { return "image/x-icon" }
        default { return "application/octet-stream" }
    }
}

function Send-BytesResponse {
    param(
        [System.Net.Sockets.NetworkStream]$Stream,
        [int]$StatusCode,
        [string]$ContentType,
        [byte[]]$BodyBytes = @()
    )

    if ($null -eq $BodyBytes) {
        $BodyBytes = @()
    }

    $statusLine = "HTTP/1.1 {0} {1}`r`n" -f $StatusCode, (Get-ReasonPhrase -StatusCode $StatusCode)
    $headers = @(
        $statusLine
        "Date: $([DateTime]::UtcNow.ToString('R'))`r`n"
        "Server: LabTimeTracker-Minimal`r`n"
        "Connection: close`r`n"
        "Content-Length: $($BodyBytes.Length)`r`n"
        "Content-Type: $ContentType`r`n"
        "X-Content-Type-Options: nosniff`r`n"
        "Referrer-Policy: strict-origin-when-cross-origin`r`n"
        "X-Robots-Tag: noindex, nofollow, noarchive`r`n"
        "`r`n"
    ) -join ""

    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
    $Stream.Write($headerBytes, 0, $headerBytes.Length)

    if ($BodyBytes.Length -gt 0) {
        $Stream.Write($BodyBytes, 0, $BodyBytes.Length)
    }

    $Stream.Flush()
}

function Send-TextResponse {
    param(
        [System.Net.Sockets.NetworkStream]$Stream,
        [int]$StatusCode,
        [string]$Text
    )

    $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
    Send-BytesResponse -Stream $Stream -StatusCode $StatusCode -ContentType "text/plain; charset=utf-8" -BodyBytes $bodyBytes
}

function Read-HttpRequest {
    param([System.Net.Sockets.NetworkStream]$Stream)

    $buffer = New-Object byte[] 4096
    $requestBytes = New-Object System.Collections.Generic.List[byte]
    $marker = "`r`n`r`n"
    $headerEnd = -1

    while ($headerEnd -lt 0) {
        $bytesRead = $Stream.Read($buffer, 0, $buffer.Length)
        if ($bytesRead -le 0) {
            return $null
        }

        for ($i = 0; $i -lt $bytesRead; $i++) {
            $requestBytes.Add($buffer[$i])
        }

        $headerText = [System.Text.Encoding]::ASCII.GetString($requestBytes.ToArray())
        $headerEnd = $headerText.IndexOf($marker, [System.StringComparison]::Ordinal)
    }

    $raw = [System.Text.Encoding]::ASCII.GetString($requestBytes.ToArray(), 0, $headerEnd)
    $lines = $raw -split "`r`n"
    if ($lines.Count -eq 0) {
        return $null
    }

    $parts = $lines[0] -split " "
    if ($parts.Count -lt 2) {
        return $null
    }

    return [pscustomobject]@{
        method = $parts[0].ToUpperInvariant()
        path = $parts[1]
    }
}

function Resolve-StaticFile {
    param([string]$RequestPath)

    $cleanPath = ($RequestPath -split "\?")[0]
    if ([string]::IsNullOrWhiteSpace($cleanPath) -or $cleanPath -eq "/") {
        $cleanPath = "index.html"
    }
    else {
        $cleanPath = [Uri]::UnescapeDataString($cleanPath.TrimStart("/"))
    }

    $relativePath = $cleanPath -replace "/", [System.IO.Path]::DirectorySeparatorChar
    $resolvedPath = [System.IO.Path]::GetFullPath((Join-Path $PublicDir $relativePath))

    if (-not $resolvedPath.StartsWith($PublicRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
        return $null
    }

    if (Test-Path -LiteralPath $resolvedPath -PathType Leaf) {
        return $resolvedPath
    }

    return $null
}

function Handle-Request {
    param([System.Net.Sockets.TcpClient]$Client)

    $stream = $Client.GetStream()

    try {
        $request = Read-HttpRequest -Stream $stream
        if ($null -eq $request) {
            return
        }

        if ($request.method -ne "GET") {
            Send-TextResponse -Stream $stream -StatusCode 405 -Text "Only GET is supported."
            return
        }

        $filePath = Resolve-StaticFile -RequestPath $request.path
        if ($null -eq $filePath) {
            Send-TextResponse -Stream $stream -StatusCode 404 -Text "Not Found"
            return
        }

        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        Send-BytesResponse -Stream $stream -StatusCode 200 -ContentType (Get-ContentType -Path $filePath) -BodyBytes $bytes
    }
    catch {
        Send-TextResponse -Stream $stream -StatusCode 500 -Text $_.Exception.Message
    }
    finally {
        $stream.Dispose()
        $Client.Close()
    }
}

if (-not (Test-Path -LiteralPath $PublicDir)) {
    New-Item -ItemType Directory -Path $PublicDir | Out-Null
}

$listenerAddress = [System.Net.IPAddress]::Parse($BindAddress)
$listener = [System.Net.Sockets.TcpListener]::new($listenerAddress, $Port)
$listener.Start()

$hostName = [System.Net.Dns]::GetHostName()
$networkUrls = [System.Net.Dns]::GetHostAddresses($hostName) |
    Where-Object { $_.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetwork -and -not $_.IPAddressToString.StartsWith("127.") } |
    ForEach-Object { "  http://{0}:{1}/" -f $_.IPAddressToString, $Port }

Write-Host ""
Write-Host "Minimal server started."
Write-Host ("  http://localhost:{0}/" -f $Port)
if ($networkUrls) {
    $networkUrls | ForEach-Object { Write-Host $_ }
}
Write-Host ""
Write-Host "Press Ctrl+C to stop."
Write-Host ""

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        Handle-Request -Client $client
    }
}
finally {
    $listener.Stop()
}
