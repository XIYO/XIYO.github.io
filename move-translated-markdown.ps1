# 로케일별 파일 이동 함수
function Move-FilesWithGit {
    param (
        [string]$locale
    )

    # 소스 파일 패턴 설정
    $srcPattern = "static\**\*.$locale.md"
    $destBaseDir = "static\$locale"

    # 해당 로케일에 맞는 파일들 찾기
    Get-ChildItem -Path "static" -Recurse -Filter "*.$locale.md" | ForEach-Object {
        $file = $_.FullName

        # 파일이 속한 디렉토리 트리를 목적지에 그대로 재현 (static 경로는 제거)
        $relativePath = $file.Substring((Get-Location).Path.Length + 8) # 'static\' 부분 제거
        $relativeDir = Split-Path $relativePath -Parent  # 상대 디렉토리 경로
        $destDir = Join-Path $destBaseDir $relativeDir  # 목적지 디렉토리

        # 목적지 디렉토리가 없으면 생성
        if (-not (Test-Path $destDir)) {
            Write-Host "Creating directory: $destDir"
            New-Item -ItemType Directory -Path $destDir -Force
        }

        # 목적지 파일 경로 설정 (locale이 포함된 파일 확장자 제거)
        $destFile = Join-Path $destDir ($_.Name -replace "\.$locale\.md$", ".md")

        Write-Host "Moving $file to $destFile"

        # Git mv를 사용해 파일을 이동
        git mv $file $destFile
    }

    Write-Host "Files moved with directory structure to $destBaseDir"
}

# 로케일 목록 설정 (필요시 추가 가능)
$locales = @("ja-JP", "ko-KR", "en-US")

# 각 로케일에 대해 파일 이동 작업 수행
foreach ($locale in $locales) {
    Move-FilesWithGit -locale $locale
}

# 이동 후 git 상태 확인
git status

Write-Host "All files moved with git tracking, preserving directory structure."
