param(
  [string]$AssetDirectory = (Join-Path $PSScriptRoot "..\public\cromblog\doodles"),
  [string]$ReviewPath = (Join-Path $PSScriptRoot "..\..\..\.tmp\cromblog-doodle-assets-review.png")
)

$ErrorActionPreference = "Stop"

$assets = @(
  @{ Name = "owl-on-branch-01.png"; Kind = "specimen" },
  @{ Name = "raven-01.png"; Kind = "specimen" },
  @{ Name = "scissor-tailed-flycatcher-01.png"; Kind = "specimen" },
  @{ Name = "red-eyed-vireo-01.png"; Kind = "specimen" },
  @{ Name = "common-flicker-tree-01.png"; Kind = "composition" },
  @{ Name = "leaf-vine-01.png"; Kind = "rule" },
  @{ Name = "feathered-eye-01.png"; Kind = "mark" },
  @{ Name = "one-eyed-gentleman-01.png"; Kind = "character" },
  @{ Name = "bow-tied-crocodile-01.png"; Kind = "character" },
  @{ Name = "caped-rabbit-01.png"; Kind = "character" },
  @{ Name = "orb-balancing-slug-01.png"; Kind = "character" },
  @{ Name = "eye-flower-sentinel-01.png"; Kind = "composition" }
)

Add-Type -AssemblyName System.Drawing

Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public sealed class CromblogDoodleStats
{
    public int Width { get; set; }
    public int Height { get; set; }
    public int MinAlpha { get; set; }
    public int MaxAlpha { get; set; }
    public int[] CornerAlpha { get; set; }
    public int MaxBorderAlpha { get; set; }
}

public static class CromblogDoodleReview
{
    public static CromblogDoodleStats Analyze(string path)
    {
        using (Bitmap bitmap = new Bitmap(path))
        {
            Rectangle bounds = new Rectangle(0, 0, bitmap.Width, bitmap.Height);
            Bitmap normalized = new Bitmap(bitmap.Width, bitmap.Height, PixelFormat.Format32bppArgb);
            using (Graphics graphics = Graphics.FromImage(normalized))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.DrawImageUnscaled(bitmap, 0, 0);
            }

            BitmapData data = normalized.LockBits(
                bounds,
                ImageLockMode.ReadOnly,
                PixelFormat.Format32bppArgb);
            int byteCount = Math.Abs(data.Stride) * normalized.Height;
            byte[] pixels = new byte[byteCount];
            Marshal.Copy(data.Scan0, pixels, 0, byteCount);

            int minAlpha = 255;
            int maxAlpha = 0;
            for (int y = 0; y < normalized.Height; y++)
            {
                int row = y * data.Stride;
                for (int x = 0; x < normalized.Width; x++)
                {
                    int alpha = pixels[row + (x * 4) + 3];
                    if (alpha < minAlpha) minAlpha = alpha;
                    if (alpha > maxAlpha) maxAlpha = alpha;
                }
            }

            normalized.UnlockBits(data);
            int[] corners = new int[]
            {
                normalized.GetPixel(0, 0).A,
                normalized.GetPixel(normalized.Width - 1, 0).A,
                normalized.GetPixel(0, normalized.Height - 1).A,
                normalized.GetPixel(normalized.Width - 1, normalized.Height - 1).A
            };
            int maxBorderAlpha = 0;
            for (int x = 0; x < normalized.Width; x++)
            {
                maxBorderAlpha = Math.Max(maxBorderAlpha, normalized.GetPixel(x, 0).A);
                maxBorderAlpha = Math.Max(maxBorderAlpha, normalized.GetPixel(x, normalized.Height - 1).A);
            }
            for (int y = 0; y < normalized.Height; y++)
            {
                maxBorderAlpha = Math.Max(maxBorderAlpha, normalized.GetPixel(0, y).A);
                maxBorderAlpha = Math.Max(maxBorderAlpha, normalized.GetPixel(normalized.Width - 1, y).A);
            }
            normalized.Dispose();

            return new CromblogDoodleStats
            {
                Width = bitmap.Width,
                Height = bitmap.Height,
                MinAlpha = minAlpha,
                MaxAlpha = maxAlpha,
                CornerAlpha = corners,
                MaxBorderAlpha = maxBorderAlpha
            };
        }
    }
}
"@

$resolvedAssetDirectory = [System.IO.Path]::GetFullPath($AssetDirectory)
$resolvedReviewPath = [System.IO.Path]::GetFullPath($ReviewPath)
$manifestPath = [System.IO.Path]::GetFullPath(
  (Join-Path $PSScriptRoot "..\content\doodles.ts")
)
$manifestContent = Get-Content -LiteralPath $manifestPath -Raw
$expectedNames = $assets.Name
$actualNames = @(
  Get-ChildItem -LiteralPath $resolvedAssetDirectory -Filter "*.png" |
    Select-Object -ExpandProperty Name |
    Sort-Object
)

$unexpected = @($actualNames | Where-Object { $_ -notin $expectedNames })
$missing = @($expectedNames | Where-Object { $_ -notin $actualNames })
if ($unexpected.Count -gt 0 -or $missing.Count -gt 0) {
  throw "Approved asset set mismatch. Missing: $($missing -join ', '); unexpected: $($unexpected -join ', ')"
}

$results = @()
$errors = @()
foreach ($asset in $assets) {
  $path = Join-Path $resolvedAssetDirectory $asset.Name
  $file = Get-Item -LiteralPath $path
  $stats = [CromblogDoodleReview]::Analyze($path)
  $assetId = [System.IO.Path]::GetFileNameWithoutExtension($asset.Name)
  $manifestPattern =
    '(?s)"' + [regex]::Escape($assetId) +
    '"\s*:\s*\{.*?image\s*:\s*\{\s*width\s*:\s*(\d+)\s*,\s*height\s*:\s*(\d+)\s*\}'
  $manifestMatch = [regex]::Match($manifestContent, $manifestPattern)
  $cornerMaximum = ($stats.CornerAlpha | Measure-Object -Maximum).Maximum
  $shortest = [Math]::Min($stats.Width, $stats.Height)
  $longest = [Math]::Max($stats.Width, $stats.Height)

  if ($stats.MinAlpha -ne 0) { $errors += "$($asset.Name): no fully transparent pixels" }
  if ($stats.MaxAlpha -le 0) { $errors += "$($asset.Name): image is empty" }
  if ($cornerMaximum -gt 8) { $errors += "$($asset.Name): opaque corner detected" }
  if ($stats.MaxBorderAlpha -gt 16) { $errors += "$($asset.Name): artwork touches the canvas edge" }
  if ($shortest -lt 256) { $errors += "$($asset.Name): shortest dimension is below 256px" }
  if ($longest -gt 2400) { $errors += "$($asset.Name): longest dimension exceeds 2400px" }
  if ($file.Length -gt 2MB) { $errors += "$($asset.Name): file exceeds 2 MiB" }
  if (-not $manifestMatch.Success) {
    $errors += "$($asset.Name): dimensions are missing from content/doodles.ts"
  } else {
    $manifestWidth = [int]$manifestMatch.Groups[1].Value
    $manifestHeight = [int]$manifestMatch.Groups[2].Value
    if ($manifestWidth -ne $stats.Width -or $manifestHeight -ne $stats.Height) {
      $errors += "$($asset.Name): manifest says ${manifestWidth}x${manifestHeight}, PNG is $($stats.Width)x$($stats.Height)"
    }
  }

  $results += [PSCustomObject]@{
    Name = $asset.Name
    Kind = $asset.Kind
    Path = $path
    Width = $stats.Width
    Height = $stats.Height
    KiB = [Math]::Round($file.Length / 1KB)
    MinAlpha = $stats.MinAlpha
    MaxAlpha = $stats.MaxAlpha
    EdgeAlpha = $stats.MaxBorderAlpha
    Corners = ($stats.CornerAlpha -join ",")
  }
}

$reviewDirectory = Split-Path -Parent $resolvedReviewPath
New-Item -ItemType Directory -Force -Path $reviewDirectory | Out-Null

$sheetWidth = 2400
$margin = 40
$gap = 20
$cardHeight = 760
$rowCount = [int][Math]::Ceiling($results.Count / 2.0)
$sheetHeight = (2 * $margin) + ($rowCount * $cardHeight) + (($rowCount - 1) * $gap)
$sheet = New-Object System.Drawing.Bitmap($sheetWidth, $sheetHeight)
$graphics = [System.Drawing.Graphics]::FromImage($sheet)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.Clear([System.Drawing.Color]::FromArgb(24, 35, 29))

$titleFont = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
$metaFont = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Regular)
$titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(31, 39, 33))
$metaBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(88, 96, 87))
$cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(246, 242, 232))
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(168, 159, 139), 2)
$checkerLight = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(250, 248, 242))
$checkerDark = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(221, 216, 204))

$cardWidth = 1150
$previewInset = 24
$previewTop = 112
$previewWidth = $cardWidth - (2 * $previewInset)
$previewHeight = $cardHeight - $previewTop - $previewInset
$checkerSize = 42

for ($index = 0; $index -lt $results.Count; $index++) {
  $column = $index % 2
  $row = [Math]::Floor($index / 2)
  $cardX = $margin + ($column * ($cardWidth + $gap))
  $cardY = $margin + ($row * ($cardHeight + $gap))
  $cardRect = New-Object System.Drawing.Rectangle($cardX, $cardY, $cardWidth, $cardHeight)
  $graphics.FillRectangle($cardBrush, $cardRect)
  $graphics.DrawRectangle($borderPen, $cardRect)

  $result = $results[$index]
  $graphics.DrawString($result.Name, $titleFont, $titleBrush, $cardX + 24, $cardY + 20)
  $meta = "$($result.Kind)  |  $($result.Width)x$($result.Height)  |  $($result.KiB) KiB  |  alpha $($result.MinAlpha)-$($result.MaxAlpha)"
  $graphics.DrawString($meta, $metaFont, $metaBrush, $cardX + 24, $cardY + 64)

  $previewX = $cardX + $previewInset
  $previewY = $cardY + $previewTop
  for ($checkerY = 0; $checkerY -lt $previewHeight; $checkerY += $checkerSize) {
    for ($checkerX = 0; $checkerX -lt $previewWidth; $checkerX += $checkerSize) {
      $brush = if ((($checkerX / $checkerSize) + ($checkerY / $checkerSize)) % 2 -eq 0) { $checkerLight } else { $checkerDark }
      $width = [Math]::Min($checkerSize, $previewWidth - $checkerX)
      $height = [Math]::Min($checkerSize, $previewHeight - $checkerY)
      $graphics.FillRectangle($brush, $previewX + $checkerX, $previewY + $checkerY, $width, $height)
    }
  }

  $image = [System.Drawing.Image]::FromFile($result.Path)
  $scale = [Math]::Min(($previewWidth - 70) / $image.Width, ($previewHeight - 70) / $image.Height)
  $drawWidth = [int]($image.Width * $scale)
  $drawHeight = [int]($image.Height * $scale)
  $drawX = $previewX + [int](($previewWidth - $drawWidth) / 2)
  $drawY = $previewY + [int](($previewHeight - $drawHeight) / 2)
  $graphics.DrawImage($image, $drawX, $drawY, $drawWidth, $drawHeight)
  $image.Dispose()
}

$sheet.Save($resolvedReviewPath, [System.Drawing.Imaging.ImageFormat]::Png)
$checkerLight.Dispose()
$checkerDark.Dispose()
$cardBrush.Dispose()
$titleBrush.Dispose()
$metaBrush.Dispose()
$borderPen.Dispose()
$titleFont.Dispose()
$metaFont.Dispose()
$graphics.Dispose()
$sheet.Dispose()

$results |
  Select-Object Name, Kind, Width, Height, KiB, MinAlpha, MaxAlpha, EdgeAlpha, Corners |
  Format-Table -AutoSize

Write-Host "Review sheet: $resolvedReviewPath"

if ($errors.Count -gt 0) {
  throw ($errors -join [Environment]::NewLine)
}
