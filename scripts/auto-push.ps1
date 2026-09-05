$ErrorActionPreference = 'Stop'

$repository = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location $repository

$ignoredNames = @('.git', 'node_modules', 'dist')
$ignoredPatterns = @('*.local', '.env*', '*_preview.png', 'verified_*.png', 'test_*.png')
$pending = $false
$lastEvent = [DateTime]::MinValue

function Should-Ignore([string]$path) {
    $relative = $path.Substring($repository.Length).TrimStart('\', '/')
    $parts = $relative -split '[\\/]'

    foreach ($part in $parts) {
        if ($ignoredNames -contains $part) { return $true }
    }

    foreach ($pattern in $ignoredPatterns) {
        if ($relative -like $pattern -or (Split-Path $relative -Leaf) -like $pattern) { return $true }
    }

    return $false
}

$watcher = New-Object IO.FileSystemWatcher $repository
$watcher.IncludeSubdirectories = $true
$watcher.NotifyFilter = [IO.NotifyFilters]'FileName, LastWrite, Size, DirectoryName'
$watcher.EnableRaisingEvents = $true

$action = {
    if (-not (Should-Ignore $Event.SourceEventArgs.FullPath)) {
        $script:pending = $true
        $script:lastEvent = [DateTime]::Now
    }
}

$subscriptions = @(
    Register-ObjectEvent $watcher Created -Action $action
    Register-ObjectEvent $watcher Changed -Action $action
    Register-ObjectEvent $watcher Deleted -Action $action
    Register-ObjectEvent $watcher Renamed -Action $action
)

Write-Host "Auto-push watcher running for $repository"
Write-Host 'Save a project file to commit and push it to GitHub.'

try {
    while ($true) {
        Wait-Event -Timeout 2 | Out-Null

        if ($pending -and (([DateTime]::Now - $lastEvent).TotalSeconds -ge 2)) {
            $pending = $false
            git add -A
            $changes = git status --short

            if ($changes) {
                $message = "Auto-update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
                git commit -m $message | Out-Host
                git push origin HEAD:main | Out-Host
                Write-Host 'Pushed update to GitHub.'
            }
        }
    }
}
finally {
    $subscriptions | Unregister-Event -Force
    $watcher.Dispose()
}