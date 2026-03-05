# 发布热更新脚本

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("production", "preview", "development")]
    [string]$Branch = "production",
    
    [Parameter(Mandatory=$true)]
    [string]$Message
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  发布 Expo Updates 热更新" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否登录
Write-Host "检查登录状态..." -ForegroundColor Cyan
$whoami = eas whoami 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 未登录 Expo 账号" -ForegroundColor Red
    Write-Host ""
    Write-Host "请先登录：" -ForegroundColor Yellow
    Write-Host "  eas login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ 已登录: $whoami" -ForegroundColor Green
Write-Host ""

# 显示更新信息
Write-Host "更新信息：" -ForegroundColor Cyan
Write-Host "  分支: $Branch" -ForegroundColor Yellow
Write-Host "  说明: $Message" -ForegroundColor Yellow
Write-Host ""

# 确认发布
Write-Host "是否继续发布? (yes/no)" -ForegroundColor Yellow
$confirm = Read-Host

if ($confirm -ne "yes") {
    Write-Host "❌ 已取消" -ForegroundColor Red
    exit 1
}

# 发布更新
Write-Host ""
Write-Host "📦 正在发布更新..." -ForegroundColor Cyan
Write-Host ""

eas update --branch $Branch --message $Message

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ 更新发布成功！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "用户将在下次启动 APP 时获取更新" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "查看更新历史：" -ForegroundColor Cyan
    Write-Host "  eas update:list --branch $Branch" -ForegroundColor Yellow
    
} else {
    Write-Host ""
    Write-Host "❌ 发布失败！" -ForegroundColor Red
    Write-Host "请检查上面的错误信息" -ForegroundColor Yellow
    exit 1
}
