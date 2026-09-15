Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

if (-not ('DoodleFidelityEnhancer' -as [type])) {
    Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

public static class DoodleFidelityEnhancer
{
    public const double Scale = 1.5;
    public const double AlphaGain = 1.20;
    public const double AlphaSharpenAmount = 0.12;

    public static void Enhance(string sourcePath, string outputPath)
    {
        using (var sourceFile = new Bitmap(sourcePath))
        using (var source = CopyToArgb(sourceFile))
        {
            int width = RoundAwayFromZero(source.Width * Scale);
            int height = RoundAwayFromZero(source.Height * Scale);

            using (var resized = new Bitmap(width, height, PixelFormat.Format32bppArgb))
            {
                resized.SetResolution(source.HorizontalResolution, source.VerticalResolution);
                using (Graphics graphics = Graphics.FromImage(resized))
                using (var wrap = new ImageAttributes())
                {
                    graphics.CompositingMode = CompositingMode.SourceCopy;
                    graphics.CompositingQuality = CompositingQuality.HighQuality;
                    graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    graphics.SmoothingMode = SmoothingMode.HighQuality;
                    wrap.SetWrapMode(WrapMode.TileFlipXY);
                    graphics.DrawImage(
                        source,
                        new Rectangle(0, 0, width, height),
                        0,
                        0,
                        source.Width,
                        source.Height,
                        GraphicsUnit.Pixel,
                        wrap
                    );
                }

                StrengthenAndSharpenAlpha(resized);
                Directory.CreateDirectory(Path.GetDirectoryName(outputPath));
                resized.Save(outputPath, ImageFormat.Png);
            }
        }
    }

    public static string Validate(string sourcePath, string outputPath)
    {
        using (var source = new Bitmap(sourcePath))
        using (var output = new Bitmap(outputPath))
        using (var baseline = ResizeOnly(source))
        {
            int expectedWidth = RoundAwayFromZero(source.Width * Scale);
            int expectedHeight = RoundAwayFromZero(source.Height * Scale);
            if (output.Width != expectedWidth || output.Height != expectedHeight)
                throw new InvalidOperationException("Unexpected enhanced dimensions.");

            bool hasTransparent = false;
            bool hasVisible = false;
            bool transparencyPreserved = true;
            bool resizedRgbPreserved = true;
            long transparentCount = 0;
            long visibleCount = 0;
            int minAlpha = 255;
            int maxAlpha = 0;

            Rectangle rect = new Rectangle(0, 0, output.Width, output.Height);
            BitmapData outputData = output.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            BitmapData baselineData = baseline.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            try
            {
                int outputBytes = Math.Abs(outputData.Stride) * output.Height;
                int baselineBytes = Math.Abs(baselineData.Stride) * baseline.Height;
                byte[] outputBuffer = new byte[outputBytes];
                byte[] baselineBuffer = new byte[baselineBytes];
                Marshal.Copy(outputData.Scan0, outputBuffer, 0, outputBytes);
                Marshal.Copy(baselineData.Scan0, baselineBuffer, 0, baselineBytes);

                for (int y = 0; y < output.Height; y++)
                {
                    int outputRow = y * Math.Abs(outputData.Stride);
                    int baselineRow = y * Math.Abs(baselineData.Stride);
                    for (int x = 0; x < output.Width; x++)
                    {
                        int outputAlpha = outputBuffer[outputRow + (x * 4) + 3];
                        int baselineAlpha = baselineBuffer[baselineRow + (x * 4) + 3];
                        minAlpha = Math.Min(minAlpha, outputAlpha);
                        maxAlpha = Math.Max(maxAlpha, outputAlpha);
                        if (outputAlpha == 0)
                        {
                            hasTransparent = true;
                            transparentCount++;
                        }
                        else
                        {
                            hasVisible = true;
                            visibleCount++;
                        }

                        // Enhancement is forbidden from creating content where the
                        // bicubic resize has no alpha at all.
                        if (baselineAlpha == 0 && outputAlpha != 0)
                            transparencyPreserved = false;

                        int outputPixel = outputRow + (x * 4);
                        int baselinePixel = baselineRow + (x * 4);
                        if (outputBuffer[outputPixel] != baselineBuffer[baselinePixel]
                            || outputBuffer[outputPixel + 1] != baselineBuffer[baselinePixel + 1]
                            || outputBuffer[outputPixel + 2] != baselineBuffer[baselinePixel + 2])
                            resizedRgbPreserved = false;
                    }
                }
            }
            finally
            {
                output.UnlockBits(outputData);
                baseline.UnlockBits(baselineData);
            }

            if (!hasTransparent || !hasVisible || !transparencyPreserved || !resizedRgbPreserved)
                throw new InvalidOperationException("Alpha-channel conservation validation failed.");

            return String.Format(
                "{0}x{1}; alpha {2}-{3}; transparent pixels {4:N0}; visible pixels {5:N0}; bicubic-zero alpha preserved: yes; resized RGB preserved: yes",
                output.Width,
                output.Height,
                minAlpha,
                maxAlpha,
                transparentCount,
                visibleCount
            );
        }
    }

    public static void CreateReviewSheet(
        string ravenOriginal,
        string ravenEnhanced,
        string wrenOriginal,
        string wrenEnhanced,
        string outputPath)
    {
        const int sheetWidth = 2400;
        const int sheetHeight = 2050;
        const int margin = 80;
        const int gutter = 60;
        const int headingHeight = 155;
        const int rowGap = 70;
        int cellWidth = (sheetWidth - (margin * 2) - gutter) / 2;
        int rowHeight = (sheetHeight - headingHeight - margin - rowGap) / 2;

        using (var sheet = new Bitmap(sheetWidth, sheetHeight, PixelFormat.Format24bppRgb))
        using (Graphics graphics = Graphics.FromImage(sheet))
        using (var titleFont = new Font("Georgia", 42, FontStyle.Bold, GraphicsUnit.Pixel))
        using (var headingFont = new Font("Georgia", 30, FontStyle.Bold, GraphicsUnit.Pixel))
        using (var labelFont = new Font("Georgia", 24, FontStyle.Italic, GraphicsUnit.Pixel))
        using (var titleBrush = new SolidBrush(Color.FromArgb(39, 39, 37)))
        using (var secondaryBrush = new SolidBrush(Color.FromArgb(92, 90, 84)))
        using (var dividerPen = new Pen(Color.FromArgb(218, 214, 204), 2))
        using (var ravenSource = new Bitmap(ravenOriginal))
        using (var ravenResult = new Bitmap(ravenEnhanced))
        using (var wrenSource = new Bitmap(wrenOriginal))
        using (var wrenResult = new Bitmap(wrenEnhanced))
        {
            graphics.Clear(Color.White);
            graphics.CompositingQuality = CompositingQuality.HighQuality;
            graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
            graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
            graphics.SmoothingMode = SmoothingMode.HighQuality;

            graphics.DrawString("Doodle fidelity conservation review", titleFont, titleBrush, margin, 42);
            graphics.DrawString("Original", headingFont, secondaryBrush, margin, 110);
            graphics.DrawString("Restored (1.5x)", headingFont, secondaryBrush, margin + cellWidth + gutter, 110);
            graphics.DrawLine(dividerPen, margin, headingHeight - 5, sheetWidth - margin, headingHeight - 5);

            int rowOneY = headingHeight;
            int rowTwoY = headingHeight + rowHeight + rowGap;
            DrawReviewCell(graphics, ravenSource, margin, rowOneY, cellWidth, rowHeight, "Raven - exact original marks", labelFont, secondaryBrush);
            DrawReviewCell(graphics, ravenResult, margin + cellWidth + gutter, rowOneY, cellWidth, rowHeight, "Raven - alpha-only restoration", labelFont, secondaryBrush);
            graphics.DrawLine(dividerPen, margin, rowTwoY - (rowGap / 2), sheetWidth - margin, rowTwoY - (rowGap / 2));
            DrawReviewCell(graphics, wrenSource, margin, rowTwoY, cellWidth, rowHeight, "Carolina Wren - exact original marks", labelFont, secondaryBrush);
            DrawReviewCell(graphics, wrenResult, margin + cellWidth + gutter, rowTwoY, cellWidth, rowHeight, "Carolina Wren - alpha-only restoration", labelFont, secondaryBrush);

            Directory.CreateDirectory(Path.GetDirectoryName(outputPath));
            sheet.Save(outputPath, ImageFormat.Png);
        }
    }

    private static Bitmap ResizeOnly(Bitmap sourceFile)
    {
        using (var source = CopyToArgb(sourceFile))
        {
            int width = RoundAwayFromZero(source.Width * Scale);
            int height = RoundAwayFromZero(source.Height * Scale);
            var resized = new Bitmap(width, height, PixelFormat.Format32bppArgb);
            resized.SetResolution(source.HorizontalResolution, source.VerticalResolution);
            using (Graphics graphics = Graphics.FromImage(resized))
            using (var wrap = new ImageAttributes())
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                wrap.SetWrapMode(WrapMode.TileFlipXY);
                graphics.DrawImage(source, new Rectangle(0, 0, width, height), 0, 0, source.Width, source.Height, GraphicsUnit.Pixel, wrap);
            }
            return resized;
        }
    }

    private static Bitmap CopyToArgb(Bitmap source)
    {
        var copy = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb);
        copy.SetResolution(source.HorizontalResolution, source.VerticalResolution);
        using (Graphics graphics = Graphics.FromImage(copy))
        {
            graphics.CompositingMode = CompositingMode.SourceCopy;
            graphics.DrawImageUnscaled(source, 0, 0);
        }
        return copy;
    }

    private static void StrengthenAndSharpenAlpha(Bitmap bitmap)
    {
        Rectangle rect = new Rectangle(0, 0, bitmap.Width, bitmap.Height);
        BitmapData data = bitmap.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        try
        {
            int stride = Math.Abs(data.Stride);
            int byteCount = stride * bitmap.Height;
            byte[] pixels = new byte[byteCount];
            byte[] alpha = new byte[bitmap.Width * bitmap.Height];
            Marshal.Copy(data.Scan0, pixels, 0, byteCount);

            for (int y = 0; y < bitmap.Height; y++)
            {
                int row = y * stride;
                int alphaRow = y * bitmap.Width;
                for (int x = 0; x < bitmap.Width; x++)
                    alpha[alphaRow + x] = pixels[row + (x * 4) + 3];
            }

            for (int y = 0; y < bitmap.Height; y++)
            {
                int row = y * stride;
                for (int x = 0; x < bitmap.Width; x++)
                {
                    int index = (y * bitmap.Width) + x;
                    int originalAlpha = alpha[index];
                    if (originalAlpha == 0)
                    {
                        pixels[row + (x * 4) + 3] = 0;
                        continue;
                    }

                    int blurredAlpha = GaussianAlpha(alpha, bitmap.Width, bitmap.Height, x, y);
                    double sharpened = originalAlpha + (AlphaSharpenAmount * (originalAlpha - blurredAlpha));
                    int enhancedAlpha = (int)Math.Round(sharpened * AlphaGain, MidpointRounding.AwayFromZero);
                    pixels[row + (x * 4) + 3] = (byte)Math.Max(0, Math.Min(255, enhancedAlpha));
                }
            }

            Marshal.Copy(pixels, 0, data.Scan0, byteCount);
        }
        finally
        {
            bitmap.UnlockBits(data);
        }
    }

    private static int GaussianAlpha(byte[] alpha, int width, int height, int x, int y)
    {
        int[] weights = { 1, 2, 1 };
        int sum = 0;
        int weightSum = 0;
        for (int offsetY = -1; offsetY <= 1; offsetY++)
        {
            int sampleY = Math.Max(0, Math.Min(height - 1, y + offsetY));
            for (int offsetX = -1; offsetX <= 1; offsetX++)
            {
                int sampleX = Math.Max(0, Math.Min(width - 1, x + offsetX));
                int weight = weights[offsetX + 1] * weights[offsetY + 1];
                sum += alpha[(sampleY * width) + sampleX] * weight;
                weightSum += weight;
            }
        }
        return (int)Math.Round((double)sum / weightSum, MidpointRounding.AwayFromZero);
    }

    private static void DrawReviewCell(Graphics graphics, Bitmap image, int x, int y, int width, int height, string label, Font font, Brush brush)
    {
        const int labelHeight = 52;
        const int inset = 18;
        Rectangle imageArea = new Rectangle(x + inset, y + inset, width - (inset * 2), height - labelHeight - (inset * 2));
        double scale = Math.Min((double)imageArea.Width / image.Width, (double)imageArea.Height / image.Height);
        int drawWidth = Math.Max(1, RoundAwayFromZero(image.Width * scale));
        int drawHeight = Math.Max(1, RoundAwayFromZero(image.Height * scale));
        int drawX = imageArea.X + ((imageArea.Width - drawWidth) / 2);
        int drawY = imageArea.Y + ((imageArea.Height - drawHeight) / 2);
        graphics.DrawImage(image, new Rectangle(drawX, drawY, drawWidth, drawHeight));
        graphics.DrawString(label, font, brush, x + inset, y + height - labelHeight);
    }

    private static int RoundAwayFromZero(double value)
    {
        return (int)Math.Round(value, MidpointRounding.AwayFromZero);
    }
}
'@
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$doodleRoot = Join-Path $repoRoot 'public\cromblog\doodles'
$reviewRoot = Join-Path $repoRoot 'art-source\auspicious-august-and-a-signal-september'

$ravenOriginal = Join-Path $doodleRoot 'raven-01.png'
$wrenOriginal = Join-Path $doodleRoot 'carolina-wren-01.png'
$ravenRestored = Join-Path $doodleRoot 'raven-restored-01.png'
$wrenRestored = Join-Path $doodleRoot 'carolina-wren-restored-01.png'
$reviewSheet = Join-Path $reviewRoot 'doodle-fidelity-review.png'

foreach ($source in @($ravenOriginal, $wrenOriginal)) {
    if (-not (Test-Path -LiteralPath $source -PathType Leaf)) {
        throw "Required original doodle is missing: $source"
    }
}

$ravenSourceHash = (Get-FileHash -LiteralPath $ravenOriginal -Algorithm SHA256).Hash
$wrenSourceHash = (Get-FileHash -LiteralPath $wrenOriginal -Algorithm SHA256).Hash

[DoodleFidelityEnhancer]::Enhance($ravenOriginal, $ravenRestored)
[DoodleFidelityEnhancer]::Enhance($wrenOriginal, $wrenRestored)
[DoodleFidelityEnhancer]::CreateReviewSheet(
    $ravenOriginal,
    $ravenRestored,
    $wrenOriginal,
    $wrenRestored,
    $reviewSheet
)

$ravenValidation = [DoodleFidelityEnhancer]::Validate($ravenOriginal, $ravenRestored)
$wrenValidation = [DoodleFidelityEnhancer]::Validate($wrenOriginal, $wrenRestored)

if ((Get-FileHash -LiteralPath $ravenOriginal -Algorithm SHA256).Hash -ne $ravenSourceHash) {
    throw 'The raven original changed during enhancement.'
}
if ((Get-FileHash -LiteralPath $wrenOriginal -Algorithm SHA256).Hash -ne $wrenSourceHash) {
    throw 'The Carolina Wren original changed during enhancement.'
}

Write-Output 'Doodle fidelity enhancement complete.'
Write-Output 'Parameters: 1.5x HighQualityBicubic; alpha gain 1.20 (+20%); 3x3 Gaussian alpha unsharp amount 0.12; RGB detail unsharpened.'
Write-Output "Raven: $ravenValidation"
Write-Output "Wren: $wrenValidation"
Write-Output "Original SHA-256 unchanged: raven $ravenSourceHash; wren $wrenSourceHash"
Write-Output "Raven output: $ravenRestored"
Write-Output "Wren output: $wrenRestored"
Write-Output "Review sheet: $reviewSheet"
