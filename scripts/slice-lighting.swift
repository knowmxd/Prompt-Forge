import Foundation
import CoreGraphics
import ImageIO

func cropSheet(inputPath: String, outDir: String, prefix: String) {
    guard let url = CFURLCreateWithFileSystemPath(kCFAllocatorDefault, inputPath as CFString, .cfurlposixPathStyle, false),
          let source = CGImageSourceCreateWithURL(url, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
        print("Failed to load \(inputPath)")
        return
    }
    
    let totalW = image.width
    let totalH = image.height
    let cellW = totalW / 3
    let cellH = totalH / 3
    
    try? FileManager.default.createDirectory(atPath: outDir, withIntermediateDirectories: true)
    
    var index = 1
    for row in 0..<3 {
        for col in 0..<3 {
            // Inset: 6px from left and right, 4px from top, and 36px from bottom to crop out baked-in text label
            let leftInset: CGFloat = 6.0
            let topInset: CGFloat = 4.0
            let bottomCut: CGFloat = 36.0
            
            let x = CGFloat(col * cellW) + leftInset
            let y = CGFloat(row * cellH) + topInset
            let w = CGFloat(cellW) - (leftInset * 2)
            let h = CGFloat(cellH) - topInset - bottomCut
            
            let rect = CGRect(x: x, y: y, width: w, height: h)
            guard let cropped = image.cropping(to: rect) else {
                continue
            }
            
            let outPath = String(format: "%@/%@_%02d.jpg", outDir, prefix, index)
            guard let destUrl = CFURLCreateWithFileSystemPath(kCFAllocatorDefault, outPath as CFString, .cfurlposixPathStyle, false),
                  let dest = CGImageDestinationCreateWithURL(destUrl, "public.jpeg" as CFString, 1, nil) else {
                continue
            }
            
            let options: [CFString: Any] = [
                kCGImageDestinationLossyCompressionQuality: 0.94
            ]
            CGImageDestinationAddImage(dest, cropped, options as CFDictionary)
            if CGImageDestinationFinalize(dest) {
                print("Wrote \(outPath) (\(cropped.width)x\(cropped.height))")
            }
            index += 1
        }
    }
}

let args = CommandLine.arguments
if args.count >= 4 {
    cropSheet(inputPath: args[1], outDir: args[2], prefix: args[3])
} else {
    print("Usage: swift slice.swift <input> <outDir> <prefix>")
}
