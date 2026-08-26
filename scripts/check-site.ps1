[CmdletBinding()]
param(
  [string]$BaseUrl = "http://127.0.0.1:4173",
  [switch]$SkipHttp
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$Problems = [System.Collections.Generic.List[string]]::new()
$HtmlFiles = Get-ChildItem -LiteralPath $ProjectRoot -Recurse -File -Filter "*.html"

foreach ($SiteFile in $HtmlFiles) {
  $RelativePath = $SiteFile.FullName.Substring($ProjectRoot.Length + 1).Replace("\", "/")
  $Html = Get-Content -Raw -LiteralPath $SiteFile.FullName

  if ([regex]::Matches($Html, "<h1\b", "IgnoreCase").Count -ne 1) {
    $Problems.Add("$RelativePath must contain exactly one h1")
  }

  if ($RelativePath -ne "404.html") {
    foreach ($RequiredPattern in @(
      "<title>[^<]+</title>",
      '<meta\s+name="description"\s+content="[^"]+">',
      '<link\s+rel="canonical"\s+href="https://therenewup\.com/[^"]*">'
    )) {
      if (-not [regex]::IsMatch($Html, $RequiredPattern, "IgnoreCase")) {
        $Problems.Add("$RelativePath is missing required metadata")
      }
    }
  }

  if ([regex]::IsMatch($Html, '\sstyle="', "IgnoreCase")) {
    $Problems.Add("$RelativePath contains inline style")
  }

  foreach ($JsonMatch in [regex]::Matches($Html, '<script\s+type="application/ld\+json">(.*?)</script>', "IgnoreCase,Singleline")) {
    try {
      $null = $JsonMatch.Groups[1].Value | ConvertFrom-Json
    } catch {
      $Problems.Add("$RelativePath contains invalid JSON-LD")
    }
  }

  foreach ($LinkMatch in [regex]::Matches($Html, '(?:href|src)="(/[^"]*)"', "IgnoreCase")) {
    $Target = ($LinkMatch.Groups[1].Value -split '[?#]')[0]
    if (-not $Target) { continue }

    if ($Target -eq "/") {
      $TargetPath = Join-Path $ProjectRoot "index.html"
    } elseif ($Target.EndsWith("/")) {
      $TargetPath = Join-Path $ProjectRoot (($Target.TrimStart("/") -replace "/", "\") + "\index.html")
    } else {
      $TargetPath = Join-Path $ProjectRoot ($Target.TrimStart("/") -replace "/", "\")
    }

    if (-not (Test-Path -LiteralPath $TargetPath)) {
      $Problems.Add("$RelativePath points to missing $Target")
    }
  }
}

foreach ($XmlName in @("sitemap.xml", "feed.xml")) {
  try {
    $null = [xml](Get-Content -Raw -LiteralPath (Join-Path $ProjectRoot $XmlName))
  } catch {
    $Problems.Add("$XmlName is not valid XML")
  }
}

if (-not $SkipHttp) {
  $ExpectedRoutes = [ordered]@{
    "/" = 200
    "/metrics/" = 200
    "/case-study/day-zero/" = 200
    "/guides/free-website-analytics/" = 200
    "/guides/local-vs-static-hosting/" = 200
    "/privacy/" = 200
    "/robots.txt" = 200
    "/sitemap.xml" = 200
    "/feed.xml" = 200
    "/data/baseline-2026-08-26.json" = 200
    "/favicon.ico" = 200
    "/admin/login.html" = 404
    "/admin/dashboard.html" = 404
    "/admin/app.js" = 404
  }

  foreach ($Route in $ExpectedRoutes.Keys) {
    try {
      $Response = Invoke-WebRequest -Uri ($BaseUrl.TrimEnd("/") + $Route) -SkipHttpErrorCheck -TimeoutSec 10
      if ([int]$Response.StatusCode -ne $ExpectedRoutes[$Route]) {
        $Problems.Add("$Route returned $($Response.StatusCode), expected $($ExpectedRoutes[$Route])")
      }
    } catch {
      $Problems.Add("Could not check $Route at $BaseUrl")
    }
  }
}

if ($Problems.Count -gt 0) {
  $Problems | Sort-Object -Unique | ForEach-Object { Write-Error $_ }
  throw "$($Problems.Count) site validation problem(s) found"
}

Write-Output "Validated $($HtmlFiles.Count) HTML files, JSON-LD, internal links, sitemap, and RSS."
if (-not $SkipHttp) { Write-Output "HTTP route checks passed at $BaseUrl." }
