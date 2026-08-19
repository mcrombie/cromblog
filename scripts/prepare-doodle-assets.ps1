param(
  [string]$AssetDirectory = (Join-Path $PSScriptRoot "..\public\cromblog\doodles"),
  [int]$WhitePoint = 246,
  [int]$BlackPoint = 42,
  [double]$Gamma = 0.85,
  [int]$AlphaCutoff = 16
)

$ErrorActionPreference = "Stop"

$assetNames = @(
  "owl-on-branch-01.png",
  "raven-01.png",
  "scissor-tailed-flycatcher-01.png",
  "red-eyed-vireo-01.png",
  "common-flicker-tree-01.png",
  "leaf-vine-01.png",
  "feathered-eye-01.png",
  "one-eyed-gentleman-01.png",
  "bow-tied-crocodile-01.png",
  "caped-rabbit-01.png",
  "orb-balancing-slug-01.png",
  "eye-flower-sentinel-01.png"
)

Add-Type -AssemblyName System.Drawing

Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

public static class CromblogDoodleAlpha
{
    public static void Prepare(
        string path,
        int whitePoint,
        int blackPoint,
        double gamma,
        int alphaCutoff)
    {
        Bitmap source;
        using (Image loaded = Image.FromFile(path))
        {
            source = new Bitmap(loaded.Width, loaded.Height, PixelFormat.Format32bppArgb);
            using (Graphics graphics = Graphics.FromImage(source))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.DrawImageUnscaled(loaded, 0, 0);
            }
        }

        Bitmap output = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb);
        Rectangle bounds = new Rectangle(0, 0, source.Width, source.Height);
        BitmapData sourceData = source.LockBits(
            bounds,
            ImageLockMode.ReadOnly,
            PixelFormat.Format32bppArgb);
        BitmapData outputData = output.LockBits(
            bounds,
            ImageLockMode.WriteOnly,
            PixelFormat.Format32bppArgb);

        int sourceBytes = Math.Abs(sourceData.Stride) * source.Height;
        int outputBytes = Math.Abs(outputData.Stride) * output.Height;
        byte[] sourcePixels = new byte[sourceBytes];
        byte[] outputPixels = new byte[outputBytes];
        Marshal.Copy(sourceData.Scan0, sourcePixels, 0, sourceBytes);

        for (int y = 0; y < source.Height; y++)
        {
            int sourceRow = y * sourceData.Stride;
            int outputRow = y * outputData.Stride;

            for (int x = 0; x < source.Width; x++)
            {
                int sourceIndex = sourceRow + (x * 4);
                int outputIndex = outputRow + (x * 4);
                int blue = sourcePixels[sourceIndex];
                int green = sourcePixels[sourceIndex + 1];
                int red = sourcePixels[sourceIndex + 2];
                int sourceAlpha = sourcePixels[sourceIndex + 3];
                int luminance = (54 * red + 183 * green + 19 * blue) >> 8;

                double normalized;
                if (luminance >= whitePoint)
                {
                    normalized = 0;
                }
                else if (luminance <= blackPoint)
                {
                    normalized = 1;
                }
                else
                {
                    normalized = (double)(whitePoint - luminance) /
                        (whitePoint - blackPoint);
                }

                int maskAlpha = (int)Math.Round(255 * Math.Pow(normalized, gamma));
                if (maskAlpha < alphaCutoff)
                {
                    maskAlpha = 0;
                }

                int finalAlpha = (sourceAlpha * maskAlpha) / 255;
                if (finalAlpha < alphaCutoff)
                {
                    finalAlpha = 0;
                }
                outputPixels[outputIndex] = 23;
                outputPixels[outputIndex + 1] = 24;
                outputPixels[outputIndex + 2] = 22;
                outputPixels[outputIndex + 3] = (byte)finalAlpha;
            }
        }

        Marshal.Copy(outputPixels, 0, outputData.Scan0, outputBytes);
        source.UnlockBits(sourceData);
        output.UnlockBits(outputData);
        source.Dispose();

        string temporaryPath = path + ".prepared.png";
        output.Save(temporaryPath, ImageFormat.Png);
        output.Dispose();
        File.Copy(temporaryPath, path, true);
        File.Delete(temporaryPath);
    }
}
"@

$resolvedDirectory = [System.IO.Path]::GetFullPath($AssetDirectory)

foreach ($assetName in $assetNames) {
  $assetPath = Join-Path $resolvedDirectory $assetName
  if (-not (Test-Path -LiteralPath $assetPath -PathType Leaf)) {
    throw "Missing approved doodle asset: $assetPath"
  }

  [CromblogDoodleAlpha]::Prepare(
    $assetPath,
    $WhitePoint,
    $BlackPoint,
    $Gamma,
    $AlphaCutoff
  )

  Write-Host "Prepared $assetName"
}
