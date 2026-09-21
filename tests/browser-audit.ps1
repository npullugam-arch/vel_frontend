param([string]$BaseUrl = 'http://127.0.0.1:4173', [int]$DebugPort = 9223)
$ErrorActionPreference = 'Stop'
# Requires an isolated headless Chromium/Edge instance with remote debugging enabled.
# Read-only: visits public pages; never submits a form or starts a payment.
$target = Invoke-RestMethod -Uri "http://127.0.0.1:$DebugPort/json/new?about:blank" -Method Put
$socket = [System.Net.WebSockets.ClientWebSocket]::new()
$socket.ConnectAsync([Uri]$target.webSocketDebuggerUrl, [Threading.CancellationToken]::None).GetAwaiter().GetResult() | Out-Null
$script:commandId = 0
$script:exceptions = @()
function Send-Cdp($method, $parameters) {
  $script:commandId++
  $json = @{id=$script:commandId; method=$method; params=$parameters} | ConvertTo-Json -Compress -Depth 12
  $bytes = [Text.Encoding]::UTF8.GetBytes($json)
  $timeout = [Threading.CancellationTokenSource]::new(20000)
  try {
    $socket.SendAsync([ArraySegment[byte]]::new($bytes), [Net.WebSockets.WebSocketMessageType]::Text, $true, $timeout.Token).GetAwaiter().GetResult() | Out-Null
    do {
      $stream = [IO.MemoryStream]::new()
      do {
        $buffer = New-Object byte[] 65536
        $received = $socket.ReceiveAsync([ArraySegment[byte]]::new($buffer), $timeout.Token).GetAwaiter().GetResult()
        $stream.Write($buffer,0,$received.Count)
      } while (!$received.EndOfMessage)
      $reply = [Text.Encoding]::UTF8.GetString($stream.ToArray()) | ConvertFrom-Json
      $stream.Dispose()
      if ($reply.method -eq 'Runtime.exceptionThrown') { $script:exceptions += $reply.params.exceptionDetails.exception.description }
    } while ($reply.id -ne $script:commandId)
    if ($reply.error) { throw ($reply.error | ConvertTo-Json -Compress) }
    return $reply
  } finally { $timeout.Dispose() }
}
function Evaluate($expression) {
  $reply = Send-Cdp 'Runtime.evaluate' @{expression=$expression;returnByValue=$true;awaitPromise=$true}
  if ($reply.result.exceptionDetails) { throw ($reply.result.exceptionDetails | ConvertTo-Json -Compress -Depth 5) }
  return $reply.result.result.value
}
$paths = @('/', '/about-us', '/contact', '/programs', '/projects', '/privacy-policy', '/terms-conditions', '/refund-cancellation-policy', '/service-delivery-policy', '/login')
$script:results = @()
try {
  Send-Cdp 'Runtime.enable' @{} | Out-Null
  Send-Cdp 'Page.enable' @{} | Out-Null
  foreach ($width in @(390, 1440)) {
    Send-Cdp 'Emulation.setDeviceMetricsOverride' @{width=$width;height=900;deviceScaleFactor=1;mobile=($width -lt 600)} | Out-Null
    foreach ($path in $paths) {
      $script:exceptions = @()
      Send-Cdp 'Page.navigate' @{url="$BaseUrl$path"} | Out-Null
      Evaluate 'new Promise(resolve => setTimeout(resolve, 700))' | Out-Null
      for ($attempt = 0; $attempt -lt 30; $attempt++) {
        if (Evaluate '!!document.querySelector("h1")') { break }
        Evaluate 'new Promise(resolve => setTimeout(resolve, 200))' | Out-Null
      }
      Evaluate 'Promise.race([Promise.all([...document.images].map(i => i.complete ? Promise.resolve() : new Promise(r => { i.onload=r; i.onerror=r; }))),new Promise(r=>setTimeout(r,4000))])' | Out-Null
      $result = Evaluate @'
JSON.stringify({
  path:location.pathname,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
  h1:document.querySelectorAll('h1').length,title:document.title,
  meta:!!document.querySelector('meta[name="description"]')?.content,
  footer:!!document.querySelector('footer'),
  footerLinks:[...document.querySelectorAll('footer nav a')].map(a=>a.pathname),
  brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),
  missingAnchors:[...document.querySelectorAll('a[href^="#"],a[href^="/#"]')].filter(a=>location.pathname==='/' && a.hash && !document.getElementById(a.hash.slice(1))).map(a=>a.hash)
})
'@ | ConvertFrom-Json
      $result | Add-Member -NotePropertyName exceptions -NotePropertyValue @($script:exceptions)
      if ($result.h1 -ne 1) { throw ($result | ConvertTo-Json -Compress -Depth 5) }
      if ($width -eq 390 -and $path -ne '/login') {
        Evaluate 'document.querySelector(".menu-btn").click()' | Out-Null
        Evaluate 'new Promise(r=>setTimeout(r,250))' | Out-Null
        $menuOpen = Evaluate 'document.querySelector(".menu-btn").getAttribute("aria-expanded")==="true" && getComputedStyle(document.querySelector(".navlinks")).opacity === "1"'
        if (!$menuOpen) { throw "Mobile navigation failed: $path" }
      }
      $script:results += $result
      if ($result.scrollWidth -gt $width -or $result.h1 -ne 1 -or !$result.meta -or !$result.footer -or $result.brokenImages.Count -gt 0 -or $result.missingAnchors.Count -gt 0 -or $result.exceptions.Count -gt 0) {
        Write-Output ($result | ConvertTo-Json -Compress -Depth 5)
      }
    }
  }
  foreach ($alias in @('about','terms','refund-policy','internships')) {
    Send-Cdp 'Page.navigate' @{url="$BaseUrl/$alias"} | Out-Null
    Evaluate 'new Promise(r=>setTimeout(r,350))' | Out-Null
    $resolved = Evaluate 'location.pathname'
    if ($resolved -eq "/$alias") { throw "Alias did not resolve: $alias" }
  }
  # Test fixtures stay in this isolated browser. No production data is written.
  $fixtures = @'
const originalFetch = window.fetch.bind(window);
window.fetch = (input, options) => {
  const url = String(input);
  if (options?.method && options.method !== 'GET') throw new Error('Audit forbids writes');
  if (url.includes('/api/public/')) {
    const details = {title:'Audit fixture (test only)',description:'A guided learning session',duration:'2 weeks',programStartInfo:'October cohort',deliverables:'Two online sessions',eligibility:'Students',deliveryDetails:'Email invitation within 2 business days',status:'ONGOING',category:'ONGOING',registrationOpen:true,collaborationOpen:true};
    return Promise.resolve(new Response(JSON.stringify({data:[{...details,id:901,fee:100.50},{...details,id:902,fee:0},{...details,id:903,fee:100,deliveryDetails:null}]}),{headers:{'Content-Type':'application/json'}}));
  }
  return originalFetch(input,options);
};
'@
  Send-Cdp 'Page.addScriptToEvaluateOnNewDocument' @{source=$fixtures} | Out-Null
  Send-Cdp 'Emulation.setDeviceMetricsOverride' @{width=390;height=900;deviceScaleFactor=1;mobile=$true} | Out-Null
  foreach ($catalog in @(@('/programs','.internship-register-btn'),@('/projects','.project-action-btn'),@('/','.event-register-btn'))) {
    Send-Cdp 'Page.navigate' @{url="$BaseUrl$($catalog[0])"} | Out-Null
    Evaluate 'new Promise(r=>setTimeout(r,700))' | Out-Null
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
      if ((Evaluate "document.querySelectorAll('$($catalog[1])').length") -eq 3) { break }
      Evaluate 'new Promise(r=>setTimeout(r,200))' | Out-Null
    }
    if ((Evaluate "document.querySelectorAll('$($catalog[1])').length") -ne 3) { throw "Fixtures did not load on $($catalog[0])" }
    for ($index = 0; $index -lt 3; $index++) {
      Evaluate "document.querySelectorAll('$($catalog[1])')[$index].click()" | Out-Null
      Evaluate 'new Promise(r=>setTimeout(r,100))' | Out-Null
      $modal = Evaluate 'JSON.stringify({open:!!document.querySelector("[role=dialog]"),payment:!!document.querySelector(".payment-qr-image"),refund:!!document.querySelector("[role=dialog] a[href=\"/refund-cancellation-policy\"]"),overflow:document.querySelector("[role=dialog]").scrollWidth>document.querySelector("[role=dialog]").clientWidth})' | ConvertFrom-Json
      if (!$modal.open -or !$modal.refund -or $modal.overflow -or ($modal.payment -ne ($index -eq 0))) { throw "Registration disclosure failure: $($catalog[0]), fixture $index" }
      Evaluate 'document.querySelector("button[aria-label=\"Close registration\"]").click()' | Out-Null
      Evaluate 'new Promise(r=>setTimeout(r,100))' | Out-Null
    }
  }
  Send-Cdp 'Page.addScriptToEvaluateOnNewDocument' @{source='Object.defineProperty(window,"localStorage",{get(){throw new DOMException("Blocked storage","SecurityError")}})'} | Out-Null
  $script:exceptions = @()
  Send-Cdp 'Page.navigate' @{url="$BaseUrl/privacy-policy"} | Out-Null
  Evaluate 'new Promise(r=>setTimeout(r,500))' | Out-Null
  $storageSafe = Evaluate 'document.querySelector("h1")?.textContent==="Privacy Policy"'
  $storageBlocked = Evaluate '(() => { try { window.localStorage; return false; } catch { return true; } })()'
  if (!$storageSafe -or !$storageBlocked -or $script:exceptions.Count -gt 0) { throw 'Public access fails with blocked browser storage' }
  $reportPath = Join-Path $env:TEMP 'veltrixis-browser-audit.json'
  $script:results | ConvertTo-Json -Depth 7 | Set-Content -LiteralPath $reportPath -Encoding UTF8
  $failures = @($script:results | Where-Object { $_.scrollWidth -gt $_.width -or $_.h1 -ne 1 -or !$_.meta -or !$_.footer -or $_.brokenImages.Count -gt 0 -or $_.missingAnchors.Count -gt 0 -or $_.exceptions.Count -gt 0 })
  Write-Output "Checked $($script:results.Count) desktop/mobile page visits, mobile menus, 4 aliases, 9 paid/free/incomplete registration dialogs and blocked-storage access. Failures: $($failures.Count). Evidence: $reportPath"
  if ($failures.Count -gt 0) { exit 1 }
} finally {
  if ($socket.State -eq [Net.WebSockets.WebSocketState]::Open) { Send-Cdp 'Page.close' @{} | Out-Null }
  $socket.Dispose()
}
