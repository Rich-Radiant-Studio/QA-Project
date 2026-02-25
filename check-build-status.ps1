# 检查 Android 构建状态

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Android 构建状态监控" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Java 进程
$javaProcess = Get-Process | Where-Object {$_.ProcessName -like "*java*"}
if ($javaProcess) {
    Write-Host "✓ Gradle 正在运行" -ForegroundColor Green
    Write-Host "  进程 ID: $($javaProcess.Id)" -ForegroundColor Gray
    Write-Host "  CPU 使用: $($javaProcess.CPU)" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "✗ Gradle 未运行" -ForegroundColor Yellow
    Write-Host ""
}

# 检查 APK 文件
$apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $apkPath) {
    $apk = Get-Item $apkPath
    Write-Host "✓ APK 已生成！" -ForegroundColor Green
    Write-Host "  文件: $($apk.Name)" -ForegroundColor Gray
    Write-Host "  大小: $([math]::Round($apk.Length / 1MB, 2)) MB" -ForegroundColor Gray
    Write-Host "  时间: $($apk.LastWriteTime)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "🎉 构建成功！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host "⏳ APK 还未生成，构建进行中..." -ForegroundColor Yellow
    Write-Host ""
    
    # 检查构建目录
    if (Test-Path "android\app\build") {
        Write-Host "构建目录存在，正在编译..." -ForegroundColor Cyan
    } else {
        Write-Host "构建刚开始，正在下载依赖..." -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "提示: 首次构建需要 5-10 分钟" -ForegroundColor Gray
Write-Host "可以运行此脚本查看进度" -ForegroundColor Gray
